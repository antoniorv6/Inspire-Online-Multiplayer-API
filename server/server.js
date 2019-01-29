const express = require('express');
const hbs = require('hbs');
var approot = require('app-root-path');
var bodyParser = require('body-parser');
var fs = require('fs');

var UserController = require('../controllers/Users');
var RoomController = require('../controllers/Rooms');

var API = express();

hbs.registerPartials(approot + "/views/partials");

API.set('view engine', 'hbs');

API.use(express.static(approot + '/public'));

API.use(bodyParser.json());

//############### Declaration of API Controllers ################

API.use('/users', UserController);
API.use('/rooms', RoomController);

//##############################################################

API.get('/', (request, response)=>
{
    response.render('index.hbs', {user:undefined});
});

API.get('/inspire', (request, response)=>{

    response.render('inspire.hbs');
});

API.get('/news', (request, response)=>{

    response.render('news.hbs');
});

API.get('/activeusers', (request, response) => {
    response.send('ActiveUsersPage');
});

API.post('/users/addFriend', (request,response)=>{

    response.send('Adding a new friend');

});


var port = process.env.PORT || 1137;
API.listen(port, ()=>{ console.log('Listening to port: ' + port) });