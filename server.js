//
//
// -----   Initiate Sockets & Eruca  -----
//
//

var express = require('express'),
	app = express(app),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	users = [];

server.listen(8000);

app.use(express.static(__dirname)); //serving static files

app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});



//
//
// -----   Sockets Real Time Chat -----
//
//

io.sockets.on('connection', function(socket) {
	socket.on('new user', function(data, callback){
		//check for -1 else exists
		if (users.indexOf(data) != -1) {
			callback(false);
		} else {
			callback(true);
			socket.username = data;
			users.push(socket.username);
			io.sockets.emit('usernames', users);
		}
	});

	socket.on('send message', function(data) {
		io.sockets.emit('new message', {msg: data, username: socket.username});
	});

	socket.on('disconnect', function(data){
		if(socket.username) return;
		users.splice(users.indexOf(socket.username), 1);
		io.sockets.emit('usernames', users);
	});
});




//
//
// -----   Eurca Client Setup & Functions -----
//
//

var clients = {};
  
var EurecaServer = require('eureca.io').EurecaServer; //Include Eureca class

var eurecaServer = new EurecaServer({allow:['setId', 'spawnActor', 'spawnBarrels', 'killActor', 'updateState']}); //New instance include the functions

eurecaServer.attach(server); //http attach



//Actor Joined
eurecaServer.onConnect(function (conn) {    
    console.log('New Client id=%s ', conn.id, conn.remoteAddress);
	
    var remote = eurecaServer.getClient(conn.id);    
	
	//add the player
	clients[conn.id] = {id:conn.id, remote:remote}
	//assign id
	remote.setId(conn.id);	
});


//Actor Left
eurecaServer.onDisconnect(function (conn) {    
    console.log('Client disconnected ', conn.id);
	
	var removeId = clients[conn.id].id;
	
	delete clients[conn.id];
	
	for (var c in clients)
	{
		var remote = clients[c].remote;
		remote.kill(conn.id);
	}	
});


//Is everything ready?
eurecaServer.exports.handshake = function()
{
	for (var c in clients)
	{
		var remote = clients[c].remote;
		for (var cc in clients)
		{		
			//Update the players position on the canvas
			var x = clients[cc].laststate ? clients[cc].laststate.x:  0;
			var y = clients[cc].laststate ? clients[cc].laststate.y:  0;

			remote.spawnActor(clients[cc].id, x, y);		
		}
	}
}

eurecaServer.exports.handleKeys = function (keys) {
	var conn = this.connection;
	var updatedClient = clients[conn.id];
	
	for (var c in clients)
	{
		var remote = clients[c].remote;
		remote.updateState(updatedClient.id, keys);

		clients[c].laststate = keys;
	}
}
