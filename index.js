const GibberishAES = require('gibberish-aes/dist/gibberish-aes-1.0.0');
const crypto = require('crypto');

const pass = Buffer.from('MySecretPass');

const gibenc = GibberishAES.enc('This is a top secret message innit, we\'re trying to make it break on the 64th character', pass.toString());

const enc = new Buffer(gibenc, 'base64');

console.log(gibenc);

console.log('Expected:', GibberishAES.dec(enc.toString('base64'), pass.toString()));

function decrypt(enc, pass) {
  const salt = enc.slice(8, 16);
  const data = enc.slice(16, enc.length);
  const pbe = generateKey(pass, salt);
  const cipher = crypto.createDecipheriv('aes-256-cbc', pbe.key, pbe.iv);
  
  let dec = cipher.update(data);
  return Buffer.concat([dec, cipher.final()]).toString('utf8');
}

function encrypt(input, pass) {
  const salt = crypto.randomBytes(8);
  const pbe = generateKey(pass, salt);
  const saltBlock = Buffer.concat([Buffer.from('Salted__'), salt]);
  const cipher = crypto.createCipheriv('aes-256-cbc', pbe.key, pbe.iv);

  const enc = cipher.update(input, 'utf8');
  return Buffer.concat([saltBlock, enc, cipher.final()]).toString('base64').match(/.{1,60}/g).join("\n");
}

console.log('dec', decrypt(enc, pass));

const newEnc = encrypt('This is a top secret message innit, we\'re trying to make it break on the 64th character', pass);

console.log('newEnc', newEnc);

console.log('GibberishDec', GibberishAES.dec(newEnc, pass.toString()));

function md5(buffer) {
    return crypto.createHash('md5').update(buffer).digest();
}

function generateKey(password, salt) {
  const rounds = 3;
  md5Hash = [];
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
