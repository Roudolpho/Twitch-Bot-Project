/*
 *This program is an alteration of the empty bot that is used to create an environment similar to that of r/place, an event held by reddit
 *This javaScript file should be run on node.js and the html file VisualsCommunityCanvas.html should be run in chrome to accompany it. 
 *A streaming application like OBS should be used to send the html visuals back to twitch.
 *Before the program can run, the 'mods' variable and oauth and channel information should be filled out
 */


var tmi = require('tmi.js')
var options = {//specifics for the connection to the twitch api
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
	channels : ["xxxxxxxxxxx"]//You need to insert your channels here
};

var client = new tmi.client(options);
client.connect();

var viewers = [];

var gameType = "place";

var mods = ["xxxxxxxxxxxxxxx"];//here you can list what users should be seen as moderators, moderators have special commands

//board stuff
//This is the initialization of some necessary global variables for the community canvas functions
var board = []
var boardHeight = 101
var boardWidth = 180
var lifeboard = []
var placeboard = []
C = [600,0,0,10];

//these are legal characters in a hexcolor
legalchars = ["A", "B", "C", "D", "E", "F","a", "b", "c", "d", "e", "f", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]


function isHexColor(color) {//checks to make sure that the inputed string is in fact a legal hex character
	allgood = true;
	if(color.substring(0,1) != "#"){//checks for the '#' at the beginning of a hexcolor
		return false;
	}
	color = color.replace("#", '');
	colors = color.split("");
	if(colors.length == 6){//checks for the 6 characters in a hexcolor
		chars = color.split("");
		for(i = 0;i<6;i++){
			allgood = false;
			for(k=0;k<legalchars.length;k++) {//checks the six letters against the legal characters for a hexcolor
				if(chars[i] == legalchars[k]) {
					allgood = true;
				}
			}
			if (allgood == false) {
				return false;
			}
		}
		return true
	}
	return false
}

