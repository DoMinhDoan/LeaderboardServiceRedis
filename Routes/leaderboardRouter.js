const express = require("express");
const Leaderboard =  require('../models/leaderboardModel');
const leaderboardRouter = express.Router();
leaderboardRouter.route('/')
    .get((req, res) => {
        Leaderboard.find({}, (err, leaderboard) => {
			res.json(leaderboard);
        })  
    })
    .post((req, res) => {
        let leaderboard = new Leaderboard(req.body);
        leaderboard.save();
        res.status(201).send(leaderboard);
    })

// Middleware 
leaderboardRouter.use('/:userId', (req, res, next)=>{
    Leaderboard.findById( req.params.userId, (err,leaderboard)=>{
        if(err) {
            res.status(500).send(err);
		}
        else {
            req.leaderboard = leaderboard;
            next()
        }
    })

})
leaderboardRouter.route('/:userId')
    .get((req, res) => {
        res.json(req.leaderboard);
    })	//get
    .put((req,res) => {
		
		if(req.body.username)
		{			
			req.leaderboard.username = req.body.username;
		}
		
		if(req.body.score && req.leaderboard.score != req.body.score)
		{
			var seconds = new Date().getTime() / 1000;
			
			req.leaderboard.updateHistory.numberUpdate = req.leaderboard.updateHistory.numberUpdate + 1;			
			req.leaderboard.updateHistory.timeChange.push(seconds);
			
			// emit one signal to client
			var io = req.app.get('socketio');			
			io.emit('UpdateScore', req.leaderboard.username);
		}
		
		if(req.body.score)
		{
			req.leaderboard.score = req.body.score;
		}
		
		if(req.body.username || req.body.score)
		{
			req.leaderboard.save();
			res.json(req.leaderboard);
		}
		
    })	//put
    .delete((req,res)=>{
        req.leaderboard.remove(err => {
            if(err){
                res.status(500).send(err);
            }
            else{
                res.status(204).send('removed');
            }
        })
    })	//delete
	 
module.exports = leaderboardRouter;