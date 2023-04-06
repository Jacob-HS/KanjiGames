let currentQuestion="";
let answeredPool = [];
let addedListener=false;
let intervalID;
let freqCap;
document.getElementById("answer").addEventListener("keydown", function(event){
  if(event.key=="Enter"){
    checkAnswer();
    console.log("hello");
  }
  if(event.key=="Escape"){
    //skip();
  }
});
function makeGoAway(diff){
  let diffh = document.getElementById("diffh");
  let container= document.getElementById("myContainer");
  let homeButtons=document.getElementsByClassName("homeButton");
  homeButtons[0].classList.remove("active");
  homeButtons[0].classList.add("hidden");
  diffh.classList.add("goAway");
  container.classList.add("goAway");
  setDiff(diff);
  if (!addedListener){
    addedListener=true;
    diffh.addEventListener("transitionend", () =>
    {
      diffh.classList.add("hidden");
      container.classList.add("hidden");
      startGame();
    })
  }
}

function setDiff(diff){
  if (diff == 1){
    freqCap=10000;
    maxCandidates=30;
  }
  if (diff == 2){
    freqCap=20000
    maxCandidates=60;
  }
  if (diff == 3){
    freqCap=30000
    maxCandidates=100;
  }
}
function startGame(){
  let gameplayElements = document.getElementsByClassName("gameplayElement");
  for (let element of gameplayElements){
    element.classList.remove("hidden");
    element.classList.add("active");
  }
  shiftFocus("cpu");
  generateFirstQuestion();
  document.getElementById("answer").focus();
}

function tickDown(){
  document.getElementById("timer").innerHTML=parseInt(document.getElementById("timer").innerHTML)-1;
  if (document.getElementById("timer").innerHTML =="0"){
    endGame(false);
  }
}
function generateFirstQuestion(){
  let question;
  let searching=true;
  while(searching){
    let a = Object.keys(masterList)[Math.floor(Math.random()*100)];
    for (word of masterList[a]){
      lastKanji = word.slice(-1);
      if (!(lastKanji in masterList)){
        continue;
      }
      for (let temp of masterList[lastKanji]){
        if (!(temp in jukugoFreq)){
          continue;
        }
        if (parseInt(jukugoFreq[temp])<freqCap){
          question=word;
          searching=false;
          break;
        }
      }
      if (question){
        break;
      }
    }
  }
  currentQuestion=question[question.length-1];
  answeredPool.push(question);
  displayAnswer(question, "cpu");
  shiftFocus("player");
}

function displayAnswer(word, answerer){
  let aSlot;
  let bSlot;
  if (answerer == "cpu"){
    aSlot=document.getElementById("cpuA");
    bSlot=document.getElementById("cpuB");
  } else {
    aSlot=document.getElementById("playerA");
    bSlot=document.getElementById("playerB");
  }
  aSlot.innerHTML=word.slice(0,-1);
  bSlot.innerHTML=word.slice(-1);
}

function checkAnswer(){
  if (!document.getElementById("playerSide").classList.contains("currentTurn")){
    return;
  }
  answerField=document.getElementById("answer");
  answer=answerField.value;
  answerField.value="";

  if(answeredPool.includes(answer)){
    return;
  }
  if(masterList[currentQuestion].includes(answer)){
    document.getElementById("score").innerHTML=1+parseInt(document.getElementById("score").innerHTML);
    updateColor();
    displayAnswer(answer, "player");
    currentQuestion=answer.slice(-1);
    shiftFocus("cpu");
    answeredPool.push(answer)
    makeThink();
    setTimeout(generateResponse, 2000);
  }
}
function updateColor(){
  scoreElement=document.getElementById("score");
  scoreNumber=parseInt(scoreElement.innerHTML);
  if(scoreNumber==10){
    scoreElement.classList.add("level1");
  }
  if(scoreNumber==25){
    scoreElement.classList.add("level2");
  }
  if(scoreNumber==50){
    scoreElement.classList.add("level3");
  }
  if(scoreNumber==75){
    scoreElement.classList.add("level4");
  }
  if(scoreNumber==100){
    scoreElement.classList.add("level5");
  }
}
function makeThink(){
  let aSlot = document.getElementById("cpuA");
  aSlot.classList.add("pulsate-fwd");
  aSlot.innerHTML="考えてる"
}

