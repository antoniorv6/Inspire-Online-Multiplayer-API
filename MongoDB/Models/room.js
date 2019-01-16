var mongoose = require('mongoose');

var Room = mongoose.model('Room',{
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
    }

});

module.exports = {Room}