const express = require('express');
const hbs = require('hbs');
var path = require('path');

var API = express();

hbs.registerPartials(__dirname + "/views/partials");

API.set('view engine', 'hbs');

API.use(express.static(path.join(__dirname, 'public')));

API.get('/', (requirement, response)=>{

    response.render('index.hbs');

});

API.get('/inspire', (requirement, response)=>{

    response.render('inspire.hbs');
});

API.get('/news', (requirement, response)=>{

    response.render('news.hbs');
});

var port = process.env.PORT || 1137;
API.listen(port, ()=>{ console.log('Listening to port: ' + port) });