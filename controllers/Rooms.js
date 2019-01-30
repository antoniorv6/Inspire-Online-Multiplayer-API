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

APIRouter.post('/joinRoom', (request,response)=>{
    
    Room.JoinUserIntoRoom(request.body.roomID, request.body.user).then(
        (result)=>{
            response.status(200).send({joined:true});
        }).catch(()=>{
            response.status(400).send({joined:false});
        });

});

APIRouter.post('/deleteRoom', (request,response)=>{

    Room.findOneAndDelete({
        roomID: request.body.roomID
    }).then((result)=>{
        if(!result)
                response.status(404).send({deleted:false});

        response.status(200).send({deleted:true, result: result});
    },  
    (error)=>{
        response.status(400).send({deleted:false})
    });

});

APIRouter.get('/users', (request,response)=>{
    
    Room.findOne({roomID: request.body.roomID}).then((room)=>{
        response.status(200).send({users : room.usersconnected})
    },
    ).catch(()=>{
        response.status(404).send('Room could not be found');
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