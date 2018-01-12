/*
 *This program is an alteration of the empty bot that is an attempt to create an intentionally basic AI that would learn to play twitch
 *This javaScript file should be run on node.js and the html file VisualsTwitchTacToe.html should be run in chrome to accompany it. 
 *A streaming application like OBS should be used to send the html visuals back to twitch.
 *Before the program can run, the 'mods' variable and oauth and channel information should be filled out
 */


var tmi = require('tmi.js')//creates connection with the twitch api
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
	channels : ["xxxxxxxxxxxxxx"]
};
var client = new tmi.client(options);//creates connection with the twitch api
client.connect();

tictactoe = [[0,0,0],[0,0,0],[0,0,0]];//default empty board
emptyboard = [[0,0,0],[0,0,0],[0,0,0]];
moves = [];//recorded move positions

playersVoted = [];//global variable so players cant vote more than once

allBoards = [];//this is a necessary global variable for the bot, records all board setups this game

oldBoards = [];//this is a necessary global variable for the bot

dummy = setInterval(playTic, 10000)//runs a turn for the players in the game every ten seconds

firstTurn = true;

function playTic(){//fuction for playing a turn of tic tac toe
	if(checkVictory()!=0){//this checks if someone has won the game
		botAnalyze();//lets the bot analyze the board to learn
	}
	console.log("trying to play")
	if(allBoards.length == 0 && firstTurn == true){
		firstTurnPlayer = Math.round(Math.random());//decides who goes first if on first turn
		console.log("first turn")
		firstTurn = false
		console.log(firstTurn);
		if(firstTurnPlayer==0){//if the AI goes first then it goes
			ticBot(tictactoe);
		}
	}
	if(allBoards.length!= 0){//checks if it is the first turn of the game
		firstTurn = true;
	}
	if(moves.length>0){//has at least 1 viewer inputed a move to make
		console.log("playing");
		firstTurnPlayer = 0;
		notFirstTurn = 1;
		console.log("player first");
		chosenMove = chooseMove();//this chooses the move based on the players' votes for what move to make
		client.action("#roudolbot","the chosen move is " + chosenMove);//displays the chosen move to the viewers
		chosenMove = chosenMove.split("");
		letters = ["A","B","C"]
		y = 0
		x = chosenMove[1] - 1;
		for(x2=0;x2<3;x2++){//translates alphanumerical coordinates to only numerical coordinates
			if(chosenMove[0] == letters[x2]){
			y=x2;
			}
		}
		tictactoe[y][x] = 1;//makes the players' move
		moves = [];
		ticBot(tictactoe);//lets the AI take its turn
		client.action("#roudolbot","Next player move in 10 seconds")
	}
}

function isMove(message){//checks that the move is viable
	console.log("checking move");
	letters = ["A","B","C"]
	if(message.length == 2){//checks for only 2 characters
		chars = message.split("");
		if(parseInt(chars[1]) < 4 && parseInt(chars[1]) > 0){//checks that the number is 1 2 or 3
			lett = false
			for(x=0;x<3;x++){//checks that the letters match up
				if(chars[0] == letters[x]){
					console.log(chars[1] + "   " + x);
					if(tictactoe[x][parseInt(chars[1])-1]==0){
				lett = true;
					}
				}
			}
			if(lett){
				return true
			}
		}
	}
	return false
}

function addMove(message){//adds a move to the move list or updates the list
	lett = true;//checks if the move already existed
	for(x=0;x<moves.length;x++){
		if(message==moves[x][0]){//if a player has already suggested the move then the suggestion gains more weight
			moves[x][1] += 1;
		}
	}
	if(lett){//if the viewer has suggested a new move it will be added to the list of possible moves
		moves.push([message, 1]);
	}
}

function checkVictory(){//checks all victory possibilities
	t = tictactoe;
	for(x=0;x<3;x++){
	console.log(t[0][x]+ " " +t[1][x]+ " " +t[2][x]);
		if((t[0][x]==t[1][x]&&t[2][x]==t[1][x]&&t[0][x]!=0)){//checks for any horizontal victories
			return t[0][x];
		}
		console.log(t[x][0]+ " " +t[x][1]+ " " +t[x][2]);
		if((t[x][0]==t[x][1]&&t[x][2]==t[x][1]&&t[x][0]!=0)){//checks for any vertical victories
			return t[x][0];
		}
	}
	if((t[1][1]==t[2][2]&&t[1][1]==t[0][0])||(t[1][1]==t[2][0]&&t[0][2]==t[1][1])){//checks for any diagonal victories
		return t[1][1];
	}
	for(y=0;y<3;y++){//checks if there is not a tie yet
		for(x=0;x<3;x++){
			if(tictactoe[y][x] == 0){
				return 0
			}
		}
	}
	
		return 3;//returns tie
	
}

function chooseMove(){//this chooses the move based on the players' votes
	move = 0;//default move is the first recorded one
	for(i=0;i<moves.length;i++){//otherwise the most favorable move with the crowd is chosen
		if(moves[i][1]>moves[move][1]){
			move = i;
		}
	}
	return moves[move][0];
}

