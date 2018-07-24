const GibberishAES = require('gibberish-aes/dist/gibberish-aes-1.0.0');
const crypto = require('crypto');

const pass = Buffer.from('MySecretPass');

const enc = new Buffer(GibberishAES.enc('This is a top secret message innit', pass.toString()), 'base64');

console.log('Expected:', GibberishAES.dec(enc.toString('base64'), pass.toString()));

const passHash = crypto.createHash('md5').update(pass, 'utf-8').digest();

const salt = enc.slice(8, 16);
const data = enc.slice(16, enc.length);
const pbe = generateKey(pass, salt);
const cipher = crypto.createDecipheriv('aes-256-cbc', pbe.key, pbe.iv);

let dec = cipher.update(data);
dec = Buffer.concat([dec, cipher.final()]);

console.log('dec', dec.toString('utf8'));

function md5(buffer) {
    return crypto.createHash('md5').update(buffer).digest();
}

function generateKey(password, salt) {
  const rounds = 3;
  md5Hash = [];
  result = Buffer.alloc(48);
  data00 = Buffer.concat([password, salt]);
  md5Hash[0] = md5(data00);
  result = md5Hash[0];
  for (let i = 1; i < rounds; i++) {
    md5Hash[i] = md5(Buffer.concat([md5Hash[i-1], data00]));
    result = Buffer.concat([result, md5Hash[i]]);
  }
  return {
      key: result.slice(00, 32),
      iv:  result.slice(32, 48)
  }
}
