function typewriter(str,target){
  this.str = this.indention(str);
  this.tgt = target;
  this.line = 0;
  this.endline = this.str.length-1
  this.continue = true
};
typewriter.prototype.typing = function(interval){
  var str = this.str[this.line]
  var tgt = this.tgt  //write内にthis.tgtって書くと「無いよ」って言われちゃう…
  var i=-1;
  var write = function(){
    tgt.innerHTML += str.charAt(i);
    var si = setTimeout(write,interval);
    if(i > str.length){
      clearInterval(si);
    };
    i++;
  };
  write();
};
typewriter.prototype.indention = function(str){
  return str.split("\n");
}
typewriter.prototype.nextline = function(){
  if(this.line < this.endline){
    this.line += 1
    this.tgt.innerHTML += "</br>"
  }else{
    this.continue = false
  }
}

window.onload = function(){ //DOMを読み込んだ後じゃないとgetElementByIdできない(当然だが)
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = checkReadyState; // 読み込み状態が変化した時呼ばれる
  xmlHttp.open("GET","https://mrabito.github.io/scenario.txt",true);  //true=非同期通信
  xmlHttp.send(null); //送信

  function checkReadyState(){
    if((xmlHttp.readyState == 4 && (xmlHttp.status == 200))){ //サーバーからのデータ受信が正常に完了
      var str = xmlHttp.responseText;
      var tgt = document.getElementById("typewriter");
      tw = new typewriter(str,tgt);
      tw.typing(30);
      if(tw.continue){
        tgt.onclick = function(){
          tw.nextline()
          tw.typing(30)
        }
      }
    }
  }
}
