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
    User.findByCredentials(request.body.login, request.body.password).then((user)=>
    {
        return user.generateAuthToken().then((token)=>{
            response.header('x-auth', token).send({logged:true, username: user.username});
        });
    }).catch((error)=>{
        response.status(400).send();
    });
});

APIRouter.post('/APIRouter/login', (request, response) => {
    User.findByCredentials(request.body.login, request.body.password).then((user)=>
    {
        response.send({logged:true});
    }).catch((error)=>{
        response.status(400).send();
    });
});

APIRouter.delete('/logout', authenticate, (request, response)=>{
    request.user.removeToken(request.token).then(()=>{
        response.status(200).send();
    }, ()=>{
        response.status(400).send();
    });

});

APIRouter.post('/friend', authenticate, (request,response)=>{

    User.findOne({username:request.body.userName}).then((user)=>{
        
        user.addFriendRequest(request.user.username).then((result)=>{
            response.status(200).send(result);
        },
        ()=>{
            response.status(404).send();
        }, ()=>{
        response.status(404).send({error: "User not found"});
    });

});

});

APIRouter.put('/friend', authenticate, (request,response)=>{
    var user = request.body.user;
    user.addFriend(request.body.newFriend).then((result)=>{
        response.status(200).send(result);
    },
    ()=>{
        response.status(400).send();
    })
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

module.exports = APIRouter;