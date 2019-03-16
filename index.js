require('dotenv').config()

var port = process.env.PORT || 3000;

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var redis = require('redis');
var redisClient = redis.createClient(); // this creates a new client

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const leadboardRouter = require("./Routes/leaderboardRouter");

server.listen(port);
console.log("server started on port " + port);

// Connecting to the database
const con = mongoose
  .connect(
    process.env.DB_ADDRESS,
    { useNewUrlParser: true } //need this for api support
  )
  .then(() => console.log("mongoDB connected"))
  .catch(err => console.log(err));
  
  
// redis database
redisClient.on('connect', function() {
    console.log('Redis client connected');
});

redisClient.on('error', function (err) {
    console.log('Something went wrong ' + err);
});


redisClient.set('my test key', 'my test value', redis.print);
redisClient.get('my test key', function (error, result) {
    if (error) {
        console.log(error);
        throw error;
    }
    console.log('GET result ->' + result);
});

// setting body parser middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('socketio', io);

// API routes
app.use('/api/leaderboard', leadboardRouter);


// Persistent Socket Connection

var players = [];

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/admin.html');
});

io.on('connection', function (socket) {
  console.log('...a user connected...');
  socket.on('disconnect', function(){
    console.log('...a user disconnected...');
  });  
});

