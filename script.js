var frameCount = 0;
	var delfc = 0;
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
	        speed: 3,
	        velX: 0,
	        velY: 0,
	        jumping: false,
	        grounded: false
	    },
	    keys = [],
	    friction = 0.8,
	    gravity = 0.3;

	var boxes = [];
	console.log(boxes);
	var array = [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	for(var i = 0; i < array.length; i++){
		array[i] = Math.random();
	};

	canvas.width = width;
	canvas.height = height;

	function update() {
		if(player.y > 200){
			location.reload();
		}
		var pixel = 30;
		boxes = [];
		boxes.push({
		    x: 0,
		    y: height - 2,
		    width: width -player.x,
		    height: 50
		});
		for(var i = 0; i < array.length; i++){
			boxes.push({
				x: canvas.width - player.x + pixel,
				y: (1-array[i])*canvas.height,
				width: 20,
				height: 10
			});
			pixel += 10;
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
	    ctx.fillStyle = "black";
	    ctx.beginPath();
	    
	    player.grounded = false;
	    for (var i = 0; i < boxes.length; i++) {
	        ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
	        
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
	    
	    if(player.grounded){
	         player.velY = 0;
	    }
	    
	    player.x += player.velX;
	    player.y += player.velY;

	    ctx.fill();
	    ctx.fillStyle = "red";
	    ctx.fillRect(60, player.y, player.width, player.height);
	    frameCount++;
	    requestAnimationFrame(update);
	}

	function colCheck(shapeA, shapeB) {
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