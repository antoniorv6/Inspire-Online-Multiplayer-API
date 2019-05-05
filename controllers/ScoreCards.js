var {mongoose}  = require('../MongoDB/dbConnection');
var {ScoreCard} = require('../MongoDB/Models/score');

var express = require('express');
var APIRouter = express.Router();

APIRouter.post('/newNormalResult', (request, response)=>{
    let requestData = request.body;
    
    let userID = requestData.userID;
    let date   = Date.now();
    let usersParticipating = requestData.contestants;
    let userPosition = requestData.userPos;
    let mapPlayed = requestData.map;
    let userTime = requestData.userTime;

    console.log(userID);
    console.log(requestData);

    ScoreCard.UpdateUserNormalPunctuation(userID, date, usersParticipating, userPosition, mapPlayed, userTime).then((result)=>{
        response.send({'result':true})
    },
    (err)=>{
        console.log(err);
        response.status(400).send({'result':false});
    });
});

APIRouter.post('/newCompetitiveResult', (request, response)=>{
    let requestData = request.body;
    
    let userID = requestData.userID;
    let date   = Date.now();
    let usersParticipating = requestData.contestants;
    let userPosition = requestData.userPos;
    let mapPlayed = requestData.map;
    let userTime = requestData.userTime;

    ScoreCard.UpdateUserCompetitivePunctuation(userID, date, usersParticipating, userPosition, mapPlayed, userTime).then((result)=>{
        response.send({'updated':true})
    },
    (err)=>{
        console.log(err);
        response.status(400).send({'result':false});
    });
});

module.exports = APIRouter;