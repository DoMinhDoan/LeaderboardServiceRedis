const mongoose = require("mongoose");

const Schema = mongoose.Schema; 

const leaderboardModel = new Schema({
	username: { type: String },
	score: { type: Number },
	updateHistory: { 
		numberUpdate: Number,
		timeChange: [Number]
	}
});
module.exports = mongoose.model('leaderboard', leaderboardModel)