const AWS = require("aws-sdk");
const keys = require("../config/keys");
const uuid = require("uuid/v1");
const requireLogin = require("../middlewares/requireLogin");

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
});
module.exports = (app) => {
  app.get("/api/upload", requireLogin, (req, res) => {
    const fileType = req.query.fileType;
    const fileExt = fileType.substring(fileType.indexOf("/") + 1);
    const key = `${req.user.id}/${uuid()}.${fileExt}`;
    s3.getSignedUrl(
      "putObject",
      {
        Bucket: "venkat-blog-bucket",
        ContentType: fileType,
        Key: key,
      },
      (err, url) => res.send({ key, url })
    );
  });
};
