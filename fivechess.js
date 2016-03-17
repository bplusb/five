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

function countSame (x, y, dx, dy, c) {
  var l = 0, cnt = 0;
  var a = Array(4);
  a[0] = a[1] = a[2] = a[3] = 0;
  while (isValid(x, y) && c != -chessData[x][y]) {
    if (chessData[x][y] == NOPUT) {
      a[cnt ++] = l;
      if (cnt >= a.length) {
        break;
      }
    }
    x += dx;
    y += dy;
    l ++;
  }
  for (var i = cnt; i < a.length; ++ i) {
    a[i] = l;
  }
  return a;
}

function countLine (x, y, dx, dy) {
  var bd = blackDifficult && chessData[x][y] == BLACK;
  var ret = {};
  var chess = chessData[x][y];
  var a = countSame(x, y, dx, dy, chess);
  var b = countSame(x-dx, y-dy, -dx, -dy, chess);

  ret[2]=ret[3]=ret[4]=ret[5]=ret[6]=ret[-4]=ret[-3]=0;
  if (a[0]+b[0] == 5) {
    ret[5] = 1;
    return ret;
  }
  if (a[0]+b[0] > 5) {
    ret[6] = 1;
    return ret;
  }
  if (a[0]+b[0]==4) {
    if (bd) {
      var sum = (a[0] + b[1] == 5) && (a[1] + b[0] == 5);
      if (sum == 1) {
        ret[-4] = 1;
      }else if(sum == 2) {
        ret[4] = 1;
      }
    }
    else {
      var sum = (a[0] + b[1] >= 5) && (a[1] + b[0] >= 5);
      if (sum == 1) {
        ret[-4] = 1;
      }else if(sum == 2) {
        ret[4] = 1;
      }
    }
    return ret;
  }
  else {
    var ok = false;
    if (bd) {
      if (a[0] + b[1] == 5) {ret[-4] ++; ok=true;}
      if (a[1] + b[0] == 5) {ret[-4] ++; ok=true;}
    }
    else {
      if (a[0] + b[1] >= 5) {ret[-4] ++; ok=true;}
      if (a[1] + b[0] >= 5) {ret[-4] ++; ok=true;}
    }
    if (ok) {
      return ret;
    }
  }
  // huo3
  if (b[1]>b[0]&&a[1]>a[0]) {
    if (bd) {
      var sum = (b[1]+a[0]==4&&b[2]+a[0]==5&&a[1]+b[1]==5)+(b[0]+a[1]==4&&b[1]+a[1]==5&&a[2]+b[0]==5);
      if (sum) {ret[3]=1;return ret;}
    }
    else {
      var sum = (b[1]+a[0]==4&&b[2]+a[0]>=5&&a[1]+b[1]>=5)+(b[0]+a[1]==4&&b[1]+a[1]>=5&&a[2]+b[0]>=5);
      if (sum) {ret[3]=1;return ret;}
    }
  }
  if (bd) {
    var ok = false;
    if (bd) {
      if (a[0] + b[2] == 5) {ret[-3] ++; ok=true;}
      if (a[1] + b[1] == 5) {ret[-3] ++; ok=true;}
      if (a[2] + b[0] == 5) {ret[-3] ++; ok=true;}
    }
    else {
      if (a[0] + b[2] >= 5) {ret[-3] ++; ok=true;}
      if (a[1] + b[1] >= 5) {ret[-3] ++; ok=true;}
      if (a[2] + b[0] >= 5) {ret[-3] ++; ok=true;}
    }
    if (ok) {
      return ret;
    }
  }
  if (a[3] >= 5) {ret[2] ++;}
  if( b[3] >= 4) {ret[2] ++;}
  return ret;
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

  var nThree = 0, nFour = 0, nFive = 0, nLong = 0;
  for (var i = 0; i < direction.length; i+=2) {
    var tmp = countLine(x, y, direction[i], direction[i+1]);
    if (tmp[3]) nThree += tmp[3];
    if (tmp[4]) nFour += tmp[4];
    if (tmp[-4]) nFour += tmp[-4];
    if (tmp[5]) nFive += tmp[5];
    if (tmp[6]) nLong += tmp[6];
  }

  if (blackDifficult && chess == BLACK) {
    if (nFive) {
      return chess;
    }
    if (nLong || nThree >= 2 || nFour >= 2)
      return -chess;
  }
  else {
    if (nFive || nLong)
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
}

function unposit() {
  var y = histMove.pop();
  var x = histMove.pop();
  chessData[x][y] = NOPUT;
  nowColor = -nowColor;
}

function play(x, y) {
  if (winner) {
    alert("Game is over");
    return;
  }
  drawChess(x, y);
  posit(x, y);
  winner = isOver(x, y);
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
  undrawChess(x, y);
  unposit(x, y);
  winner = NOPUT;
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
