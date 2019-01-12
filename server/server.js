const express = require('express');
const hbs = require('hbs');
var approot = require('app-root-path');
var bodyParser = require('body-parser');
var fs = require('fs');
var sessionStorage = require('express-session')

var userHandler = require('./userManagement');

var API = express();

hbs.registerPartials(approot + "/views/partials");

API.set('view engine', 'hbs');

API.use(express.static(approot + '/public'));

API.use(sessionStorage({secret: 'Seeeecreet'}));

API.use(bodyParser.json());

var session;

API.get('/', (request, response)=>
{
    session = request.session;
    console.log(session.user);
    response.render('index.hbs', { user: session.user });
});

API.get('/inspire', (request, response)=>{

    response.render('inspire.hbs');
});

API.get('/news', (request, response)=>{

    response.render('news.hbs');
});

API.get('/user', (request, response) => {

    session = request.session;
    if(session.user == undefined)
        response.redirect('/');
    
        response.render('user.hbs', { user: result })
});

API.get('/logout', (request, response)=>{

    request.session.destroy((err)=>{
        response.send({});
    });
        
});

API.post('/users/register', (request, response)=>{
   var result = userHandler.register(request.body);
   result.then((result)=>
   {
        var now = new Date().toString();

        var log = (`${now}: [NEW USER] - Success registering ${request.body.login} into the database`)
    
        fs.appendFile('server.log', log + '\n', (err)=>{
            if(err)
                console.log('Unable to append to server.log');
        });
        
        var JSONResponse = 
        {
            user: result.username
        };
        console.log(JSONResponse);
        response.status(200).send(JSON.stringify(JSONResponse));
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

API.post('/users/login', (request, response) => {

    var query = userHandler.login(request.body);
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
            session = request.session;
            session.user = request.body.login;
            JSONResponse = { logged: true };
            response.send(JSON.stringify(JSONResponse));
        }
    });

});


API.get('/testGetConn', (request, response)=>{
    console.log('Test GET connection received');
    response.send({received: "ok"});
});

API.post('/testPostConn', (request,response)=>{
    console.log('Test POST connection received');
    response.send(request.body);
});



var port = process.env.PORT || 1137;
API.listen(port, ()=>{ console.log('Listening to port: ' + port) });