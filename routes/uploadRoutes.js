const AWS = require("aws-sdk");
const keys = require("../config/keys");
const uuid = require("uuid/v1");
const requireLogin = require("../middlewares/requireLogin");

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
  region: "us-west-1",
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

  app.put("/api/deleteImage", requireLogin, async (req, res) => {
    const { existingImage } = req.body;
    //const key = existingImage.substring(existingImage.indexOf("/") + 1);
    console.log("AWS will delete the key...", existingImage);
    var params = {
      Bucket: "venkat-blog-bucket",
      Key: existingImage,
    };
    try {
      await s3
        .deleteObject(params, function (err, data) {
          if (err) console.log(err, err.stack);
          else {
            console.log(data);
            res.send(data);
          } //successful response of deletion
        })
        .promise();
    } catch (e) {
      res.send(e);
    }
  });
};
