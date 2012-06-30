/** 
* @projectDescription   ReMasterBlaster Project
*
* @author   Michael micha@remasterblaster.com
* @version  0.8 
*/

function startGame(playerObj) {//gameStat
	//start crafty
	Crafty.init(608, 480);
	
	/**
	 * Sprites
	 */
	loadSprites("environment");
	loadSprites("players");
		
	/**
	 * variable declarations
	 */
	var brick_array = new Array(19);
	var entity_array = new Array(19);
	var goody_array = new Array(19);
	var bomb_array = new Array(19);
	var player_position_array = new Array(19);
	
	for (i=0; i <=18; i++){
		brick_array[i] = new Array(15);
		entity_array[i] = new Array(15);
		goody_array[i] = new Array(15);
		bomb_array[i] = new Array(15);
	}
	var string = "";
	var MAX_PLAYERS = playerObj.length;
	var PLAYERS_ALIVE = playerObj.length;
	var PLAYER_1 = playerObj[0].username;
	var PLAYER_2 = playerObj[1].username;
    
    //array that will get a reference to the players
	players = new Array(5);
	for (var i=0; i < players.length; i++) {
		players[i] = undefined;
	}
	
    //array which will get the player number for each killed player in ascending order
	var ranking = new Array(playerObj.length);
	for (var i=1; i <= MAX_PLAYERS; i++) {
		ranking[i] = 0;
	}
	
	
	var startcolor = 0;      //The starting RGB Red-Value
	var neg = 1;             //Variable to be negated once the Red Value reaches 0 or 255

	/** 
	 * Animates the outer Background gradually from black to red
	 * @author Sergej
	 */
	function backgroundAlarm(red) {
		var red;
		var frameskip = 40; //Value for animationspeed of the color change
		document.body.style.backgroundColor = 'rgb(' + red + ', 0, 0)';

		setTimeout(function() {

			if(red>=255 || red<0){
				neg=neg*(-1);		
			}
			backgroundAlarm(red=red+frameskip*neg);	

		}, 100);
	}

	/**
	*Death by Timeout
	*@author Sergej
	*/
	function alarmDeath(){

		
	}

	
	/**
	 * Handler for keydown events, sends event to all players
	 */
	$(document).keydown(function(event){
 		for (var i=0; i < players.length; i++) {
 			if(players[i] != undefined){
 				players[i].trigger("keydownself", event);
			}
 		};
	});
	
	/**
	 * Handler for keyup events, sends event to all players
	 */
	$(document).keyup(function(event){
		for (var i=0; i < players.length; i++) {
 			if(players[i] != undefined){
 				players[i].trigger("keyupself", event);
			}
 		};
	});

    /**
     * this function which detects the winner of the round, 
     * gets invoked every time a player gets killed
     */
	function checkForWinner(dyingPlayer) {
		var help=0;
		if (PLAYERS_ALIVE<=1) {
			for (var i=0; i < players.length; i++) {
				if (players[i] != undefined) {
					console.log("Winner: " + players[i].PLAYER);
					playerObj[i].wins++;
					//gameFinished(playerObj);
				} else {
					help = help +1;
				}
			}
			if (help == 4) {
				for (var i=0; i < players.length; i++) {
					if (players[i] != undefined) {
						ranking[1] = players[i].PLAYER_NUMBER;
					}
				}
			}
		}
		for (var i = MAX_PLAYERS; i >= 1; i--) {
			if (ranking[i]==0) {
				ranking[i] = dyingPlayer.PLAYER_NUMBER;
				break;
			}
		}
		console.log("erster: " +  ranking[1]);
		console.log("zweiter: " + ranking[2]);
	}
	
	/**
	 * this function detects where a bricks will be genereated and puts the id into the brick_array
	 * @return {Bool}  true for a bricks/false for none
	 */
	function generateBricks (i, j) {
		if(i > 0 && i < 18 && j > 0 && j < 14 && Crafty.randRange(0, 50) > 40 && !(i == 1 && j == 1) && !(i == 1 && j == 2)
			&& !(i == 1 && j == 3) && !(i == 1 && j == 4) && !(i == 2 && j == 1) && !(i == 3 && j == 2) && !(i == 4 && j == 1)
		    && !(i == 17 && j == 13) && !(i == 16 && j == 13) && !(i == 15 && j == 13) && !(i == 17 && j == 12) && !(i == 17 && j == 11)){
			//fill Array, return true
			if (Crafty.randRange(0, 50) > 45) {
				brick_array[i][j] = 4;
			} else {
				brick_array[i][j] = 2;
			}
			return true;
		} else {
			return false;
		}	
	}


	/**
	 * this function detects where to put the wall 
	 * @return {Bool}  true for a wall/false for none
	 */
	function generateWall (i,j) {
		if(i === 0 || i === 18|| j === 0 || j === 14){
			brick_array[i][j] = 1;
			return true;
		} else {
			return false;
		}
	};
	

	/**
	 * this function gets invoked when the player moves and relocates 
	 * the player on the virtuell grid
	 * @param {Number} x position of the player
	 * @return {Number} relocated y position 
	 */
	function xPlayerRelocator (x) {
		var distX = x % 32;
		var destinationX = 0;
		if (x%32 == 0) {
			return x;
		} else {
			if (distX > 16) {
				destinationX = Math.round(x) + 1.0;
			} else {					
				destinationX = Math.round(x) - 1.0;
			}
			return destinationX;	
		}
	}
	
	/**
	 * this function gets invoked when the player moves and relocates 
	 * the player on the virtuell grid
	 * @param {Number} y position of the player
	 * @return {Number} relocated y position 
	 */
	function yPlayerRelocator (y) {
		var distY = y % 32;
		var destinationY = 0;
		if(y%32 == 0) {
			return y-12;
		} else {
			if (distY > 16) {
				destinationY = Math.round(y) + 1.0;
			} else {					
				destinationY = Math.round(y) - 1.0;
			}
			return destinationY-12;	
		}
	}
	
	/**
	 * function gets invoked to adjust the current x position 
	 * to a relative grid position
	 * @param {Number} x position of the player
	 * @return {Number} relocated x position
	 */
	function xRelocator (x) {
		var distX = x % 32;
		var destinationX = 0;		
		if (x%32 == 0) {
			return x;
		} else {
			if (distX > 16) {
				destinationX = x + 16 - ((x+16) % 16);; 
			} else {					
				destinationX = x - distX;
			}
			return destinationX;	
		}
	}
	
	/**
	 * function gets invoked to adjust the current y position 
	 * to a relative grid position
	 * @param {Number} y position of the player
	 * @return {Number} relocated y position
	 */
	function yRelocator (y) {
		var distY = y % 32;
		var destinationY = 0;
		if (y % 32 == 0) {
			return y-12;
		} else {
			if (distY > 16) {
				destinationY =  y + 16 - ((y+16) % 16) - 12;
			} else {					
				destinationY = y - distY - 12;
			}
			return destinationY;	
		}
	}	

	/**
	 * function gets invoked through the solid test functions
	 * checks the value in the brick_array and updates the player attributes
	 * @param {Number} x position of the player
	 * @param {Number} y position of the player
	 * @param {Object} x reference to the player
	 */
	function checkForGoody(x, y, self) {
		switch (brick_array[x][y]) {
			case 10: // Speedup
				self.attr({speed: self.speed+1.0});
				brick_array[x][y] = 0;
				goody_array[x][y].trigger("explode");
				break;
			case 11: //Bombup
				self.attr({maxBombs: self.maxBombs+1.0});
				brick_array[x][y] = 0;
				goody_array[x][y].trigger("explode");
				break;
			case 12: //Fireup
				self.attr({fireRange: self.fireRange+1.0});
				brick_array[x][y] = 0;
				goody_array[x][y].trigger("explode");
				break;
			case 13: //Timefuze
				self.attr({timeFuze: true});
				brick_array[x][y] = 0;
				goody_array[x][y].trigger("explode");
				break;
			case 14: //DeathSkull
				self.xDeath = goody_array[x][y].x;
				self.yDeath = goody_array[x][y].y;
				self.trigger("explode");
				break;
			case 15: //Disease
				if (self.timeTillExplode > 1) {
					self.attr({timeTillExplode: self.timeTillExplode - 2});
				}
				brick_array[x][y] = 0;
				goody_array[x][y].trigger("explode");
				break;
			case 16: //Invincible
				brick_array[x][y] = 0;
				goody_array[x][y].trigger("explode");	
				self.invincible = true;
				self.addComponent("Invincible");
				self.setInvincibleAnimation(self.PLAYER);
				break;
			case 17: //Money
				brick_array[x][y] = 0;
				goody_array[x][y].trigger("explode");	
				self.money +=1 ;
			default:
				break;
		}
	}
	
	/**
	 * function to test for solid areas in down directions
	 * also invokes checkForGoody
	 * @param {Object} self reference to the player
	 * @return {Bool} true = solid / false = not solid
	 */
	function solidDown (self) {
		var x = Math.round((self.x)/32);
		var y = parseInt((self.y+44)/32);
		if (brick_array[x][y] >= 1) {	
			if (brick_array[x][y] >= 10) {
				checkForGoody(x, y, self);
				return false;
			}
			if (brick_array[x][y]==5) {
				if (Math.round(self.y+12)/32 == y ) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * function to test for solid areas in up directions
	 * also invokes checkForGoody
	 * @param {Object} self reference to the player
	 * @return {Bool} true = solid / false = not solid
	 */
	function solidUp (self) {
		var x = Math.round(self.x/32);
		var y = parseInt((self.y+11)/32);
		
		if (brick_array[x][y] >= 1) {
			if (brick_array[x][y] >= 10) {
				checkForGoody(x, y, self);
				return false;
			}
			if (brick_array[x][y]==5) {
				if (Math.round((self.y/32)) == y ) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * function to test for solid areas in right directions
	 * also invokes checkForGoody
	 * @param {Object} self reference to the player
	 * @return {Bool} true = solid / false = not solid
	 */
	function solidRight (self) {
		var x = parseInt((self.x+32)/32);
		var y = parseInt((self.y+27)/32);
		if (brick_array[x][y] >= 1) {
			if (brick_array[x][y] >= 10) {
			 	checkForGoody(x, y, self);
				return false;
			}
			if (brick_array[x][y]==5) {
				if (xRelocator(self.x)/32 == x || yRelocator(self.y)/32 == y ) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * function to test for solid areas in left directions
	 * also invokes checkForGoody
	 * @param {Object} self reference to the player
	 * @return {Bool} true = solid / false = not solid
	 */
	function solidLeft (self) {
		var x = parseInt((self.x)/32);
		var y = parseInt((self.y+27)/32);
		if (brick_array[x][y] >= 1) {
			if (brick_array[x][y] >= 10) {
				checkForGoody(x, y, self);
				return false;
			}
			if (brick_array[x][y]==5) {
				if (xRelocator(self.x)/32 == x || yRelocator(self.y)/32 == y ) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * funtion that gernerates a random number
	 * @param max maximal value random number can reach (0 - max)
	 * @return {Number} random value 
	 */
	function getRandom (max) {
		return Crafty.randRange(0, max);
	};
	
	/**
	 * funtion generates a new goody entity
	 * sets the typeNumber in the brick_array 
	 * @param {String} type defines the goody type
	 * @param {Number} x position of the player
	 * @param {Number} y position of the player
	 * @param {Number} typeNumber id for the goodytype
	 */
	function generateGoody (type, x, y, typeNumber) {
		var goodyType = type;
		brick_array[x/32][y/32] = typeNumber;
		goody_array[x/32][y/32] = Crafty.e("2D", "DOM", goodyType, "explodable")
			.attr({x: x, y: y, z: 9})
			.bind('explode', function() {
            	this.destroy();
        	});
	};
	
	/**
	 * function which remevoes the invincible form the player
	 * @param {Object} self reference to the player
	 */
	function removeInvincibleFromPlayer(self) {
		setTimeout(function(){
			self.removeComponent("InvincibleVanish")
			self.addComponent("Normal");
			self.setNormalAnimation(self.PLAYER);
			self.invincible = false;
		},2000);
	};
	
	/**
	 * function removes a player out of the players array
	 * @param {Object} self reference to the player
	 */
	function removeReference(self) {
		for (var i=0; i < players.length; i++) {
			if(players[i] == self){
				players[i] = undefined;
			}
		}
	};
	
	function generateStartPosition (PLAYER_NUMBER) {
		switch (PLAYER_NUMBER) {
			case 1:
				return {x: 32, y: 32-12, z: 10};
				break;
			case 2:
				return {x: 32*17, y: 32*13-12, z: 10};				
				break;
			case 3:
				return {x: 32*8, y: 32*7-12, z: 10};
				break;
			case 4:
				return {x: 32*17, y: 32-12, z: 10};
				break;
			case 5:
				return {x: 32, y: 32*13-12, z: 10};
				break;
			default:
				break;
		}
	}
	
	

	function getPlayerCord(playerString) {
		if (playerString == "POLICEMAN") {
			return 0;
		} else if(playerString == "DUKE"){
			return 132;
		} else if (playerString == "DETECTIVE") {
			return 264;
		} else if (playerString == "GREEN"){
			return 396;
		} else if (playerString == "CHINESE") {
			return 528;			
		} else if (playerString == "MICHA") {
			return 660;
		} else{
			return 1000;
		}
	};
	
	/**
	 * function generates the world
	 * generates the wall and brick entities
	 */
	function generateWorld() {
		/**
		 * Initialize the arrays with 0
		 */
		for (var j = 0; j <= 14; j++) {
			for (var i = 0; i <= 18; i++) {
				brick_array[i][j] = 0;
				entity_array[i][j] = 0;
				goody_array[i][j] = 0;
			}
		}
		
		for (var j = 0; j <=14; j++) {
			for (var i = 0; i <=18; i++) {
				
				if (generateWall(i, j)) { 
				    Crafty.e("2D, DOM, wall")
				    .attr({ x: i * 32, y: j * 32, z: 3 })
				}
				
				if(generateBricks(i, j)) {
					entity_array[i][j] = Crafty.e("2D, DOM, brick, solid, explodable")
						.attr({ x: i * 32, y: j * 32, z: 3 })
						.bind('explode', function() {
							Crafty.e("SetBurningBrick")
								.setBurningBrick(this.x, this.y);
                            this.destroy();
                        })
				}
			}
		}
	}
	
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function() {
		//load takes an array of assets and a callback when complete
		Crafty.load(["sprites.png", "sprite_players.png"], function() {
			Crafty.scene("main"); //when everything is loaded, run the main scene
		});
		
		//black background with some loading text
 		Crafty.background("#337700");
		/*Crafty.e("2D, DOM, text")
			.attr({w: 32, h: 20, x: 304, y: 240})
			.text("Loading")  
			.css({"text-align": "center"});
			*/
	});
	

	//automatically play the loading scene
	Crafty.scene("loading");
	
	Crafty.scene("main", function() {
		generateWorld();

		/**
		 * Component Explode
		 * sets fire entities
		 */
		Crafty.c("Explode", {
			Explode: function (x, y, self) {
				self.bombsPlanted -= 1;
				Crafty.e("SetFire")
					.setFire(x, y, 0, 0, self, 0);
				this.delay(function() {
						//fire left 
						Crafty.e("SetFire")
							.setFire(x, y, -1, 0, self, self.fireRange-1);
						//fire right 	
						Crafty.e("SetFire")
							.setFire(x, y, 1, 0, self, self.fireRange-1);
						//fire up
						Crafty.e("SetFire")
							.setFire(x, y, 0, -1, self, self.fireRange-1);
						//fire down
						Crafty.e("SetFire")
							.setFire(x, y, 0, 1, self, self.fireRange-1);
				}, 100);
			}   
		});
		

		/**
		 * Component SetFire
		 * Sets a fire and checks for players, goodys and bricks underneath
		 */
		Crafty.c("SetFire", {
			setFire:function (x, y, dx, dy, self, fireRangeLeft) {
				var x = x+(dx * 32);
				var y = y+(dy * 32);

				if ((x == 0) || (x == 576) || (y == 0) || (y == 448)) {
					return;
				} else if (fireRangeLeft >= 0) {
		       		this.addComponent("2D","DOM","SpriteAnimation", "fire", "animate")
					.attr({x: x, y: y, z: 100})
			        .animate('fire', 0, 3, 5)
					.bind("enterframe", function(e){
						this.animate("fire", 1);
					})
					.delay(function() {
						self.xDeath = xRelocator(self.x);
						self.yDeath = yRelocator(self.y)+12;
						
						for (var i=0; i < players.length; i++) {
			 	 			if (players[i] != undefined) {							
			 	 				if (xRelocator(players[i].x) == x && yRelocator(players[i].y)+12 == y) {
									if(players[i].invincible){
										players[i].removeComponent("Invincible");
										players[i].addComponent("InvincibleVanish");
										players[i].setInvincibleVanishAnimation(players[i].PLAYER);
										removeInvincibleFromPlayer(players[i]);
									} else {
										players[i].xDeath = xRelocator(x);
										players[i].yDeath = yRelocator(y)+12;
										players[i].trigger("explode");
									}			
								}
							}
			 	 		}
						this.destroy();  
	                }, 250);
					
					if (brick_array[x/32][y/32] < 10) {
						switch (brick_array[x/32][y/32]) {
							case 2:
								fireRangeLeft = 0;
								entity_array[x/32][y/32].trigger("explode");
								brick_array[x/32][y/32] = 0;
								break;
							case 3:
								fireRangeLeft = 0;
								entity_array[x/32][y/32].sprite(2, 1);
								brick_array[x/32][y/32] = 2;
								break;
							case 4:
								fireRangeLeft = 0;
								entity_array[x/32][y/32].sprite(1, 1);
								brick_array[x/32][y/32] = 3;
								break;
							case 5:
								fireRangeLeft = 0;
								bomb_array[x/32][y/32].trigger("explode");
								brick_array[x/32][y/32] = 0;
								break;
							default:
								brick_array[x/32][y/32] = 0;
								break;
							}
					} else { 
						fireRangeLeft = 0;
						brick_array[x/32][y/32] = 0;
						goody_array[x/32][y/32].trigger("explode");
					}
					this.delay(function	() {
						fireRangeLeft -= 1;
						Crafty.e("SetFire")
							.setFire(x, y, dx, dy, self, fireRangeLeft);
					}, 150);
				} else{		
				}
			}
		});


		/**
		 * Component SetBurning brick
		 * animation for a burning brick entity
		 */
		Crafty.c("SetBurningBrick", {
			setBurningBrick: function(x, y){
			    this.addComponent("2D","DOM","SpriteAnimation", "burning_brick", "animate")
				.attr({x: x, y: y, z: 9})
		        .animate('burning_brick', 0, 4, 3)
				.bind("enterframe", function(e){
					this.animate("burning_brick", 10);
				})
				.delay(function() {
					if(Crafty.randRange(0, 50) > 25){
						switch (/*parseInt(getRandom(7))*/6) {
							case 0:
								generateGoody("speed_up", x, y, 10);
								break;
							case 1:
								generateGoody("bombs_up", x, y, 11);
								break;
							case 2:
								generateGoody("fire_up", x, y, 12);
								break;	
							case 3:
								generateGoody("time_fuze", x, y, 13);
								break;
							case 4: 
								generateGoody("death_skull", x, y, 14);
								break;
							case 5: 
								generateGoody("disease", x, y, 15);
								break;
							case 6: 
								generateGoody("invincible", x, y, 16);
								break;
							case 7: 
								generateGoody("money", x, y, 17);
								break;	
							default:
								break;
						}
					}
					this.destroy();
                }, 500)				
			}
		});
		
		
		var Gamelogic = function (pn){
			{
				this.CustomControlsPlayer = function(playerObject) {
					var move = {left: false, right: false, up: false, down: false};	
					var saveMove = {left: false, right: false, up: false, down: false};
					var costumKeys = {left: 0, right: 0, up: 0, down: 0};
					var xDeath, yDeath;
					var maxBombs, speed, fireRange, timeTillExplode, triggeredBomb, bombsPlanted, PLAYER_NUMBER, money; 
					var timeFuze, invincible;
					
					this.move = {left: false, right: false, up: false, down: false};	
					this.saveMove = {left: false, right: false, up: false, down: false};
					this.timeFuze = false;
					this.invincible = false;
					this.xDeath = 0;
					this.yDeath = 0;	
					this.speed = 1.5;
					this.fireRange = 2;
					this.timeTillExplode = 3;
					this.triggeredBomb = 0;
					this.bombsPlanted = 0;
					this.PLAYER = "";
					this.PLAYER_NUMBER = pn;
					
					var posObj = generateStartPosition(this.PLAYER_NUMBER);
					this.x = posObj.x;
					this.y = posObj.y;
					this.z = posObj.z;
					
					if(playerObject) {
						this.speed = playerObject.speed;
						this.maxBombs = playerObject.maxbomben;
						var PLAYER = playerObject.username;
						this.PLAYER = PLAYER;
						this.money = playerObject.money;
					}
					
					costumKeys.left = playerObject.controls.left;
					costumKeys.right = playerObject.controls.right;
					costumKeys.up = playerObject.controls.up;
					costumKeys.down = playerObject.controls.down;
					costumKeys.bomb = playerObject.controls.bomb;

					var self = this;
					
					var xOldRelativePlayerPosition = 0;
					var yOldRelativePlayerPosition = 0;

					var xNewRelativePlayerPosition = xRelocator(this.x)/32;
					var yNewRelativePlayerPosition = (yRelocator(this.y+12)+12)/32;
					this.z = yNewRelativePlayerPosition+9;

					this.bind('enterframe', function() {

						xNewRelativePlayerPosition = xRelocator(this.x)/32;
						yNewRelativePlayerPosition = (yRelocator(this.y+12)+12)/32;

						if(xOldRelativePlayerPosition != xNewRelativePlayerPosition || yOldRelativePlayerPosition != yNewRelativePlayerPosition){
							if(yNewRelativePlayerPosition > yOldRelativePlayerPosition){
								this.z +=1
							} 
							if(yNewRelativePlayerPosition < yOldRelativePlayerPosition){
								this.z -=1
							}

							xOldRelativePlayerPosition = xNewRelativePlayerPosition;
							yOldRelativePlayerPosition = yNewRelativePlayerPosition;						
						}
						if(move.right) {
							if(!this.isPlaying("walk_right_"+PLAYER))
								this.stop().animate("walk_right_"+PLAYER, 6);
							
							if(!solidRight(this)){
								var r = yPlayerRelocator(this.y+12);
								this.y = r;
								this.x += this.speed;
								saveMove.right = true;
							}
						}
						else if(move.left) {
							if(!this.isPlaying("walk_left_"+PLAYER))
								this.stop().animate("walk_left_"+PLAYER, 6);
								
							if(!solidLeft(this)){
								var r = yPlayerRelocator(this.y+12);
								this.y = r;
								this.x -= this.speed; 
								saveMove.left = true;
							}
						}
						else if(move.up) {
							if(!this.isPlaying("walk_up_"+PLAYER))
								this.stop().animate("walk_up_"+PLAYER, 6);
								
							if(!solidUp(this)){
								var r = xPlayerRelocator (this.x);
								this.x = r;
								this.y -= this.speed;
								saveMove.up = true;
							}
						}
						else if(move.down) {
							if(!this.isPlaying("walk_down_"+PLAYER))
								this.stop().animate("walk_down_"+PLAYER, 6);
							if(!solidDown(this)){
								var r = xPlayerRelocator (this.x);
								this.x = r;
								this.y += this.speed;
								saveMove.down = true;
							}
						}
						}).bind('keydownself', function(e) {
						if (e.which === costumKeys.right) {
							saveMove.right = true;
							move.right = true;
						}
						if (e.which === costumKeys.left) {
							saveMove.left = true;
							move.left = true;
						}
						if (e.which === costumKeys.up) {
							saveMove.up = true;
							move.up = true;
						}
						if (e.which === costumKeys.down) {
							saveMove.down = true;
							move.down = true;
						}
						if (e.which === costumKeys.bomb) {
							if(saveMove.right){
								move.right = true;
							}
							else if(saveMove.left){
								move.left = true;
							}
							else if(saveMove.up){
								move.up = true;
							}
							else if(saveMove.down){
								move.down = true;
							}
							var xGrid = xRelocator (this.x);
							var yGrid = yRelocator(this.y)+12;
							if (!this.timeFuze){
								if (this.bombsPlanted < this.maxBombs) {
									if (!(brick_array[xGrid/32][yGrid/32] == 5)) {
										brick_array[xGrid/32][yGrid/32] = 5;
										this.bombsPlanted += 1;	
										bomb_array[xGrid/32][yGrid/32] = Crafty.e("2D","DOM","SpriteAnimation", "bomb", "animate", "explodable", "Explode")
																.attr({x: xGrid, y: yGrid, z: 10})
														        .animate('bomb', 0, 2, 2)
																.bind("enterframe", function(e){
																	this.animate("bomb", 10);
																})
																.bind("explode", function() {
																	brick_array[xGrid/32][yGrid/32] = 0;
												                    Crafty.e("Explode")
																	  .Explode(xGrid, yGrid, self);
																	this.destroy();
																});
										setTimeout(function(){
												brick_array[xGrid/32][yGrid/32] = 0;
												bomb_array[xGrid/32][yGrid/32].trigger("explode");
							                }, this.timeTillExplode * 1000);	
									}
								}
							} else {
								if(this.bombsPlanted < 1) {
									this.bombsPlanted = 1;
									brick_array[xGrid/32][yGrid/32] = 5;
									triggeredBomb = Crafty.e("2D","DOM","SpriteAnimation", "bomb", "animate", "explodable")
										.attr({x: xGrid, y: yGrid, z: 9})
							        	.animate('bomb', 0, 2, 2)
										.bind("enterframe", function(e){
											this.animate("bomb", 10);
										})
										.bind("explode", function() {
											brick_array[xGrid/32][yGrid/32] = 0;
					                    	Crafty.e("Explode")
										  		.Explode(xGrid, yGrid, self);
											this.destroy();
										})										
								}						
							}
		             };	
			
					}).bind('keyupself', function(e) {
						if (e.which === costumKeys.right) {
							move.right = false;
							saveMove.right = false;
							this.stop().animate("stay_right_"+PLAYER, 1);
						}
						if (e.which === costumKeys.left) {
							move.left = false;
							saveMove.left = false;
							this.stop().animate("stay_left_"+PLAYER, 1);
						}
						if (e.which === costumKeys.up){
							move.up = false;
							saveMove.up = false;
							this.stop().animate("stay_up_"+PLAYER, 1);
						} 
						if (e.which === costumKeys.down) {
							move.down = saveMove.down = false;
							this.stop().animate("stay_down_"+PLAYER, 1);
						}


						if(this.timeFuze){
							if(e.which === costumKeys.bomb) {
								triggeredBomb.trigger("explode");
								bombsPlanted = 0;
							}
						}			
					})
					return this;
				}
				this.detonateTriggeredBomb = function(){
					if(triggeredBomb){
						triggeredBomb.trigger("explode");
					}
				};

			}
			
		}

		
		/**
		 * Component DeathAnimation
		 * animates the player death 
		 * @param reference to the player
		 */
		Crafty.c("DeathAnimation", {
			setDeathAnimation:function (self) {
				var PLAYERDEATHCORD = getPlayerCord(self.PLAYER) + 44;
				this.addComponent(self.PLAYER+"_DEATH")
				.animate(self.PLAYER+"_DEATH", [[0,PLAYERDEATHCORD],[32,PLAYERDEATHCORD],[64,PLAYERDEATHCORD],
				[96,PLAYERDEATHCORD],[128,PLAYERDEATHCORD],[160,PLAYERDEATHCORD],[192,PLAYERDEATHCORD],
				[224,PLAYERDEATHCORD],[256,PLAYERDEATHCORD]])
				//.animate('sprite_player_death_1', 0, 3, 8)
				.bind("enterframe", function(e){
					this.animate(self.PLAYER+"_DEATH", 10);
				})
				.delay(function() {
					console.log(self.PLAYER+" is dead");
					PLAYERS_ALIVE -=1;
					removeReference(self);
					checkForWinner(self);
					this.destroy();				
                }, 600)
			}
		});
		
		/**
		 * Component Normal
		 * animates the normal player look
		 */
		Crafty.c("Normal", {
			setNormalAnimation: function(PLAYER){
				var PLAYERCORD = getPlayerCord(PLAYER);
				this.animate("stay_left_"+PLAYER, [[192,PLAYERCORD]])
				this.animate("stay_right_"+PLAYER, [[288,PLAYERCORD]])
				this.animate("stay_up_"+PLAYER, [[96,PLAYERCORD]])
				this.animate("stay_down_"+PLAYER, [[0,PLAYERCORD]])

				this.animate("walk_left_"+PLAYER, [[192,PLAYERCORD],[224,PLAYERCORD],[256,PLAYERCORD]])
	            this.animate("walk_right_"+PLAYER, [[288,PLAYERCORD],[320,PLAYERCORD],[352,PLAYERCORD]])
	            this.animate("walk_up_"+PLAYER, [[96,PLAYERCORD],[128,PLAYERCORD],[160,PLAYERCORD]])
	            this.animate("walk_down_"+PLAYER, [[0,PLAYERCORD],[32,PLAYERCORD],[64,PLAYERCORD]])
				this.bind("enterframe", function(e) {

				});
				return this;
			}
		});
		
		/**
		 * Component Invincible
		 * animates the invincible player look
		 */
		Crafty.c("Invincible", {
			setInvincibleAnimation:function(PLAYER) {
				var PLAYERCORD = getPlayerCord(PLAYER)+88;
				this.animate("stay_left_"+PLAYER, [[192,PLAYERCORD]])
				this.animate("stay_right_"+PLAYER, [[288,PLAYERCORD]])
				this.animate("stay_up_"+PLAYER, [[96,PLAYERCORD]])
				this.animate("stay_down_"+PLAYER, [[0,PLAYERCORD]])

				this.animate("walk_left_"+PLAYER, [[192,PLAYERCORD],[224,PLAYERCORD],[256,PLAYERCORD]])
	            this.animate("walk_right_"+PLAYER, [[288,PLAYERCORD],[320,PLAYERCORD],[352,PLAYERCORD]])
	            this.animate("walk_up_"+PLAYER, [[96,PLAYERCORD],[128,PLAYERCORD],[160,PLAYERCORD]])
	            this.animate("walk_down_"+PLAYER, [[0,PLAYERCORD],[32,PLAYERCORD],[64,PLAYERCORD]])
			}
		});
		
		/**
		 * Component InvincibleVanish
		 * animates the vanish of invinciblity
		 */
		Crafty.c("InvincibleVanish", {
			setInvincibleVanishAnimation:function(PLAYER) {
				var PLAYERCORD = getPlayerCord(PLAYER);

				this.animate("stay_left_"+PLAYER, [[192,PLAYERCORD],[192,PLAYERCORD + 88]])
				this.animate("stay_right_"+PLAYER, [[288,PLAYERCORD],[192,PLAYERCORD + 88]])
				this.animate("stay_up_"+PLAYER, [[96,PLAYERCORD],[96,PLAYERCORD + 88]])
				this.animate("stay_down_"+PLAYER, [[0,PLAYERCORD], [0,PLAYERCORD + 88]])

				this.animate("walk_left_"+PLAYER, [[192,PLAYERCORD],[224,PLAYERCORD + 88],[256,PLAYERCORD]])
	            this.animate("walk_right_"+PLAYER, [[288,PLAYERCORD],[320,PLAYERCORD + 88],[352,PLAYERCORD]])
	            this.animate("walk_up_"+PLAYER, [[96,PLAYERCORD],[128,PLAYERCORD + 88],[160,PLAYERCORD]])
	            this.animate("walk_down_"+PLAYER, [[0,PLAYERCORD],[32,PLAYERCORD + 88],[64,PLAYERCORD]])
			}
		});	
		
		
		/**Set TimeoutFunction
		*@author Sergej
		*/
		setTimeout(function() { 

			backgroundAlarm(startcolor);
			alarmDeath();
			//alarm.play();
		}, 3000); //Time passing after starting game before Alarm starts (in milli seconds)

		/**
		 * Generates an instances of players
		 */
		for (var i=0; i < playerObj.length; i++) {
			var GL = new Gamelogic(i+1);
			Crafty.c('CustomControls', GL);

			players[i] = Crafty.e("2D, DOM,"+ playerObj[i].username +", CustomControls, animate, explodable, Normal")
				.CustomControlsPlayer(playerObj[i])
				.bind("explode", function() {
					if(this.timeFuze){
						this.detonateTriggeredBomb();
					}
					Crafty.e("DeathAnimation", "2D","DOM","SpriteAnimation", "animate")
						.attr({x: this.xDeath, y: this.yDeath-12, z: 10})
						.setDeathAnimation(this);
					this.destroy();
				})
				.setNormalAnimation(playerObj[i].username);
		};
	});
};