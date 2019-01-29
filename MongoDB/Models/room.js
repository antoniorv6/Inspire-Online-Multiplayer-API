var mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema(
    {
        roomID:
        {
            type: Number,
            required: true
        },
        roomname:
        {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        password:
        {
            type: String,
            required: false,
            trim: true,
            minlength: 1
        },
        usersconnected: [{
            username: { type:String, required: true }
        }]
    
    }
);

RoomSchema.methods.AddUser = function(username)
{
    var room = this;
    room.usersconnected = room.usersconnected.concat([{username}]);
    return room.save().then(()=>{return true});
}

RoomSchema.statics.JoinUserIntoRoom = function(roomID, username)
{
    var Room = this;

    return Room.findOne({roomID}).then((room)=>{
        return room.AddUser(username)
    });
}


var Room = mongoose.model('Room', RoomSchema);


module.exports = {Room}