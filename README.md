# Gibberish compatible AES

```
const aes = require('./index');

const enc = aes.enc('testing', 'pass');
console.log(enc);
const dec = aes.dec(enc, 'pass');
console.log(dec);
```
