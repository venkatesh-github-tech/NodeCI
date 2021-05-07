const mongoose = require('mongoose');
const User = new mongoose.model('User');

module.exports = ()=> {
    return new User({}).save();
}