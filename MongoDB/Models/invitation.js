var mongoose = require('mongoose');

var InvitationSchema = new mongoose.Schema(

    {
        invited:
        {
            type:String,
            required:true
        },
        invitator:
        {
            type:String,
            required:true
        },
        roomID:
        {
            type: Number,
            required: true
        }
    }

);

var Invitation = mongoose.model('Invitation', InvitationSchema);

module.exports = {Invitation};

