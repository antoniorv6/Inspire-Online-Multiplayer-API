const mongoose = require('mongoose');
const validator = require('validator');
const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcryptjs');

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

UserSchema.statics.findByCredentials = function(username, password)
{
    var User = this;

    return User.findOne({username}).then((user)=>{
        if(!user)
            return Promise.reject();
        
    return new Promise((resolve, reject)=>{
            bcrypt.compare(password, user.password, (error, result)=>{
                if(result)
                    resolve(user)
                else
                    reject();
            });
        });
    });
};

UserSchema.pre('save', function (next){
    var user = this;

    if(user.isModified('password'))
    {
        bcrypt.genSalt(10, (err,salt)=>{
           bcrypt.hash(user.password, salt, (err,hash)=>{
               user.password = hash;
               next();
           }); 
        });
    }
    else
    {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};

