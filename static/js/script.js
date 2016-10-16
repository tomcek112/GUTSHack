	var frameCount = 0;
	var delfc = 0;
	var deadX = 0;
	var deadBlock = 0;
	var deadSent = 0;
	var deadDraw = false;
	var mode = 0;

	$("#canvas").focus();

	(function () {
	    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	    window.requestAnimationFrame = requestAnimationFrame;
	})();

	var canvas = document.getElementById("canvas"),
	    ctx = canvas.getContext("2d"),
	    width = 500,
	    height = 200,
	    player = {
	        x: 60,
	        y: height - 15,
	        width: 5,
	        height: 5,
	        speed: 4,
	        velX: 0,
	        velY: 0,
	        jumping: false,
	        grounded: false
	    },
	    keys = [],
	    friction = 0.75,
	    gravity = 0.3;

	var boxes = [];
	console.log(boxes);
	var array = [];
	array = $.get('/level').then(function(data) {
		array = data.result;
	})
	var globalHighscore = 0;
	var globalDeaths = [];
	$.get('/scores').then(function(data) {
		globalHighscore = data.highscore;
		globalDeaths = data.deathScores;

	})
	// for(var i = 0; i < array.length; i++){
	// 	array[i] = Math.random();
	// };

	canvas.width = width;
	canvas.height = height;
	canvas.style.backgroundColor = "black";

	var oldPlayerX = [];
	var oldPlayerY = [];


	function update() {

		if(mode) {
	        ctx.rotate(((Math.random() * 2) -1)*Math.PI/360);
		}

		//console.log(player.y)
		if(player.y > 250){
			//location.reload();
			player.speed=0;
			deadX = player.x;
			//console.log(deadX);
			if(!deadSent){
				var formData = new FormData();
				console.log(deadBlock);
				formData.append("vector", array);
				formData.append("score", deadBlock); 
				formData.append("highscore", Math.floor(player.x)); 
				var request = new XMLHttpRequest();
				request.open("POST", "http://127.0.0.1:5000/post_level");
				request.send(formData);
				request.onload = function() {
					deadDraw = true;
					setTimeout(function() {location.reload()}, 1100);
				}
				deadSent = 1;
			}
		}
		var pixel = 10;
		boxes = [];
		var deathMarkers = [];
		boxes.push({
		    x: 0,
		    y: height - 2,
		    width: width -player.x,
		    height: 50
		});

		for(var i = 0; i < globalDeaths.length; i++){
			deathMarkers.push({
				x: globalDeaths[i] - player.x + 60,
				y: 10,
				width: 1,
				height: 5,
				unhittable: 1,
				color: "yellow"
			});
		}

		for(var i = 0; i < array.length; i++){
			if(canvas.width - player.x + pixel -60 > -10 && canvas.width - player.x + pixel -60 < 10){
				deadBlock= i;
			}
			boxes.push({
				x: canvas.width - player.x + pixel,
				y: (1-array[i])*canvas.height + 25,
				width: 20,
				height: 10
			});
			if(mode) {
				pixel += 60
			}
			else {
				pixel += 40;
			}
		}
	    if (keys[38] || keys[32] || keys[87]) {
	        // up arrow or space
	        if (!player.jumping && player.grounded) {
	            player.jumping = true;
	            player.grounded = false;
	            player.velY = -player.speed * 2;
	        }
	    }
	    if (keys[39] || keys[68]) {
	        // right arrow
	        if (player.velX < player.speed) {
	            player.velX += 0.8;
	        }
	    }
	    if (keys[37] || keys[65]) {
	        // left arrow
	        if (player.velX > -player.speed) {
	            player.velX--;
	        }
	    }

	    player.velX *= friction;
	    player.velY += gravity;

	    ctx.clearRect(0, 0, width, height);
	    ctx.fillStyle = "white";
	    ctx.beginPath();
	    if(player.x -60 > 0) {
	    	ctx.font="12pxx Arial";
			ctx.fillText(Math.floor(player.x -60).toString(),canvas.width - 30,20);
	    }
	    

	    if(player.x < -400) {
			ctx.font="30px Arial";
			ctx.fillText("Here be dragons",10,50); 
			var img=document.getElementById("dragon");
    		ctx.drawImage(img,canvas.width - 220,5);
			boxes.push({
				x: 40,
				y: canvas.height - 50,
				width: 20,
				height: 80
			});
		};
	    
	    
	    player.grounded = false;
	    ctx.fillStyle = "white";
	    for (var i = 0; i < boxes.length; i++) {
	    	if(mode) {
	    		boxes[i].width = boxes[i].width * 1.5;
	    		boxes[0].width = boxes[0].width / 1.5;
	    		ctx.fillRect(boxes[i].x, boxes[i].y , boxes[i].width, boxes[i].height);
	    	}
	    	else {
	        	ctx.fillRect(boxes[i].x, boxes[i].y , boxes[i].width, boxes[i].height);
	    	};
	        
	        var dir = colCheck(player, boxes[i]);
	        if(dir && dir !== "b"){
	        	console.log(dir);
	        };
	        
	        if (dir === "l" || dir === "r") {
	            player.velX = 0;
	            player.jumping = false;
	        } else if (dir === "b") {
	            player.grounded = true;
	            player.jumping = false;
	        } else if (dir === "t") {
	            player.velY *= -1;
	        }

	    }
	    ctx.fill();

	    for(var i = 1; i < deathMarkers.length; i++){
	    	ctx.fillStyle = deathMarkers[i].color;
	    	ctx.fillRect(deathMarkers[i].x, deathMarkers[i].y , deathMarkers[i].width, deathMarkers[i].height);
	    }
	    ctx.fill();

	    ctx.fillStyle = "cyan";
	    ctx.fillRect(globalHighscore - player.x + 60, 10 , 1, 10);
	    ctx.font="9px Arial";
		ctx.fillText("Highscore",globalHighscore - player.x + 40,28);
	    ctx.fill();
	    
	    if(player.grounded){
	         player.velY = 0;
	    }
	    
	    player.x += player.velX;
	    player.y += player.velY;

	    ctx.fill();
	    ctx.fillStyle = "cyan";
	    ctx.fillRect(60, player.y, player.width, player.height);
	    ctx.fill();
	    ctx.beginPath();
	    ctx.fillStyle = "rgba(0,255,255,0.2)";
	    ctx.arc(60 +1, player.y + 1.5, 7, 0, 2*Math.PI);
	    ctx.fill();
	    ctx.fillStyle = "rgba(0,255,255,0.1)";
	    ctx.arc(60 + 1, player.y + 2.5, 14, 0, 2*Math.PI);
	    ctx.fill();

	    oldPlayerX.push(player.x);
		oldPlayerY.push(player.y);
		var offset = -4;
		var fade = 0.1;
		for(var i = oldPlayerX.length - 15; i < oldPlayerX.length; i++){
			offset += 4;
			ctx.beginPath();
			fade = fade*1.1;
			var style = "rgba(0,255,255,".concat(fade.toString().concat(")"));
			ctx.fillStyle = style;
			ctx.arc(oldPlayerX[i] -player.x +60, oldPlayerY[i] +3, 3, 0, 2*Math.PI);
			ctx.fill();
		}

		if(deadDraw){
			for (var i = 0; i < settings.density; i++) {
	          new Particle();
	        }

	        for (var i in particles) {
	        	if(i < 500){
	        		particles[i].draw();
	        	}
	        }
		}

	    frameCount++;
	    requestAnimationFrame(update);
	}

	function colCheck(shapeA, shapeB) {
		if(shapeB.unhittable) {
			return;
		}
	    var vX = (60 + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
	        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
	        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
	        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
	        colDir = null;

	    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
	        var oX = hWidths - Math.abs(vX),
	            oY = hHeights - Math.abs(vY);
	        if (oX >= oY) {
	            if (vY > 0) {
	                colDir = "t";
	                shapeA.y += oY;
	            } else {
	                colDir = "b";
	                shapeA.y -= oY;
	            }
	        } else {
	            if (vX > 0) {
	                colDir = "l";
	                shapeA.x += oX;
	            } else {
	                colDir = "r";
	                shapeA.x -= oX;
	            }
	        }
	    }
	    return colDir;
	}


	// $('.left').on('vmousedown', function() {
	// 	keys[37] = true;
	// 	console.log("herr");
	// })
	// $('.left').on('vmouseup', function() {
	// 	keys[37] = false;
	// 	console.log("herr");
	// })
	// $('.right').on('vmousedown', function() {
	// 	keys[39] = true;
	// 	console.log("herr");
	// })
	$('#jump').tap(function(e) {
		keys[32] = true;
		setTimeout(function(){
		  keys[32] = false;
		}, 200);
		console.log("herr");
	});
	$('#left').tapstart(function(e) {
		keys[37] = true;
		console.log("herr");
	});
	$('#left').tapend(function(e) {
		keys[37] = false;
		console.log("herr");
	});
	$('#right').tapstart(function(e) {
		keys[39] = true;
		console.log("herr");
	});
	$('#right').tapend(function(e) {
		keys[39] = false;
		console.log("herr");
	});

	$('#reload').click(function(e) {
		location.reload();
	});
	$('#hc').click(function(e) {
		mode = 1;
	})

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	 	$('.mobile__button').show();
	}
	

	var infoToggle = false;
	$('.info').on('click', function() {
		if(infoToggle) {
			$('.info').css('width', '50px').css('height', '50px').css('justify-content', 'center').css('align-items', 'center').css('padding', '0px');
			infoToggle = false;
			$('.info__text').toggle();
			$('.info__blob').toggle();
		}
		else {
			$('.info').css('width', '600px').css('height', '300px').css('justify-content', 'flex-start').css('align-items', 'baseline').css('padding', '20px');
			infoToggle = true;
			$('.info__text').toggle();
			$('.info__blob').toggle();
		}
	});

	document.body.addEventListener("keydown", function (e) {
	    keys[e.keyCode] = true;
	});

	document.body.addEventListener("keyup", function (e) {
	    keys[e.keyCode] = false;
	});


	window.addEventListener("load", function () {
	    update();
	});

	setInterval(fps, 1000);

	function fps(){
		console.log(frameCount - delfc);
		delfc = frameCount;
	}







	//PARTICLE TEST

	var particles = {},
      particleIndex = 0,
      settings = {
        density: 100,
        particleSize: 1,
        startingX: player.x,
        startingY: canvas.height,
        gravity: 0.1,
        maxLife: 50,
        groundLevel: canvas.height,
        leftWall: 0,
        rightWall: canvas.width
      };


      var seedsX = [];
      var seedsY = [];
      var maxAngles = 100;
      var currentAngle = 0;

      function seedAngles() {
        seedsX = [];
        seedsY = [];
        for (var i = 0; i < maxAngles; i++) {
          seedsX.push(Math.random() * 20 - 10);
          seedsY.push(Math.random() * 30 - 10);
        }
      }


      seedAngles();


      function Particle() {
        if (currentAngle !== maxAngles) {
          // Establish starting positions and velocities
          this.x = settings.startingX;
          this.y = settings.startingY;

          this.vx = seedsX[currentAngle];
          this.vy = seedsY[currentAngle];

          currentAngle++;

          // Add new particle to the index
          // Object used as it's simpler to manage that an array
          particleIndex ++;
          particles[particleIndex] = this;
          this.id = particleIndex;
          this.life = 0;
          this.maxLife = settings.maxLife;
        } else {
          console.log('Generating more seed angles');
          seedAngles();
          currentAngle = 0;
        }
      }

      Particle.prototype.draw = function() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Give the particle some bounce
        if ((this.y + settings.particleSize) > settings.groundLevel) {
          this.vy *= -0.6;
          this.vx *= 0.75;
          this.y = settings.groundLevel - settings.particleSize;
        }

        // Determine whether to bounce the particle off a wall
        if (this.x - (settings.particleSize) <= settings.leftWall) {
          this.vx *= -1;
          this.x = settings.leftWall + (settings.particleSize);
        }

        if (this.x + (settings.particleSize) >= settings.rightWall) {
          this.vx *= -1;
          this.x = settings.rightWall - settings.particleSize;
        }

        // Adjust for gravity
        this.vy += -settings.gravity;

        // Age the particle
        this.life++;

        // If Particle is old, it goes in the chamber for renewal
        if (this.life >= this.maxLife) {
          delete particles[this.id];
        }
        ctx.fill()
        // Create the shapes
        ctx.fillStyle = "cyan";
        ctx.fillRect(this.x, this.y, settings.particleSize, settings.particleSize);
        ctx.clearRect(settings.leftWall, settings.groundLevel, canvas.width, canvas.height);
        //ctx.beginPath();
        //ctx.fillStyle="cyan";
        // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
        //ctx.arc(this.x, this.y, settings.particleSize, 0, Math.PI*2, true); 
        //ctx.closePath();
        ctx.fill();
      }

      // setInterval(function() {
      //   ctx.fillStyle = "rgba(10,10,10,0.8)";
      //   ctx.fillRect(this.x, this.y, canvas.width, canvas.height);


      //   // Draw the particles
      //   for (var i = 0; i < settings.density; i++) {
      //     new Particle();
      //   }

      //   for (var i in particles) {
      //     particles[i].draw();
      //   }
      // }, 30);



