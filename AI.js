function getScore_t (x, y, c) {
  var direction = Array(8);
  direction[0]=0;direction[1]=1;
  direction[2]=1;direction[3]=0;
  direction[4]=1;direction[5]=1;
  direction[6]=1;direction[7]=-1;

  chessData[x][y] = c;

  var nThree = 0, nFour = 0,  nFive = 0, nLong = 0;
  var nThreed = 0, nFourd = 0, nTwo = 0;
  for (var i = 0; i < direction.length; i+=2) {
    var tmp = countLine(x, y, direction[i], direction[i+1]);
    if (tmp[2]) nTwo += tmp[2];
    if (tmp[3]) nThree += tmp[3];
    if (tmp[-3]) nThreed += tmp[-3];
    if (tmp[4]) nFour += tmp[4];
    if (tmp[-4]) nFourd += tmp[-4];
    if (tmp[5]) nFive += tmp[5];
    if (tmp[6]) nLong += tmp[6];
  }

  chessData[x][y] = NOPUT;

  if (nFive) {
    return 100000;
  }
  if (blackDifficult && c == BLACK) {
    if (nLong || nThree >= 2 || nFour+nFourd >= 2)
      return -100000;
  }
  else {
    if (nFive || nLong)
      return 100000;
  }
  return nTwo*1 + nThreed*10 + nThree*100 + nFourd*500 + nFourd*1000;
}

function getScore(x, y) {
  return getScore_t(x, y, nowColor)*2 + getScore_t(x, y, -nowColor);
}

function sortMoves(a, b) {
  return b[2] - a[2];
}

function getMoveSet() {
  var moves = [];
  for (var x = 0; x < chessData[0].length; x++) {
    for (var y = 0; y < chessData.length; y++) {
      if (chessData[x][y] == NOPUT) {
        var scoretmp = getScore(x, y);
        if (scoretmp) {
          moves.push([x,y,scoretmp]);
        }
      }
    }
  }
  moves.sort(sortMoves);
  while (moves.length > 6) moves.pop();
  return moves;
}

function dfs (depth) {
  var moves = getMoveSet(), score = 0;
  if (moves.length == 0) {
    return -100000;
  }
  if (depth == 1) {
    return moves[0][2];
  }
  if (depth % 2 == 0) {
    score = 100000;
  }
  else {
    score = -100000;
  }
  for (var i = 0; i < moves.length; ++ i) {
    posit(moves[i][0], moves[i][1]);
    var scoret = dfs(depth+1);
    if (depth%2 == 0) {
      if (scoret < score) {
        score = scoret;
      }
    }
    else {
      if (scoret > score) {
        score = scoret;
      }
    }
    unposit();
  }
  return score;
}

function AIPlay () {
  if (winner) {
    alert("Game is over!");
    return;
  }
  if (histMove.length == 0) {
    play(parseInt(chessData[0].length/2), parseInt(chessData.length/2));
    return;
  }
  if (histMove.length/2 == chessData.length*chessData[0].length) {
    alert("No place to go");
    return;
  }

  var score = 0, x, y;
  var moves = getMoveSet();
  for (var i = 0; i < moves.length; ++ i) {
    posit(moves[i][0], moves[i][1]);
    var scoret = dfs(0);
    if (scoret > score) {
      score = scoret;
      x = moves[i][0];
      y = moves[i][1];
    }
    unposit();
  }
  play(x, y);
}
