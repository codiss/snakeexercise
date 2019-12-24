class Snake {
			constructor() {
				this.segments = [[10,10]];
				this.xDir = 0;
				this.yDir = 0;
			}
		}
			
		class Apple {
			reset() {
				var possibles = [];
				
				for(var x = 0; x < 20; x++) {
					for(var y = 0; y < 20; y++) {
						if(x == 10 && y == 10) {
							continue;
						} else {
							possibles.push([x,y]);
						}
						
					}
				}
				
				//alert(possibles[0]);
				return possibles;
			}
			
			constructor() {
				this.possibles = this.reset();
				
				this.position = this.possibles[Math.floor(Math.random() * this.possibles.length)];
			}
		}

		var can = document.getElementById("myCanvas");
		var ctx = can.getContext("2d");
		var score = 1;
		var mySnake = new Snake;
		var apple = new Apple;
		var paused = true;
		var newGame = true;
		var dubCheck = false;
			
		if(localStorage.getItem("high") == undefined) {
			var highScore = localStorage.setItem("high", 1);
		} else {
			var highScore = localStorage.getItem("high");
		}
		
			
		
		function main() {
			
			document.addEventListener("keydown", keyPush);
			setInterval(game, 100);
		}
		function game() {
			dubCheck = false;
			
			if (paused) {
				if (!newGame) {
					return;
				} else {
					dubCheck = true;
				}
			}
			
			highScore = setHigh(score);
			
			//draw background and scoreboard
			ctx.fillStyle = "black";
			ctx.fillRect(0,0, can.width, can.height);
			ctx.fillStyle = "#FFF";
			ctx.font = ("30px Lucida Console");
			ctx.fillText("Score: " + score, 10, 50);
			ctx.fillText("High: " + highScore, 220, 50);
			ctx.fillRect(0, 79, can.width, 20);
			
			newSegs = [mySnake.segments[mySnake.segments.length - 1][0] + mySnake.xDir, mySnake.segments[mySnake.segments.length - 1][1] + mySnake.yDir];
			
			if(newSegs[0] > 19 || newSegs[0] < 0 || newSegs[1] > 19 || newSegs[1] < 0) {
				startOver();
				score = 1;
				newSegs = [10,10];
				apple.reset();
				paused = true;
				newGame = true;
			}
			
			//check apple collision and draw it
			if (newSegs[0] == apple.position[0] && newSegs[1] == apple.position[1]) {
				score += 1;
				modApple(newSegs);
			} else {
				modApple(newSegs, mySnake.segments[0])
				mySnake.segments.splice(0,1);
			}
			
			ctx.fillStyle = "#F00";
			ctx.fillRect(20 * apple.position[0] + 1, 20 * apple.position[1] + 101, 19, 19);
			ctx.fillStyle = "#0F0";
			
			//check self collision and add to snake array
			for (s = 0; s < mySnake.segments.length; s++) {
				if (newSegs[0] == mySnake.segments[s][0] && newSegs[1] == mySnake.segments[s][1]){
					startOver();
					newSegs = [10,10];
					apple.reset();
					paused = true;
					newGame = true;
					break;
				} else {
					ctx.fillRect(20 * mySnake.segments[s][0] + 1, 20 * mySnake.segments[s][1] + 101, 19, 19);
				}
			}
			mySnake.segments.push(newSegs);
			ctx.fillRect(20 * newSegs[0] + 1, 20 * newSegs[1] + 101, 19, 19);
			
			if (newGame) {
				pressToStart();
			}
			
			
		}
		function modApple(newSegs, tailEnd = [20,20]) {
			
			//remove new snake segment
			for(var i = apple.possibles.length -1 ; i >= 0; i--) {
				if(apple.possibles[i][0] == newSegs[0] && apple.possibles[i][1] == newSegs[1]) {
					apple.possibles.splice(i, 1);
					break;
				}
			}
			
			//add previous position if apple not eaten
			if(tailEnd[0] != 20) {
				apple.possibles.push(tailEnd);
			} else {
				apple.position = apple.possibles[Math.floor(Math.random() * apple.possibles.length)];
			}
				
		}
		function keyPush(key) {
			if (key.keyCode == 32) {
				pause();
				return;
			}
			
			if (dubCheck) {
				return;
			}
			switch(key.keyCode) {
				case 38:
					if (mySnake.yDir == 1) {
						break;
					} else {
						mySnake.xDir = 0;
						mySnake.yDir = -1;
						dubCheck = true;
						break;
					}
					
				case 40:
					if (mySnake.yDir == -1) {
						break;
					} else {
						mySnake.xDir = 0;
						mySnake.yDir = 1;
						dubCheck = true;
						break;
					}
					
				case 37:
					if (mySnake.xDir == 1) {
						break;
					} else {
						mySnake.yDir = 0;
						mySnake.xDir = -1;
						dubCheck = true;
						break;
					}
					
				case 39:
					if (mySnake.xDir == -1) {
						break;
					} else {
						mySnake.yDir = 0;
						mySnake.xDir = 1;
						dubCheck = true;
						break;
					}
					
			}
		}		
		function pause() {
			
			if (paused) {		
				newGame = false;
				paused = false;
			} else {
				paused = true;
				ctx.fillStyle = "#FFF";
				ctx.font = ("30px Lucida Console");
				ctx.fillText("Paused", 140, 310);
			}
		}
		function pressToStart() {
			ctx.fillStyle = "black";
			ctx.fillRect(0,100, can.width, can.height - 100);
			ctx.fillStyle = "#FFF";
			ctx.font = ("30px Lucida Console");
			ctx.fillText("Press Space To Start ", 15, 250);
		}
		function setHigh(score) {
			if (score > highScore) {
				highScore = score;
				localStorage.setItem("high", score);
			}
			return highScore;
		}
		function startOver() {
			mySnake.segments = [];
			mySnake.xDir = 0;
			mySnake.yDir = 0;
			score = 1;
			dubCheck = true;
		}
		main()