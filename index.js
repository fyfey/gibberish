const crypto = require('crypto');

function enc(input, pass) {
  const salt = crypto.randomBytes(8);
  const pbe = generateKey(Buffer.from(pass), salt);
  const saltBlock = Buffer.concat([Buffer.from('Salted__'), salt]);
  const cipher = crypto.createCipheriv('aes-256-cbc', pbe.key, pbe.iv);

  const enc = cipher.update(input, 'utf8');
    
  return Buffer.concat([saltBlock, enc, cipher.final()])
    .toString('base64')
    .match(/.{1,60}/g).join("\n");
}

function dec(enc, pass) {
  enc = new Buffer(enc, 'base64');
  const salt = enc.slice(8, 16);
  const data = enc.slice(16, enc.length);
  const pbe = generateKey(Buffer.from(pass), salt);
  const cipher = crypto.createDecipheriv('aes-256-cbc', pbe.key, pbe.iv);

  let dec = cipher.update(data);
  return Buffer.concat([dec, cipher.final()]).toString('utf8');
}

function md5(buffer) {
    return crypto.createHash('md5').update(buffer).digest();
}

function generateKey(password, salt) {
  md5Hash = [];
  data00 = Buffer.concat([password, salt]);
  md5Hash[0] = md5(data00);
  result = md5Hash[0];
  for (let i = 1; i < 3; i++) {
    md5Hash[i] = md5(Buffer.concat([md5Hash[i-1], data00]));
    result = Buffer.concat([result, md5Hash[i]]);
  }
  return {
      key: result.slice(0, 32),
      iv:  result.slice(32, 48)
  }
}

module.exports = { enc, dec };
