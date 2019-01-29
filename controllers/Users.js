var {mongoose} = require('../MongoDB/dbConnection');
var {User}     = require('../MongoDB/Models/user');

var express     = require('express');
var APIRouter  = express.Router();
const fs        = require('fs');

var {authenticate} = require('./middleware/authenticate')

APIRouter.get('/user', (request,response)=>{
    response.send('Entering the page of certain user');
});

APIRouter.get('/profile', authenticate, (request, response) => {
    response.send('yay');    
});

APIRouter.get('/logout', (request, response)=>{

    request.session.destroy((err)=>{
        response.send({});
    });
        
});

APIRouter.post('/register', (request, response)=>{
   var result = registerUser(request.body);
   result.then((result)=>
   {
        return result.generateAuthToken().then((token)=>{
            
            var now = new Date().toString();

            var log = (`${now}: [NEW USER] - Success registering ${request.body.login} into the database`)
    
            fs.appendFile('server.log', log + '\n', (err)=>{
                if(err)
                    console.log('Unable to append to server.log');
            });
        
            var JSONResponse = 
            {
                user: result.username,
            };
            console.log(JSONResponse);
            response.status(200).header('x-auth',token).send(JSON.stringify(JSONResponse));
        });    

   },
   (error)=>
   {
        var now = new Date().toString();

        var log = (`${now}: [ERROR] - Failed while registering ${request.body.login} into the database. Error: ${error}`)

        fs.appendFile('server.log', log + '\n', (err)=>{
            if(err)
                console.log('Unable to append to server.log');
        });

        response.status(400).send(error);
   });

});

APIRouter.post('/login', (request, response) => {

    console.log(request.body.login);
    console.log(request.body.password);
    User.findByCredentials(request.body.login, request.body.password).then((user)=>
    {
        return user.generateAuthToken().then((token)=>{
            response.header('x-auth', token).send({logged:true});
        });
    }).catch((error)=>{
        response.status(400).send();
    });
});

APIRouter.post('/APIRouter/login', (request, response) => {

    var query = loginUser(request.body);
    var JSONResponse = {};

    query.exec((err,result)=>
    {
        if(result == null)
        {
            JSONResponse = { logged: false };
            response.send(JSON.stringify(JSONResponse));
        }
        else
        {
            JSONResponse = { logged: true };
            response.send(JSON.stringify(JSONResponse));
        }
    });

});

function registerUser(registerForm) 
{
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
module.exports = APIRouter;