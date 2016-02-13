var canvas;
    var canvasContext;
    var ballX = 50;
    var ballY = 50;
    var ballSpeedX = 10;
    var ballSpeedY = 4;

    var paddle1Y = 250;
    var paddle2Y = 250;
    const PADDLE_HEIGHT = 100;
    const PADDLE_THICKNESS = 10;
    
    var player1Score = 0;
    var player2Score = 0;
    const WIN_SCORE = 5;
    var showWonScreen = false;

function calcMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };
}


function mouseClick(evt) {
    if(showWonScreen) {
        player1Score = 0;
        player2Score = 0;
        showWonScreen = false;
    }
}


window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;

    setInterval(function() {
            drawEverything();
            moveEverything();
        }, 1000/framesPerSecond);

    canvas.addEventListener('mousedown', mouseClick);

    // controling paddle with the mouse
    canvas.addEventListener('mousemove', 
        function(evt) {
                var mousePos = calcMousePos(evt);
                paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
        });
}

function ballReset() {
    if(player1Score >= WIN_SCORE ||
       player2Score >= WIN_SCORE) {
            showWonScreen = true;
    }

    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function computerMovement() {
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
    if(paddle2YCenter < ballY - 30) {
        paddle2Y += 6;
    } else if(paddle2YCenter > ballY - 30) {
        paddle2Y -= 6;
    }
}

function moveEverything() {
    if(showWonScreen) {
        return;
    }

    computerMovement();

    ballX = ballX + ballSpeedX;
    ballY = ballY + ballSpeedY;

    if(ballX < 0) {
        if(ballY > paddle1Y &&
           ballY < paddle1Y + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;

                var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
                ballSpeedY = deltaY * 0.35;
        } else {
                player2Score ++; // MUST BE ABOVE BALLRESET()
                ballReset();
        }
    }

    if(ballX > canvas.width - 5) {
        if(ballY > paddle2Y &&
           ballY < paddle2Y + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;

                var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
                ballSpeedY = deltaY * 0.35;
        } else {
                player1Score ++; // MUST BE ABOVE BALLRESET()
                ballReset();
        }
    }

    if(ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }

    if(ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
}

function drawNet() {
    for (var i = 0; i < canvas.height; i += 40) {
        colorRect(canvas.width/2 - 1, i, 2, 20, 'white');
    }
}

function drawEverything() {
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    // showing the winning screen
    if(showWonScreen) {
        canvasContext.font = "32px Arial";
        canvasContext.fillStyle = 'white';

        if(player1Score >= WIN_SCORE) {
            canvasContext.fillText('YAY!!!', 350, 200);
            canvasContext.fillText('You won!!!', 320, 240);
        } else if(player2Score >= WIN_SCORE) {
            canvasContext.fillText('You lost!!!', 320, 200);
        }
        canvasContext.fillText('click to continue', 280, 400);
        return;
    }


    drawNet();


    // paddle 1, aka player 1
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    
    // paddle 2, aka player 2
    colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

    // the ball
    colorCircle(ballX, ballY, 10, 'white');

    // scores
    canvasContext.font = "24px Arial";
    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2, true);
    canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}
