function AIPlay () {
  if (blackDifficult) {
    return AIPlaybd();
  }
  else {
    return AIPlaynbd();
  }
}

//无禁手
function AIPlaynbd () {
  if (winner) {
    alert("Game is over!");
    return;
  }
  if (histMove.length == 0) {
    play(chessData[0].length/2, chessData.length/2);
    return;
  }
  if (histMove.length/2 == chessData.length*chessData[0].length) {
    alert("No place to go");
    return;
  }
  
  var score = 0;
  var goset = [];

  for (var x = 0; x < chessData[0].length; x++) {
    for (var y = 0; y < chessData.length; y++) {
      if (chessData[x][y] == NOPUT) {
        chessData[x][y] = nowColor;
        chessData[x][y] = -nowColor

        var s = getScore (x, y);
        if (s > score) {
          score = s;
          goset = [];
          goset[0] = x;
          goset[1] = y;
        }
        else if (s == score){
          goset.push(x);
          goset.push(y);
        }

        chessData[x][y] = NOPUT;
      }
    }
  }
  var r = Math.parseInt(Math.random()*goset.length/2);
  posit(goset[2*r], goset[2*r+1]);
}

function AIPlaybd () {
  return AIPlaynbd();
}
