var {mongoose} = require('../MongoDB/dbConnection');
var {User}     = require('../MongoDB/Models/user');

var registerUser = (registerForm) => 
{
    console.log(registerForm);
    var newUser = new User(
        {
            username: registerForm.login,
            password: registerForm.password,
            country:  registerForm.country
        }
    );

    var result = newUser.save();

    return result;
}

var loginUser = (loginform) =>
{
    var query = User.findOne(
    {
        username: loginform.login,
        password: loginform.password 
    });
    
    return query;

};

module.exports = {
    register: registerUser,
    login: loginUser
};