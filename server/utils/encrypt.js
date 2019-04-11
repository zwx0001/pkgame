const crypto = require("crypto");
const jwt = require("jsonwebtoken");

function hash(data, key) {
  const secret = "abcdefg";
  const hash = crypto //生成单向加密密码
    .createHmac("sha256", secret)
    .update(data)
    .digest("hex");
  return hash;
}

function cipher(data, key) {
  const cipher = crypto.createCipher("aes192", key);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decipher(data, key) {
  const decipher = crypto.createDecipher("aes192", key);
  const encrypted = data;
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function token(data, key) {
  return jwt.sign(data, key);
}

function handlePromiseError(promise) {
  if (!promise || !Promise.prototype.isPrototypeOf(promise)) {
    return new Promise((resolve, reject) => {
      reject(new Error("requires promises as the param"));
    }).catch(err => {
      return [err, null];
    });
  }
  return promise
    .then(function() {
      return [null, ...arguments];
    })
    .catch(err => {
      return [err, null];
    });
}

module.exports = {
  hash,
  cipher,
  decipher,
  token,
  hpe: handlePromiseError
};
