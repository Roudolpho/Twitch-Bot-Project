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

var viewers = [];

var gameType = "place";

var mods = ["roudolpho","roudolbot"];

//place board stuff
var board = []
var boardHeight = 101
var boardWidth = 180

var lifeboard = []
var placeboard = []

C = [600,0,0,10];


legalchars = ["A", "B", "C", "D", "E", "F","a", "b", "c", "d", "e", "f", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

function update(){
	
}
setInterval(update, 500);

function isHexColor(color) {
	allgood = true;
	if(color.substring(0,1) != "#"){
		//console.log("not good");
		return false;
	}
	color = color.replace("#", '');
	//console.log("checking");
	colors = color.split("");
	if(colors.length == 6){
		//console.log("good length");
		chars = color.split("");
		//console.log(chars);
		for(i = 0;i<6;i++){
			//console.log("letter1");
			allgood = false;
			for(k=0;k<legalchars.length;k++) {
				//console.log(chars[i] + " " + legalchars[k]);
				if(chars[i] == legalchars[k]) {
					//console.log("good char");
					allgood = true;
				}
				
			}
			if (allgood == false) {
				//console.log("not good");
				return false;
			}
		}
		
		return true
		
	}
	//console.log("wrong length");
	return false
}


function drawSquare(x1, x2, y1, y2, color){
	if (x1 > x2) {
							xplus = -1;
						} else {
							xplus = 1;
						}
						if (y1 > y2) {
							yplus = -1;
						} else {
							yplus = 1;
						}
						for(i = 0;Math.abs(i) <= Math.abs(x2 - x1); i += xplus){
							board[y1][x1 + xplus * i] = color;
						}
						for(i = 0;Math.abs(i) <= Math.abs(x2 - x1); i += xplus){
							board[y2][x1 + xplus * i] = color;
						}
						for(i = 0;Math.abs(i) <= Math.abs(y2 - y1); i += xplus){
							board[y1 + yplus * i][x1] = color;
						}
						for(i = 0;Math.abs(i) <= Math.abs(y2 - y1); i += xplus){
							board[y1 + yplus * i][x2] = color;
						}
						
}


function playLife(step) {
	
    lifeInterval = setInterval(playLifeGame, step);
	lifeboard = board;
	placeboard = board;
	gameType = "life"
	for(i = 0;i < boardHeight; i++) {
		for(k = 0;k < boardWidth; k++) {
			if(board[i][k] == "#000000"){
				lifeboard[i][k] = "#000000";
			} else {
				lifeboard[i][k] = "#ffffff";
			}
		}
	}
	board = lifeboard;
}


function playLifeGame() {
	//console.log("check new");
	lifeboard = [];
	for(i = 0;i < boardHeight; i++) {
		lifeboard.push([]);
		for(k = 0;k < boardWidth; k++) {
			surrounding = 0;
			for(j = -1; j<=1; j++){
				for(l = -1;l<=1;l++){
					if((j != 0 || l != 0)){
						jnew = j + i;
						lnew = l + k;
						if(i + j == boardHeight){
							jnew = 0
						}
						if(k + l == boardWidth){
						lnew = 0
						}
						if(i + j == -1){
							jnew = boardHeight - 1;
						}
						if(k + l == -1){
							lnew = boardWidth - 1;
						}
						
						//console.log(j + i);
						//console.log(l + k);
						if(board[jnew][lnew] != "#000000"){
							surrounding += 1;
							//console.log(k + " " + i + " has neighbor " + j + " " + l + "  " + board[j+i][l+k]);
						}
					
					}
				}
			}
			
			if(board[i][k] != "#000000"){
				if(surrounding != 3 && surrounding != 2){
					lifeboard[i].push("#000000");
					
				} else {
					lifeboard[i].push("#ffffff");
				}
			} else {
				if(surrounding == 3 ){
					lifeboard[i].push("#ffffff");
					//console.log(i + " " + k);
				} else {
					lifeboard[i].push("#000000");
				}
				
			}
			
			
		}
	}
	board = lifeboard;
	//console.log(lifeboard);
	if(gameType == "place"){
		board = placeboard;
	}
}


function endLife(){
	clearInterval(lifeInterval);
	gameType = "place";
	board = placeboard;
}


var jokes = [
["I bought some shoes off of a drug dealer.","I don't know what he laced them with but I've been trippin' all day."],
["What do you call the security guards outside of Samsung.","The guardians of the galaxy!"],
["I think I want a job cleaning mirrors.","It's something I could really see myself doing."],
["Why are there fences around a graveyard?","Because people are dying to get in!"],
["Whats a frog's favorite drink?","Craoka Cola!"],
["Two satellites decided to get married.","The wedding wasn't much, but the reception was incredible!"],
["What do you call a belt made out of watches?","A waist of time!"],
["What kind of shoes does a pedophile wear?","White vans."],
["A man went to the zoo.","All they had to exhibit was a dog. It was a shih tzu."],
["Look in the mirror...","4Head"]]



//All my commands
client.on('chat', function(channel, username, message, self) {
	
	if(message.charAt(0) == "~") {
		//splits up the command
		mes = message.toString();
		com = mes.replace("~", '');
		com = com.toLowerCase();
		words = com.split(" ");
		command = words[0];
		if(command == "hi") {
			client.action(channel, "Hi there " + username['display-name'] + "!");
			}
		if(command == "joke") {
			n = Math.random()*jokes.length;
			console.log(n.toString());
			n = Math.floor(n);
			console.log(n.toString());
			client.action(channel, jokes[n][0]);
			client.action(channel, jokes[n][1]);
			
		}
		if(command == "ascii") {
			if(words.length > 1) {
			if(words[1] == "bunny") {
				client.action(channel, " ()  ()");
				client.action(channel, " (^*^)");
				client.action(channel, "(U U)o");
			}
			if(words[1] == "datboi") {
				client.action(channel, " !**>");
				client.action(channel, " -O-");
				client.action(channel, " /T\\ ");
				client.action(channel, " /-\\ ");
				client.action(channel, " |+| ");
				client.action(channel, " \\-/ ");
				
			}
			if(words[1] == "shrug") {
				client.action(channel, " ¯\\_(ツ)_/¯");
				
				
			}
			if(words[1] == "lenny") {
				client.action(channel, "( ͡° ͜ʖ ͡°)");
				
				
			}
			if(words[1] == "warlizard") {
				client.action(channel, " ಠ_ಠ");
				
				
			}
			if(words[1] == "tableflip") {
				client.action(channel, " (╯°□°）╯︵ ┻━┻");
				
				
			}
			if(words[1] == "rageflip") {
				client.action(channel, " (ﾉಥ益ಥ）ﾉ﻿ ┻━┻");
				
				
			}
			if(words[1] == "doubleflip") {
				client.action(channel, " ┻━┻ ︵ヽ(`Д´)ﾉ︵﻿ ┻━┻");
				
				
			}
			if(words[1] == "nyan") {
				client.action(channel, " ~=[,,_,,]:3");
				
				
			}
			} else {
				client.action(channel, "Which one?");
			}
		}
		if(command == "challenge") {
			if(words.length > 1) {
				challenger = words[1];
			} else {
				username = challenger;
			}
			client.action(channel, "@" + challenger + " U WOT!!1!");
			client.action(channel, "U WON GO?!???!");
			client.action(channel, "1v1 me hearthstone one const minnions only");
		}
		if(command == "test") {
			
			}
			if (gameType == "place"){
				if(command == "draw" && words.length >= 4) {
					if(parseInt(words[1]) < boardWidth && parseInt(words[2]) < boardHeight && parseInt(words[1]) > -1 && parseInt(words[2]) > -1) {
						if(isHexColor(words[3])) {
							board[parseInt(words[2])][parseInt(words[1])] = words[3];
							client.action(channel, "Affirmative, have a nice day Kappa !");
						} else {
							client.action(channel, "Thats not a Hexcolor");
						}
					} else {
						client.action(channel, "That place doesn't exist");
					}		
		}
		if(command == "drawsquare") {
			if(words.length < 6) {
				client.action(channel, "not enough parameters");
			} else {
				if (parseInt(words[1]) < boardWidth && parseInt(words[2]) < boardHeight && parseInt(words[1]) > -1 && parseInt(words[2]) > -1 && parseInt(words[3]) < boardWidth && parseInt(words[4]) < boardHeight && parseInt(words[3]) > -1 && parseInt(words[4]) > -1){
					if (isHexColor(words[5])) {
						if (parseInt(words[1]) > parseInt(words[3])) {
							xplus = -1;
						} else {
							xplus = 1;
						}
						if (parseInt(words[2]) > parseInt(words[4])) {
							yplus = -1;
						} else {
							yplus = 1;
						}
						for(i = 0;Math.abs(i) <= Math.abs(parseInt(words[3]) - parseInt(words[1])); i += xplus){
							board[parseInt(words[2])][parseInt(words[1]) + xplus * i] = words[5];
						}
						for(i = 0;Math.abs(i) <= Math.abs(parseInt(words[3]) - parseInt(words[1])); i += xplus){
							board[parseInt(words[4])][parseInt(words[1]) + xplus * i] = words[5];
						}
						for(i = 0;Math.abs(i) <= Math.abs(parseInt(words[4]) - parseInt(words[2])); i += xplus){
							board[parseInt(words[2]) + yplus * i][parseInt(words[1])] = words[5];
						}
						for(i = 0;Math.abs(i) <= Math.abs(parseInt(words[4]) - parseInt(words[2])); i += xplus){
							board[parseInt(words[2]) + yplus * i][parseInt(words[3])] = words[5];
						}
						client.action(channel, "Affirmative, have a nice day Kappa !");
					} else {
						client.action(channel, "Thats not a Hexcolor");
					}
				} else {
					client.action(channel, "That place doesn't exist");
				}
			}
		}
			} else {
				
			}
		//My special commands
		for(i = 0; i < mods.length; i++){
			console.log(i + " " + mods[i] + " " + username['display-name']);
			if(username['display-name'] == mods[i] || username == mods[i]) {
				console.log("mod command detected");
				if(command == "c" && words.length == 5){
					C[0] = words[1];
					C[1] = words[2];
					C[2] = words[3];
					C[3] = words[4];
					console.log(C);
				}
				if(command == "resetboard") {
				board = []
				for(i = 0;i < boardHeight; i++) {
					board.push([]);
					for(k = 0;k < boardWidth; k++) {
					board[i].push("#000000");
				}
				}
				//console.log(board);
				
			}
				if (gameType == "place"){
			if(command == "drawimg"){
				if(words.length < 2){
					client.action(channel, "not viable");
				} else {
					if(words.length < 5){
						client.action(channel, "missing parameters");
					} else {
						if(parseInt(words[1]) < boardWidth && parseInt(words[2]) < boardHeight && parseInt(words[1]) > -1 && parseInt(words[2]) > -1 && isHexColor(words[4])) {
							if(words[3] == "warlizard" && parseInt(words[1]) < boardWidth - 14 && parseInt(words[2]) < boardHeight - 9) {
								
								eye2x = 0;
								eye2y = 8;
								//eye1
								board[parseInt(words[2]) + 2][parseInt(words[1]) + 0] = words[4];
								board[parseInt(words[2]) + 3][parseInt(words[1]) + 0] = words[4];
								board[parseInt(words[2]) + 4][parseInt(words[1]) + 0] = words[4];
								board[parseInt(words[2]) + 5][parseInt(words[1]) + 0] = words[4];
								board[parseInt(words[2]) + 6][parseInt(words[1]) + 0] = words[4];
								board[parseInt(words[2]) + 6][parseInt(words[1]) + 1] = words[4];
								board[parseInt(words[2]) + 6][parseInt(words[1]) + 2] = words[4];
								board[parseInt(words[2]) + 6][parseInt(words[1]) + 3] = words[4];
								board[parseInt(words[2]) + 6][parseInt(words[1]) + 4] = words[4];
								board[parseInt(words[2]) + 5][parseInt(words[1]) + 4] = words[4];
								board[parseInt(words[2]) + 4][parseInt(words[1]) + 4] = words[4];
								board[parseInt(words[2]) + 3][parseInt(words[1]) + 4] = words[4];
								board[parseInt(words[2]) + 2][parseInt(words[1]) + 4] = words[4];
								board[parseInt(words[2]) + 2][parseInt(words[1]) + 3] = words[4];
								board[parseInt(words[2]) + 2][parseInt(words[1]) + 2] = words[4];
								board[parseInt(words[2]) + 2][parseInt(words[1]) + 1] = words[4];
								board[parseInt(words[2]) + 2][parseInt(words[1]) + 5] = words[4];
								board[parseInt(words[2]) + 1][parseInt(words[1]) + 5] = words[4];
								board[parseInt(words[2]) + 0][parseInt(words[1]) + 5] = words[4];
								board[parseInt(words[2]) + 0][parseInt(words[1]) + 4] = words[4];
								board[parseInt(words[2]) + 4][parseInt(words[1]) + 2] = words[4];
								
								//eye2
								board[parseInt(words[2]) + 2 + eye2x][parseInt(words[1]) + 0 + eye2y] = words[4];
								board[parseInt(words[2]) + 3 + eye2x][parseInt(words[1]) + 0 + eye2y] = words[4];
								board[parseInt(words[2]) + 4 + eye2x][parseInt(words[1]) + 0 + eye2y] = words[4];
								board[parseInt(words[2]) + 5 + eye2x][parseInt(words[1]) + 0 + eye2y] = words[4];
								board[parseInt(words[2]) + 6 + eye2x][parseInt(words[1]) + 0 + eye2y] = words[4];
								board[parseInt(words[2]) + 6 + eye2x][parseInt(words[1]) + 1 + eye2y] = words[4];
								board[parseInt(words[2]) + 6 + eye2x][parseInt(words[1]) + 2 + eye2y] = words[4];
								board[parseInt(words[2]) + 6 + eye2x][parseInt(words[1]) + 3 + eye2y] = words[4];
								board[parseInt(words[2]) + 6 + eye2x][parseInt(words[1]) + 4 + eye2y] = words[4];
								board[parseInt(words[2]) + 5 + eye2x][parseInt(words[1]) + 4 + eye2y] = words[4];
								board[parseInt(words[2]) + 4 + eye2x][parseInt(words[1]) + 4 + eye2y] = words[4];
								board[parseInt(words[2]) + 3 + eye2x][parseInt(words[1]) + 4 + eye2y] = words[4];
								board[parseInt(words[2]) + 2 + eye2x][parseInt(words[1]) + 4 + eye2y] = words[4];
								board[parseInt(words[2]) + 2 + eye2x][parseInt(words[1]) + 3 + eye2y] = words[4];
								board[parseInt(words[2]) + 2 + eye2x][parseInt(words[1]) + 2 + eye2y] = words[4];
								board[parseInt(words[2]) + 2 + eye2x][parseInt(words[1]) + 1 + eye2y] = words[4];
								board[parseInt(words[2]) + 2 + eye2x][parseInt(words[1]) + 5 + eye2y] = words[4];
								board[parseInt(words[2]) + 1 + eye2x][parseInt(words[1]) + 5 + eye2y] = words[4];
								board[parseInt(words[2]) + 0 + eye2x][parseInt(words[1]) + 5 + eye2y] = words[4];
								board[parseInt(words[2]) + 0 + eye2x][parseInt(words[1]) + 4 + eye2y] = words[4];
								board[parseInt(words[2]) + 4 + eye2x][parseInt(words[1]) + 2 + eye2y] = words[4];
								
								//mouth
								board[parseInt(words[2]) + 8][parseInt(words[1]) + 7] = words[4];
								board[parseInt(words[2]) + 8][parseInt(words[1]) + 5] = words[4];
								board[parseInt(words[2]) + 8][parseInt(words[1]) + 6] = words[4];
								

							}
							if (words[3] == "lenny" && parseInt(words[1]) < boardWidth - 16 && parseInt(words[2]) < boardHeight - 7) {
								
								
								//left parentheses
								board[parseInt(words[2]) + 0][parseInt(words[1]) + 1] = words[4];
								board[parseInt(words[2]) + 1][parseInt(words[1]) + 0] = words[4];
								board[parseInt(words[2]) + 2][parseInt(words[1]) + 0] = words[4];
								board[parseInt(words[2]) + 3][parseInt(words[1]) + 0] = words[4];
								board[parseInt(words[2]) + 4][parseInt(words[1]) + 0] = words[4];
								board[parseInt(words[2]) + 5][parseInt(words[1]) + 0] = words[4];
								board[parseInt(words[2]) + 6][parseInt(words[1]) + 1] = words[4];
								
								//left eye
								board[parseInt(words[2]) + 1][parseInt(words[1]) + 3] = words[4];
								board[parseInt(words[2]) + 1][parseInt(words[1]) + 4] = words[4];
								board[parseInt(words[2]) + 1][parseInt(words[1]) + 5] = words[4];
								board[parseInt(words[2]) + 2][parseInt(words[1]) + 4] = words[4];
								
								//nose
								board[parseInt(words[2]) + 1][parseInt(words[1]) + 7] = words[4];
								board[parseInt(words[2]) + 2][parseInt(words[1]) + 7] = words[4];
								board[parseInt(words[2]) + 2][parseInt(words[1]) + 8] = words[4];
								board[parseInt(words[2]) + 3][parseInt(words[1]) + 8] = words[4];
								board[parseInt(words[2]) + 4][parseInt(words[1]) + 8] = words[4];
								board[parseInt(words[2]) + 4][parseInt(words[1]) + 7] = words[4];
								
								//mouth
								board[parseInt(words[2]) + 5][parseInt(words[1]) + 5] = words[4];
								board[parseInt(words[2]) + 6][parseInt(words[1]) + 6] = words[4];
								board[parseInt(words[2]) + 6][parseInt(words[1]) + 7] = words[4];
								board[parseInt(words[2]) + 6][parseInt(words[1]) + 8] = words[4];
								board[parseInt(words[2]) + 6][parseInt(words[1]) + 9] = words[4];
								board[parseInt(words[2]) + 5][parseInt(words[1]) + 10] = words[4];
								
								//right eye
								board[parseInt(words[2]) + 1][parseInt(words[1]) + 10] = words[4];
								board[parseInt(words[2]) + 1][parseInt(words[1]) + 11] = words[4];
								board[parseInt(words[2]) + 1][parseInt(words[1]) + 12] = words[4];
								board[parseInt(words[2]) + 2][parseInt(words[1]) + 11] = words[4];
								
								//right parentheses
								board[parseInt(words[2]) + 0][parseInt(words[1]) + 14] = words[4];
								board[parseInt(words[2]) + 1][parseInt(words[1]) + 15] = words[4];
								board[parseInt(words[2]) + 2][parseInt(words[1]) + 15] = words[4];
								board[parseInt(words[2]) + 3][parseInt(words[1]) + 15] = words[4];
								board[parseInt(words[2]) + 4][parseInt(words[1]) + 15] = words[4];
								board[parseInt(words[2]) + 5][parseInt(words[1]) + 15] = words[4];
								board[parseInt(words[2]) + 6][parseInt(words[1]) + 14] = words[4];
						}
							if (words[3] == "lifeglider"){
								board[parseInt(words[2]) + 0][parseInt(words[1]) + 2] = words[4];
								board[parseInt(words[2]) + 1][parseInt(words[1]) + 2] = words[4];
								board[parseInt(words[2]) + 2][parseInt(words[1]) + 2] = words[4];
								board[parseInt(words[2]) + 2][parseInt(words[1]) + 1] = words[4];
								board[parseInt(words[2]) + 1][parseInt(words[1]) + 0] = words[4];
							}
						} else {
							client.action(channel, "not on board");
						}
					}
						
						
				}
			}
			} else {
				
			}
				if(command == "saveboard") {
			var fs = require('fs');
			fs.writeFile("board.txt", board, function(err) {
				if(err) {
					return console.log(err);
				}

				console.log("The file was saved!");
			}); 
		}
				if (command == "mod" && words.length > 1) {
			mods.push(words[1]);
			client.action(channel, words[1] + " is now a Moderator!");
		}
				if(command == "playlife" && words.length == 2 && gameType == "place") {
					playLife(words[1]);
				}
				if(command == "endlife" && gameType == "life"){
					endLife();
					client.action(channel, "life is over");
				}
			}
		} 
	}
	
});

client.on('join', function (channel, username, self) {
	console.log(channel);
	console.log(username);
	
		viewers += [username];
		if(viewers.length > 1){
		console.log(viewers);
		}
		client.action(channel, "Welcome " + username + " to the stream!");
	});
	


client.on('connected', function(address, port){
	console.log("Address: " + address + " Port: " + port);
	client.action("roudolpho", "My ultimate will devastate them, or not...");
	
 } );



 
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));
app.listen(7777, function() { console.log('Node.JS is listening!'); });
app.get('/board', function (req, res) {
      res.send(board);
});
app.get('/C', function (req, res) {
      res.send(C);
});
app.get('/tictactoe', function (req, res) {
      res.send(tictactoe);
});
 