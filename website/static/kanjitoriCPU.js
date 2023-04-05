let currentQuestion="";
let answeredPool = [];
let addedListener=false;
let intervalID;
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
  diffh.classList.add("goAway");
  container.classList.add("goAway");
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
function startGame(){
  let gameplayElements = document.getElementsByClassName("gameplayElement");
  for (let element of gameplayElements){
    element.classList.remove("hidden");
    element.classList.add("active");
  }
  console.log("start");
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
  while(true){
    let a = Object.keys(masterList)[Math.floor(Math.random()*10)]
    let b = Math.floor(Math.random()*10);

    question=masterList[a][b];
    if (masterList[question.slice(-1)].length > 2){
      break;
    }
  }
  currentQuestion=question[question.length-1];
  console.log(currentQuestion);
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
    displayAnswer(answer, "player");
    currentQuestion=answer.slice(-1);
    shiftFocus("cpu");
    answeredPool.push(answer)
    makeThink();
    setTimeout(generateResponse, 2000);
  }
}

function makeThink(){
  let aSlot = document.getElementById("cpuA");
  aSlot.classList.add("pulsate-fwd");
  aSlot.innerHTML="考えてる"
}

function generateResponse(){
  let candidateList=[];
  let aSlot= document.getElementById("cpuA");
  aSlot.innerHTML="";
  aSlot.classList.remove("pulsate-fwd");
  for (word of masterList[currentQuestion]){
    if (!answeredPool.includes(word) && (masterList[word.slice(-1)]).length>0){
      candidateList.push(word);
    }
    if (candidateList.length > 2){
      break;
    }
  }
  if (candidateList.length == 0){
    endGame(true);
    return;
  }
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
  console.log("stop");
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
    result.innerHTML="Victory!";
  }else {
    result.innerHTML="Defeat."
  }
  let summaryElements = document.getElementsByClassName("summaryElement");
  for (let element of summaryElements){
    element.classList.remove("hidden");
    element.classList.add("active");
  }
}

function generateSummaryAnswers(){
  summaryAnswerContainer=document.getElementById("summaryAnswerContainer");
    row=document.createElement("div");
    temp=document.createElement("p");
    kanji=document.createTextNode(currentQuestion);
    temp.appendChild(kanji);
    temp.classList.add("summaryElement","active","summaryComponent", "answeredIncorrectly");
    row.appendChild(temp);
    summaryAnswerContainer.appendChild(row);
    row.classList.add("summaryElement","active", "summaryAnswerRow");

      for(let i=0;i<Math.min(masterList[currentQuestion].length,5);i++){
        temp=document.createElement("p");
        kanji=document.createTextNode(masterList[currentQuestion][i]);
        temp.appendChild(kanji);
        temp.classList.add("summaryElement","active","summaryAnswer");
        row.appendChild(temp);
      }
}
function resetGame(){
  let summaryElements = document.getElementsByClassName("summaryElement");
  for (let element of summaryElements){
    element.classList.remove("active");
    element.classList.add("hidden");
  }
  answeredPool=[];
  document.getElementById("score").innerHTML=0;
  document.getElementById("answer").value="";
  document.getElementById("timer").innerHTML="20";
}
function playAgain(){
  resetGame();
  startGame();
}
function changeDifficulty(){
  resetGame();
  let diffh = document.getElementById("diffh");
  let container= document.getElementById("myContainer");
  diffh.classList.remove("goAway","hidden");
  container.classList.remove("goAway","hidden");


}