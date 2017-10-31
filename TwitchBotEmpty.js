var tmi = require('tmi.js')
var options = {
	options: {
		debug: true
	},
	connection: {
		cluster: "aws",
		reconnect: true
	},
	identity: {
		username: "Insert Bot Name Here",//Insert Bot Name Here
		password: "oauth:#####################"//You need to insert your oauth key here
	},
	channels : ["roudolpho"]
};
var client = new tmi.client(options);
client.connect();


client.on('chat', function(channel, username, message, self) {
	
}

client.on('join', function (channel, username, self) {
	
}

client.on('connected', function(address, port){
	
}