function playLife(step) {// This function begins the process of Conway's Game of Life
	lifeInterval = setInterval(playLifeGame, step);//sets the generation function on a timer so generations occur on regular intervals
	lifeboard = board;//creates copies of the board to use with Conway's Game of Life
	placeboard = board;
	gameType = "life"//changes the global gameType so the bot recognizes what is happening 
	for(i = 0;i < boardHeight; i++) {//draws the initial state of the board, removes the colors making it monochromatic
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

function playLifeGame() {//runs a generation in Conway's game of life
	/*
	 *I realize that the way each new generation is constructed is rather unnecessary and inefficient
	 *but at this point in time it works fine so I shall leave it be
	 */
	lifeboard = [];
	for(i = 0;i < boardHeight; i++) {//recreates a board to fill with new values
		lifeboard.push([]);
		for(k = 0;k < boardWidth; k++) {
			surrounding = 0;
			for(j = -1; j<=1; j++){
				for(l = -1;l<=1;l++){//these new values are determined by checking 
					if((j != 0 || l != 0)){
						jnew = j + i;//checks the pixels around a given one
						lnew = l + k;
						if(i + j == boardHeight){//next few lines prevent out of bounds index error by wrapping from top to bottom
							jnew = 0;
						}
						if(k + l == boardWidth){
						lnew = 0;
						}
						if(i + j == -1){
							jnew = boardHeight - 1;
						}
						if(k + l == -1){
							lnew = boardWidth - 1;
						}
						if(board[jnew][lnew] != "#000000"){
							surrounding += 1;
						}
					}
				}
			}
			if(board[i][k] != "#000000"){//decides if any given value is alive or dead in this new generation
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
	board = lifeboard;//saves over the old generation
	if(gameType == "place"){//ensures that the board is not saved over if the gameType is no longer Conway's Game of Life
		board = placeboard;
	}
}

function endLife(){//ends Conway's Game of life and returns the original board
	clearInterval(lifeInterval);
	gameType = "place";
	board = placeboard;
}

var jokes = [//this is a set of jokes that the bot can tell on demand if the command is given
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

//All my commands begin here
client.on('chat', function(channel, username, message, self) {//whenever a message is placed in chat, it is checked for the tilde to see if it is intended as a command
	if(message.charAt(0) == "~") {
		mes = message.toString();
		com = mes.replace("~", '');//removes the tilde from the command
		com = com.toLowerCase();
		words = com.split(" ");//splits up the command
		command = words[0];//the first word in the command is designated as the identifier and will be used to decide which command to execute
		if(command == "hi") {//the command 'hi' is as basic as it gets and is mostly used for testing if the bot is operational at any given time for debugging purposes
			client.action(channel, "Hi there " + username['display-name'] + "!");
		}
		if(command == "joke") {//This command selects and repeats a random joke from the list initialized earlier
			n = Math.random()*jokes.length;
			n = Math.floor(n);
			client.action(channel, jokes[n][0]);//this separates the joke into two lines, with the second being the punchline
			client.action(channel, jokes[n][1]);
		}
		if(command == "ascii") {//this command allows a viewer to have the bot spit out an ascii character
			if(words.length > 1) {
			if(words[1] == "bunny") {//draws an ascii bunny
				client.action(channel, " ()  ()");
				client.action(channel, " (^*^)");
				client.action(channel, "(U U)o");
			}
			if(words[1] == "datboi") {//draws an ascii 'dat boi' (outdated meme)
				client.action(channel, " !**>");
				client.action(channel, " -O-");
				client.action(channel, " /T\\ ");
				client.action(channel, " /-\\ ");
				client.action(channel, " |+| ");
				client.action(channel, " \\-/ ");
			}
			if(words[1] == "shrug") {//draws an ascii shrug emote
				client.action(channel, " ¯\\_(ツ)_/¯");
			}
			if(words[1] == "lenny") {//draws a lenny face
				client.action(channel, "( ͡° ͜ʖ ͡°)");
			}
			if(words[1] == "warlizard") {//draws a rage face
				client.action(channel, " ಠ_ಠ");
			}
			if(words[1] == "tableflip") {//draws a table flip emote
				client.action(channel, " (╯°□°）╯︵ ┻━┻");
			}
			if(words[1] == "rageflip") {//draws a table flip emote variant
				client.action(channel, " (ﾉಥ益ಥ）ﾉ﻿ ┻━┻");
			}
			if(words[1] == "doubleflip") {//draws a table flip emote variant
				client.action(channel, " ┻━┻ ︵ヽ(`Д´)ﾉ︵﻿ ┻━┻");
			}
			if(words[1] == "nyan") {//draws an ascii 'nyan cat' (outdated meme)
				client.action(channel, " ~=[,,_,,]:3");
			}
			} else {
				client.action(channel, "Which one?");
			}
		}
		if(command == "test") {//this is an empty command for testing
			
		}
		if (gameType == "place"){//this set of commands is specifically for the placement of pixels on the canvas
			if(command == "draw" && words.length >= 4) {//This command allows for the drawing of a single pixel
				if(parseInt(words[1]) < boardWidth && parseInt(words[2]) < boardHeight && parseInt(words[1]) > -1 && parseInt(words[2]) > -1) {//ensures the coordinates given exist
					if(isHexColor(words[3])) {//checks to make sure that the color given is a hexcolor
						board[parseInt(words[2])][parseInt(words[1])] = words[3];//changes the array value to change the pixel in the html visuals
						client.action(channel, "Affirmative, have a nice day Kappa !");
					} else {
						client.action(channel, "Thats not a Hexcolor");//notifies the viewer that their hexcolor is invalid
					}
				} else {
					client.action(channel, "That place doesn't exist");//notify the user that the coordinates of that point dont exist
				}		
			}
			if(command == "drawsquare") {//this command allows for a user to place a hollow square rather than a single pixel
				if(words.length < 6) {
					client.action(channel, "not enough parameters");//reports that there were not enough parameters listed in the command given
				} else {
					if (parseInt(words[1]) < boardWidth && parseInt(words[2]) < boardHeight && parseInt(words[1]) > -1 && parseInt(words[2]) > -1 && parseInt(words[3]) < boardWidth && parseInt(words[4]) < boardHeight && parseInt(words[3]) > -1 && parseInt(words[4]) > -1){//this long boolean will return false if the square the user is drawing does not exist in the bounds of the board
						if (isHexColor(words[5])) {//checks to makes sure the hexcolor is valid
							if (parseInt(words[1]) > parseInt(words[3])) {//allows the 
								xplus = -1;
							} else {
								xplus = 1;
							}
							if (parseInt(words[2]) > parseInt(words[4])) {
								yplus = -1;
							} else {
								yplus = 1;
							}
							for(i = 0;Math.abs(i) <= Math.abs(parseInt(words[3]) - parseInt(words[1])); i += xplus){//draw the four sides of the square
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
							client.action(channel, "Affirmative, have a nice day Kappa !");//notifies user of success
						} else {
							client.action(channel, "Thats not a Hexcolor");//lets the user know their hexcolor was invalid
						}
					} else {
						client.action(channel, "That place doesn't exist");//equivalent of an out of bound index error
					}
				}
			}
		}
		//Moderator commands
		for(i = 0; i < mods.length; i++){//these commands are more sensitive for the bot so a user must be listed in the moderator list to use them
			console.log(i + " " + mods[i] + " " + username['display-name']);
			if(username['display-name'] == mods[i] || username == mods[i]) {
				console.log("mod command detected");
				if(command == "c" && words.length == 5){//this command is used to check a connection between the html file and the bot
					C[0] = words[1];
					C[1] = words[2];
					C[2] = words[3];
					C[3] = words[4];
					console.log(C);
				}
				if(command == "resetboard") {//this command resets the board to be completely black
				board = []
				for(i = 0;i < boardHeight; i++) {
					board.push([]);
					for(k = 0;k < boardWidth; k++) {
						board[i].push("#000000");
					}
				}
				//console.log(board);
				
			}
				if (gameType == "place"){//mod commands only applicable during the place gameType
					if(command == "drawimg"){//allows a moderator to draw a preset image
						if(words.length < 2){
							client.action(channel, "not viable");//not the correct amount of parameters error
						} else {
							if(words.length < 5){
								client.action(channel, "missing parameters");//not the correct amount of parameters error
							} else {
								if(parseInt(words[1]) < boardWidth && parseInt(words[2]) < boardHeight && parseInt(words[1]) > -1 && parseInt(words[2]) > -1 && isHexColor(words[4])) {//checks that there will not be an out of bounds error
									if(words[3] == "warlizard" && parseInt(words[1]) < boardWidth - 14 && parseInt(words[2]) < boardHeight - 9) {//draws a strange emote and checks that there will not be an out of bounds error
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
									if (words[3] == "lenny" && parseInt(words[1]) < boardWidth - 16 && parseInt(words[2]) < boardHeight - 7) {//draws a lenny face emote and checks that there will not be an out of bounds error
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
									if (words[3] == "lifeglider"){//draws a glider for Conway's Game of Life emote and checks that there will not be an out of bounds error
										board[parseInt(words[2]) + 0][parseInt(words[1]) + 2] = words[4];
										board[parseInt(words[2]) + 1][parseInt(words[1]) + 2] = words[4];
										board[parseInt(words[2]) + 2][parseInt(words[1]) + 2] = words[4];
										board[parseInt(words[2]) + 2][parseInt(words[1]) + 1] = words[4];
										board[parseInt(words[2]) + 1][parseInt(words[1]) + 0] = words[4];
									}
								} else {
									client.action(channel, "not on board");//index out of bounds error
								}
							}
						}
					}
				} else {
				}
				if(command == "saveboard") {//saves a text file with the boards data though there is no way to retrieve the file at the moment
					var fs = require('fs');
					fs.writeFile("board.txt", board, function(err) {
						if(err) {
							return console.log(err);
						}
						console.log("The file was saved!");
					}); 
				}
				if (command == "mod" && words.length > 1) {//command to add a moderator to the moderator list
					mods.push(words[1]);
					client.action(channel, words[1] + " is now a Moderator!");
				}
				if(command == "playlife" && words.length == 2 && gameType == "place") {//allows a moderator to begin the game of life
					playLife(words[1]);
				}
				if(command == "endlife" && gameType == "life"){//allows a moderator to stop the game of life
					endLife();
					client.action(channel, "life is over");
				}
			}
		} 
	}
});

client.on('join', function (channel, username, self) {//whenever a user joins this is run
	console.log(channel);
	console.log(username);
	viewers += [username];
	if(viewers.length > 1){
		console.log(viewers);
	}
	client.action(channel, "Welcome " + username + " to the stream!");//notification that a user joined the stream
});
	
client.on('connected', function(address, port){//runs once the bot connects to a channel
	console.log("Address: " + address + " Port: " + port);
	client.action("roudolpho", "My ultimate will devastate them, or not...");//creates a notification in the stream chat
});
 
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));//communicates with the HTML page
app.listen(7777, function() { console.log('Node.JS is listening!'); });
app.get('/board', function (req, res) {//sends board information
	res.send(board);
});
app.get('/C', function (req, res) {//testing for connection with html page
	res.send(C);
});
app.get('/tictactoe', function (req, res) {//vestigial from the tictactoe connection
	res.send(tictactoe);
});
 