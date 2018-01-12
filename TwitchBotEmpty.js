var tmi = require('tmi.js')//tmi is the twitch api
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
	channels : ["xxxxxxxxxxxxxxxx"]//You need to insert your channels key here
};
var client = new tmi.client(options);//creates a connection to twitch
client.connect();

client.on('chat', function(channel, username, message, self) {//runs whenever the a message is sent in the chat
	
}

client.on('join', function (channel, username, self) {//runs when a user joins the chat
	
}

client.on('connected', function(address, port){//runs when the bot first connects to the channel
	
}