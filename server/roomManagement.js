var {mongoose} = require('../MongoDB/dbConnection');
var {Room}     = require('../MongoDB/Models/room');

var registerRoom = (registerForm) =>
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

var getAllRooms = () => {

    var result = Room.find();

    return result;

};

module.exports = {
    newRoom : registerRoom,
    getAllRooms : getAllRooms
}