var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admin123@ds026658.mlab.com:26658/inspireonlinedb', { useNewUrlParser: true });

module.exports = {mongoose};
