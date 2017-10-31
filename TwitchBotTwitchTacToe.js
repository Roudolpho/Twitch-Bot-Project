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
	channels : ["RoudolBot"]
};
var client = new tmi.client(options);
client.connect();

tictactoe = [[0,0,0],[0,0,0],[0,0,0]];//default empty board
emptyboard = [[0,0,0],[0,0,0],[0,0,0]];
moves = [];//recorded move positions

playersVoted = [];//global variable so players cant vote more than once

allBoards = [];//this is a necessary global variable for the bot, records all board setups this game

oldBoards = [];//this is a necessary global variable for the bot

dummy = setInterval(playTic, 10000)//runs a turn for the players in the game every ten seconds

firstTurn = true;

function playTic(){
	if(checkVictory()!=0){
	botAnalyze();
	}
	console.log("trying to play")
	if(allBoards.length == 0 && firstTurn == true){
		firstTurnPlayer = Math.round(Math.random());
		console.log("first turn")
		firstTurn = false
		console.log(firstTurn);
		if(firstTurnPlayer==0){
			ticBot(tictactoe);
		}
		}
		if(allBoards.length!= 0){
			firstTurn = true;
		}
	if(moves.length>0){
		console.log("playing");
		firstTurnPlayer = 0;
		notFirstTurn = 1;
		
		
		
			console.log("player first");
		chosenMove = chooseMove();//this chooses the move based on the players' votes
		client.action("#roudolbot","the chosen move is " + chosenMove);
		chosenMove = chosenMove.split("");
		letters = ["A","B","C"]
		y = 0
		x = chosenMove[1] - 1;
		for(x2=0;x2<3;x2++){
			if(chosenMove[0] == letters[x2]){
			y=x2;
			}
		}
		tictactoe[y][x] = 1;
		moves = [];
		
		ticBot(tictactoe);
		client.action("#roudolbot","Next player move in 10 seconds")
		
	}
}

function isMove(message){//checks that the move is viable
	console.log("checking move");
	letters = ["A","B","C"]
	if(message.length == 2){
		chars = message.split("");
		if(parseInt(chars[1]) < 4 && parseInt(chars[1]) > 0){
			lett = false
			for(x=0;x<3;x++){
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
		if(message==moves[x][0]){
			moves[x][1] += 1;
		}
	}
	if(lett){
		moves.push([message, 1]);
	}
}

function checkVictory(){//checks all victory possibilities
	t = tictactoe;
	for(x=0;x<3;x++){
	console.log(t[0][x]+ " " +t[1][x]+ " " +t[2][x]);
		if((t[0][x]==t[1][x]&&t[2][x]==t[1][x]&&t[0][x]!=0)){
			return t[0][x];
		}
		console.log(t[x][0]+ " " +t[x][1]+ " " +t[x][2]);
		if((t[x][0]==t[x][1]&&t[x][2]==t[x][1]&&t[x][0]!=0)){
			return t[x][0];
		}
	}
	if((t[1][1]==t[2][2]&&t[1][1]==t[0][0])||(t[1][1]==t[2][0]&&t[0][2]==t[1][1])){
		return t[1][1];
	}
	for(y=0;y<3;y++){
		for(x=0;x<3;x++){
			if(tictactoe[y][x] == 0){
				return 0
			}
		}
	}
	
		return 3;
	
}

function chooseMove(){//this chooses the move based on the players' votes
	move = 0;//default move is the first recorded one
	for(i=0;i<moves.length;i++){
		if(moves[i][1]>moves[move][1]){
			move = i;
		}
	}
	return moves[move][0];
}

function botAnalyze() {
	victory = false;
	console.log(checkVictory());
	if(checkVictory(tictactoe)!=0){
		victory = checkVictory(tictactoe)
		
		//Add the saving old games stuff here
		for(k=0;k<allBoards.length;k++){//for every board seen this game
			for(l=0;l<oldBoards.length;l++){
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
			for(l=0;l<oldBoards.length;l++){
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
	} else {
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



client.on('chat', function(channel, username, message, self) {
	if(message == "ping"){//allows to test if bot is operating
		client.action(channel, "pong");
	} 
	if(isMove(message)){//checks if a comment is a possible move
	console.log("is a move")
		addMove(message);
	}
	
});

client.on('join', function (channel, username, self) {
	
});

client.on('connected', function(address, port){
	client.action("#RoudolBot", "I have the high ground...");
});


var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));
app.listen(7777, function() { console.log('Node.JS is listening!'); });
app.get('/tictactoe', function (req, res) {
	ticComp = [tictactoe, "placeholder"]
      res.send(ticComp);
});