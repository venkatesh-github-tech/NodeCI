require("../models/User");
jest.setTimeout("80000");
const mongoose = require("mongoose");
require("dotenv").config();
const keys = require("../config/keys");

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

afterAll(() => {
  mongoose.disconnect();
});
