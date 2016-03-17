var WHITE = -1, BLACK = 1, NOPUT = 0;
var canvas, context;
var winner = NOPUT;
var nowColor = BLACK;
var blackDifficult = false;
var img_w = new Image(), img_b = new Image();
var histMove = Array();
img_w.src = "images/white.png";
img_b.src = "images/black.png";

var chessData = new Array(15);
for (var i = 0; i < chessData.length; ++i) {
  chessData[i] = new Array(15);
  for (var j = 0; j < chessData[i].length; ++j) {
    chessData[i][j] = NOPUT;
  }
}

function drawRect () {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  for (var i = 20; i < 600; i += 40) {
    context.beginPath();
    context.moveTo(20, i);
    context.lineTo(580, i);
    context.closePath();
    context.stroke();
    context.beginPath();
    context.moveTo(i, 20);
    context.lineTo(i, 580);
    context.closePath();
    context.stroke();
  }
}

function isValid (x, y) {
  return x>=0&&x<chessData[0].length&&y>=0&&y<chessData.length;
}

function countLine (x, y, dx, dy) {
  if( !isValid(x, y) ) {
    return 0;
  }
  var chess = chessData[x][y];

  var ax = x, ay = y;
  var bx = x, by = y;
  while (isValid(ax, ay) && chess==chessData[ax][ay]) {
    ax += dx;
    ay += dy;
  }
  while (isValid(bx, by) && chess==chessData[bx][by]) {
    bx -= dx;
    by -= dy;
  }
  var length = Math.max(Math.abs(ax-bx), Math.abs(ay-by)) - 1;

  return length;
}

function isOver(x, y) {
  if ( !isValid(x, y) ) {
    return NOPUT;
  }
  var chess = chessData[x][y];
  var direction = Array(8);
  direction[0]=0;direction[1]=1;
  direction[2]=1;direction[3]=0;
  direction[4]=1;direction[5]=1;
  direction[6]=1;direction[7]=-1;

  var nThree = 0, nFour = 0, nFive = 0, nSix = 0;
  for (var i = 0; i < direction.length; i+=2) {
    var tmp = countLine(x, y, direction[i], direction[i+1]);
    if (tmp==3) nThree++;
    else if(tmp==4) nFour++;
    else if(tmp==5) nFive++;
    else if(tmp>5) nSix++;
  }

  if (blackDifficult && chess == BLACK) {
    if (nFive) {
      return chess;
    }
    if (nSix || nThree >= 2 || nFour >= 2)
      return WHITE;
  }
  else {
    if (nFive || nSix)
      return chess;
  }
  return NOPUT;
}

function drawChess(x, y) {
  if (nowColor == WHITE) {
    context.drawImage(img_w, x*40+5, y*40+5);
  }
  else {
    context.drawImage(img_b, x*40+5, y*40+5);
  }
}

function undrawChess(x, y) {
  context.fillStyle="white";
  context.fillRect(x*40, y*40, 40, 40);
  context.beginPath();
  context.moveTo(Math.max(20,x*40), y*40+20);
  context.lineTo(Math.min(580,x*40+40), y*40+20);
  context.closePath();
  context.stroke();
  context.beginPath();
  context.moveTo(x*40+20, Math.max(20,y*40) );
  context.lineTo(x*40+20, Math.min(580,y*40+40) );
  context.closePath();
  context.stroke();
}

function posit(x, y) {
  histMove.push(x);
  histMove.push(y);
  chessData[x][y] = nowColor;
  nowColor = -nowColor;
  winner = isOver(x, y);
}

function unposit() {
  var y = histMove.pop();
  var x = histMove.pop();
  chessData[x][y] = NOPUT;
  nowColor = -nowColor;
  winner = NOPUT;
}

function play(x, y) {
  if (winner) {
    alert("Game is over");
    return;
  }
  drawChess(x, y);
  posit(x, y);
  if (winner) {
    if (winner == WHITE) {
      alert("WHITE wins");
    }
    else {
      alert("BLACK wins");
    }
  }
}

function unplay() {
  if (histMove.length == 0) {
    alert("No hist");
    return;
  }
  var x = histMove[histMove.length-2];
  var y = histMove[histMove.length-1];
  unposit(x, y);
  undrawChess(x, y);
}

function playWithMouse (e) {
  var x = parseInt(e.offsetX/40);
  var y = parseInt(e.offsetY/40);
  if (!isValid(x, y)) {
    return;
  }
  if (chessData[x][y] != NOPUT) {
    alert("You can't play here");
    return ;
  }
  play(x, y);
}

function init() {
  while (histMove.length > 0) {
    unplay();
  }
}
