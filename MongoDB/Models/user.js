const mongoose = require('mongoose');
const validator = require('validator');
const jwt       = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
    },
    country: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.generateAuthToken = function ()
{
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user.username, access}, 'abc123').toString();

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(()=>{return token});
};

UserSchema.statics.findByToken = function(token)
{
    var User = this;
    var decoded = undefined;

    try
    {
        decoded = jwt.verify(token, 'abc123');
    }
    catch (error)
    {
        return Promise.reject();
    }

    return User.findOne({
        'username': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

var User = mongoose.model('User', UserSchema);

module.exports = {User};

