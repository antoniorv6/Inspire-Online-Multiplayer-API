const mongoose = require('mongoose');

var ScoreSchema = new mongoose.Schema({
    userID:
    {
        type: String,
        required: true
    },
    victories:
    {
        type: Number,
        required: false,
        default: 0
    },
    competitiveVictories:
    {
        type: Number,
        required: false,
        default: 0
    },
    competitiveMatchesPlayed:
    {
        type: Number,
        required: false,
        default: 0
    },
    matchRegistry:[{
        date : {
            type: Date,
            default : Date.now()
        },
        usersPlaying: {
            type: String
        },
        userPosition:{
            type: Number
        },
        map: {
            type: Number
        },
        userTime: {
            type: Number
        }
    }],
    compRank: 
    { 
        type: Number , 
        default: -1
    },
    compScore:
    {
        type: Number,
        default: -1
    }
});

ScoreSchema.methods.UpdateNormalMatchRegistryScore = function(newDate, newUsers, newUserPosition, newMap, newUserTime)
{
    var scoreCard = this;
    scoreCard.matchRegistry = scoreCard.matchRegistry.concat([{date: newDate, usersPlaying: newUsers, userPosition: newUserPosition, map: newMap, userTime: newUserTime}]);
    if(newUserPosition == 1)
        scoreCard.victories = scoreCard.victories + 1;

    return scoreCard.save().then(()=>{return true;}, (err)=>{console.log(err);});
}

ScoreSchema.methods.UpdateCompetitiveRegistryScore = function(newDate, newUsers, newUserPosition, newMap, newUserTime)
{
    var scoreCard = this;
    scoreCard.matchRegistry = scoreCard.matchRegistry.concat([{date: newDate, usersPlaying: newUsers, userPosition: newUserPosition, map: newMap, userTime: newUserTime}]);
    if(newUserPosition == 1)
    {
        scoreCard.victories = scoreCard.victories + 1;
        scoreCard.competitiveVictories = scoreCard.competitiveVictories + 1;
    }

    
    if(scoreCard.compRank != -1)
    {
        let counter;
        //compScore calculus
        if(newUserPosition >= 2)
        {
            counter = 50/newUserPosition; 
        }
        else
        {
            counter = Math.floor(12.5 * (-newUserPosition));
        }

        counter *= 1/newUserTime;

        let newcompScore = scoreCard.compScore + counter;
        scoreCard.compScore = newcompScore;
        
        if(newcompScore >= 150)
        {
            scoreCard.compRank = Math.min(4, scoreCard.compRank + 1);
            scoreCard.compScore = 0;
        }
        if(newcompScore <= -100)
        {
            scoreCard.compRank = Math.max(0, scoreCard.compRank - 1);
            scoreCard.compScore = 0;
        }
    }
    else
    {
        if(scoreCard.competitiveMatchesPlayed == 9)
        {
            scoreCard.compRank = Math.floor((scoreCard.competitiveVictories*4)/10);
            scoreCard.compScore = 0;
        }
    }

    scoreCard.competitiveMatchesPlayed++;
    //-------------------------------------------
    
    return scoreCard.save().then(()=>{return true;}, (err)=>{console.log(err);});
}

ScoreSchema.statics.UpdateUserNormalPunctuation = function(userID, newDate, newUsers, newUserPosition, newMap, newUserTime)
{
    var scoregen = this;
    console.log(userID);
    return scoregen.findOne({userID}).then((scoreCard)=>{
        return scoreCard.UpdateNormalMatchRegistryScore(newDate, newUsers, newUserPosition, newMap, newUserTime);
    });
}

ScoreSchema.statics.UpdateUserCompetitivePunctuation = function(userID, newDate, newUsers, newUserPosition, newMap, newUserTime)
{
    var scoregen = this;

    return scoregen.findOne({userID}).then((scoreCard)=>{
        return scoreCard.UpdateCompetitiveRegistryScore(newDate, newUsers, newUserPosition, newMap, newUserTime);
    });
}

var ScoreCard = mongoose.model("ScoreCard", ScoreSchema);

module.exports = {ScoreCard};

