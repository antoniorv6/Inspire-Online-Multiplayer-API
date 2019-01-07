const express = require('express');
const hbs = require('hbs');
var approot = require('app-root-path');
var bodyParser = require('body-parser');


var API = express();

hbs.registerPartials(approot + "/views/partials");

API.set('view engine', 'hbs');

API.use(express.static(approot + '/public'));

API.use(bodyParser.json());

API.get('/', (request, response)=>{

    response.render('index.hbs');

});

API.get('/inspire', (request, response)=>{

    response.render('inspire.hbs');
});

API.get('/news', (request, response)=>{

    response.render('news.hbs');
});

API.post('/users/register', (request, response)=>{

    console.log(request.body);
});

var port = process.env.PORT || 1137;
API.listen(port, ()=>{ console.log('Listening to port: ' + port) });