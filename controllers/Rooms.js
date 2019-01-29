var {mongoose} = require('../MongoDB/dbConnection');
var {Room}     = require('../MongoDB/Models/room');

var express = require('express');
var APIRouter = express.Router();

APIRouter.get('/', (request,response)=>{

    var result = getAllRooms();

    result.then((result)=>{

        response.send({"result": result});

    }, (error)=>{

        response.send('Error');
    });

});

APIRouter.post('/registerRoom', (request, response)=>{

    var result = registerRoom(request.body);

    result.then((result)=>{
        response.send({'result':true});
    }, 
    (err)=>{
        response.status(400).send({'result':false});
    });

});

function registerRoom(registerForm)
{
    var newRoom = new Room(
        {
            roomID:   registerForm.roomID,
            roomname: registerForm.roomname,
            password: registerForm.password
        }
    );

    var result = newRoom.save();

    return result;
};

function getAllRooms(){

    var result = Room.find();

    return result;

};


module.exports = APIRouter;