function botAnalyze() {//lets the AI analyze the game
	victory = false;
	console.log(checkVictory());
	if(checkVictory(tictactoe)!=0){
		victory = checkVictory(tictactoe)//checks for victory
		//Add the saving old games stuff here
		for(k=0;k<allBoards.length;k++){//for every board seen this game
			for(l=0;l<oldBoards.length;l++){//check to see what moves have been seen before and save moves based on if they have been made
			//moves that have been seen before will have their save data updated while new moves will be freshly transcribed
				if(allBoards[k][0] == oldBoards[l][0]){
					for(m=0;m<oldBoards[l][1];m++){
						if(allBoards[k][1] == oldBoards[l][1][m][0]){
							if(victory==1){
							oldBoards[l][1][m][2] += 1;
							} else if(victory==1){
								oldBoards[l][1][m][1] += 1;
							} else if(victory==3){
								oldBoards[l][1][m][3] += 1;
							}
						}
					}
				}
			}
		}
		console.log(oldBoards);
		allBoards = [];//reseting variables
		firstTurn = true;
		tictactoe = [[0,0,0],[0,0,0],[0,0,0]]
	}
}

function ticBot(board){
	victory = false;
	console.log(checkVictory());
	if(checkVictory(tictactoe)!=0){
		victory = checkVictory(tictactoe);
		//Add the saving old games stuff here
		for(k=0;k<allBoards.length;k++){//for every board seen this game
			for(l=0;l<oldBoards.length;l++){//check if the AI has seen the situation before and decide what the best move is
				if(allBoards[k][0] == oldBoards[l][0]){
					for(m=0;m<oldBoards[l][1];m++){
						if(allBoards[k][1] == oldBoards[l][1][m][0]){
							if(victory==1){
							oldBoards[l][1][m][2] += 1;
							} else if(victory==1){
								oldBoards[l][1][m][1] += 1;
							} else if(victory==3){
								oldBoards[l][1][m][3] += 1;
							}
						}
					}
				}
			}
		}
		console.log(oldBoards);
		allBoards = [];
		tictactoe = [[0,0,0],[0,0,0],[0,0,0]]
	} else {//if victory is false then the AI records the game
		boardNumber = 0;
		boardExists = false;
		for(x=0;x<oldBoards.length;x++){
			if(board == oldBoards[x][0]){
				console.log(board + " " + oldBoards);
				boardNumber=x;
				boardExists=true;
			}
		}
		if(boardExists){
			move = 0;
			for(x=0;x<oldBoards[boardNumber][1].length;x++){
				moveStats = oldBoards[boardNumber][1][x];
				moveStatsOld = oldBoards[boardNumber][1][move];
				if(((moveStats[1]+moveStats[3]*.75)/(moveStats[1]+moveStats[2]+moveStats[3]))>((moveStatsOld[1]+moveStatsOld[3]*.75)/(moveStatsOld[1]+moveStatsOld[2]+moveStatsOld[3]))){
					move = x;
				}
			}
			allBoards.push([[tictactoe],[oldBoards[boardNumber][1][move][0]]]);
			tictactoe[oldBoards[boardNumber][1][move][0][0],oldBoards[boardNumber][1][move][0][1]] = 2;
			
		} else {
			possibleMoves = [];
			for(y=0;y<3;y++){
				for(x=0;x<3;x++){
					if(board[y][x]==0){
						possibleMoves.push([y,x]);
						console.log(y + "   " + x);
					}
				}
			}
			moveComp = []//variable for compiling moves into the correct format
			for(i=0;i<possibleMoves.length;i++){
				moveComp.push([possibleMoves[i],1,1,1]);
			}
			oldBoards.push([[tictactoe],[moveComp]]);//adds new board to list of all boards
			moveChoice = Math.floor(Math.random()*possibleMoves.length);
			allBoards.push([tictactoe],[possibleMoves[moveChoice]]);
			tictactoe[possibleMoves[moveChoice][0]][possibleMoves[moveChoice][1]] = 2;
		}
	}
}



client.on('chat', function(channel, username, message, self) {//this function runs when there is a post in the chat
	if(message == "ping"){//allows to test if bot is operating
		client.action(channel, "pong");
	} 
	if(isMove(message)){//checks if a comment is a possible move
	console.log("is a move")
		addMove(message);
	}
	
});

client.on('join', function (channel, username, self) {//this function runs when a person enters the channel but it is empty as there is no current use for it
	
});

client.on('connected', function(address, port){//this runs when the bot joins a channel to let the viewers know it has arrived
	client.action("#RoudolBot", "I have the high ground...");
});


var express = require('express');//get express.js to send info to the html file
var app = express();

app.use(express.static(__dirname + '/'));//send information to the html file to generate visuals
app.listen(7777, function() { console.log('Node.JS is listening!'); });
app.get('/tictactoe', function (req, res) {
	ticComp = [tictactoe, "placeholder"]
		res.send(ticComp);
}); 