/**
* @fileoverview JWT secrets 
*/
const secret = "summer is coming";
const signOptions = {
  issuer: "sampleProject",
  subject: "JWT",
  audience: "store-users",
  expiresIn: "12h",
  algorithm: "RS256"
};

var verifyOptions = {
  issuer: "sampleProject",
  subject: "JWT",
  audience: "store-users",
  expiresIn: "12h",
  algorithm: ["RS256"]
 };

module.exports = {
  secret: secret,
  signOptions: signOptions,
  verifyOptions: verifyOptions
}