function generateResponse(){
  let candidateList=[];
  let lastKanji;
  let aSlot= document.getElementById("cpuA");
  aSlot.innerHTML="";
  aSlot.classList.remove("pulsate-fwd");
  for (word of masterList[currentQuestion]){
    lastKanji = word.slice(-1);
    if (answeredPool.includes(word)){
      continue;
    }
    if (!(lastKanji in masterList)){
      continue;
    }
    for (let temp of masterList[lastKanji]){
      if (!(temp in jukugoFreq)){
        continue;
      }
      if (answeredPool.includes(temp)){
        continue;
      }
      if (parseInt(jukugoFreq[temp])<freqCap){
        candidateList.push(word);
        break;
      }
    }
    if (candidateList.length > maxCandidates){
      break;
    }
  }
  if (candidateList.length == 0){
    endGame(true);
    return;
  }
  console.log(candidateList);
  let finalAnswer = candidateList[Math.floor(Math.random()*candidateList.length)]
  currentQuestion=finalAnswer.slice(-1);
  shiftFocus("player");
  displayAnswer(finalAnswer,"cpu");
  answeredPool.push(finalAnswer);
}

function clearAnswer(target){
  if (target == "cpu"){
    document.getElementById("cpuA").innerHTML="";
    document.getElementById("cpuB").innerHTML="";
  }else{
    document.getElementById("playerA").innerHTML="";
    document.getElementById("playerB").innerHTML="";
  }
}

function shiftFocus(target){
  if (target=="cpu"){
    document.getElementById("computerSide").classList.add("currentTurn");
    document.getElementById("playerSide").classList.remove("currentTurn");
    clearInterval(intervalID);
    document.getElementById("timer").innerHTML="20";
    clearAnswer("cpu");

  } else {
    document.getElementById("computerSide").classList.remove("currentTurn");
    document.getElementById("playerSide").classList.add("currentTurn");
    clearAnswer("player");
    intervalID=setInterval(tickDown,1000);
  }
}

function endGame(win){
  clearInterval(intervalID);
  let gameplayElements = document.getElementsByClassName("gameplayElement");
  for (let element of gameplayElements){
    element.classList.remove("active");
    element.classList.add("hidden");
  }
  displaySummary(win);
  if(!win){
    generateSummaryAnswers();
  }
}

function displaySummary(win){
  result=document.getElementById("result");
  if (win){
    result.innerHTML="No remaining words<br>"+document.getElementById("score").innerHTML+"pts";
  }else {
    result.innerHTML="Defeat<br>"+document.getElementById("score").innerHTML+"pts";
  }
  let summaryElements = document.getElementsByClassName("summaryElement");
  for (let element of summaryElements){
    element.classList.remove("hidden");
    element.classList.add("active");
  }
}

function generateSummaryAnswers(){
  let summaryAnswerContainer=document.getElementById("summaryAnswerContainer");
  let row=document.createElement("div");
  let temp=document.createElement("a");
  let kanji=document.createTextNode(document.getElementById("cpuA").innerHTML+document.getElementById("cpuB").innerHTML);
  temp.appendChild(kanji);
  linkify(temp);
  temp.classList.add("summaryElement","active","summaryComponent", "answeredIncorrectly");
  row.appendChild(temp);
  summaryAnswerContainer.appendChild(row);
  row.classList.add("summaryElement","active", "summaryAnswerRow");
  for(let i=0;i<Math.min(masterList[currentQuestion].length,5);i++){
    temp=document.createElement("a");
    kanji=document.createTextNode(masterList[currentQuestion][i]);
    temp.appendChild(kanji);
    linkify(temp);
    temp.classList.add("summaryElement","active","summaryAnswer");
    row.appendChild(temp);
  }
}

function linkify(node){
  node.href="https://www.weblio.jp/content/"+node.innerHTML;
  node.target="_blank";
}

function resetGame(){
  let summaryElements = document.getElementsByClassName("summaryElement");
  for (let element of summaryElements){
    element.classList.remove("active");
    element.classList.add("hidden");
  }
  answeredPool=[];
  document.getElementById("score").className="";
  document.getElementById("score").innerHTML=0;
  document.getElementById("answer").value="";
  document.getElementById("timer").innerHTML="20";
  document.getElementById("summaryAnswerContainer").innerHTML="";
}
function playAgain(){
  resetGame();
  startGame();
}
function changeDifficulty(){
  resetGame();
  let diffh = document.getElementById("diffh");
  let container= document.getElementById("myContainer");
  let homeButtons=document.getElementsByClassName("homeButton");
  homeButtons[0].classList.remove("hidden");
  diffh.classList.remove("goAway","hidden");
  container.classList.remove("goAway","hidden");


}