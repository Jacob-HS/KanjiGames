var currentQuestion="";
var poolSize;
var addedListener =false;
var askedPool =[];
var keys = Object.keys(masterList);
var intervalID;
answer.addEventListener("keypress", function(event){
  if(event.key=="Enter"){
    checkAnswer();
  }
})
function tickDown(){
  document.getElementById("timer").innerHTML=parseInt(document.getElementById("timer").innerHTML)-1;
  if (document.getElementById("timer").innerHTML =="0"){
    endGame(false);
  }
}
function addTime(){
  document.getElementById("timer").innerHTML=parseInt(document.getElementById("timer").innerHTML)+10;
}
function makeGoAway(diff){
  let diffh = document.getElementById("diffh");
  let container= document.getElementById("myContainer");
  diffh.classList.add("goAway");
  container.classList.add("goAway");
  poolSize=document.getElementById("diffChanger").value;
  document.getElementById("label").style.display="none";
  document.getElementById("diffChanger").style.display="none";
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
  document.getElementById("timer").innerHTML=10;
  console.log("start");
  intervalID = setInterval(tickDown,1000);
  pickQuestion();
  document.getElementById("answer").focus();
}
function pickQuestion(){
  do{
    candidate= keys[ poolSize * Math.random() << 0];
  } while (askedPool.includes(candidate));
  askedPool.push(candidate);
  document.getElementById("currRadical").innerHTML=candidate;
  currentQuestion=candidate;
} 


function checkAnswer(){
  var answerElement=document.getElementById("answer");
  var answer=answerElement.value;
  answerElement.value="";
  for(const kanji of answer){
    if (kanji == "ｓ" || kanji == "s"){
      pickQuestion();
      return;
    }
    if (masterList[currentQuestion].includes(kanji)){
      document.getElementById("score").innerHTML=1+parseInt(document.getElementById("score").innerHTML);
      if (document.getElementById("score").innerHTML=="10"){
        endGame(true);
        return;
      }
      pickQuestion();
      addTime();
      break;
    }
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


  generateSummaryAnswers();
 
}
function generateSummaryAnswers(){
  var row;
  var temp;
  var kanji;
  summaryAnswerContainer=document.getElementById("summaryAnswerContainer");
  for (let component of askedPool){
    console.log(askedPool);
    row=document.createElement("div");
    temp=document.createElement("p");
    kanji=document.createTextNode(component);
    temp.appendChild(kanji);
    temp.classList.add("summaryElement","active","summaryComponent");
    row.appendChild(temp);
    summaryAnswerContainer.appendChild(row);
    row.classList.add("summaryElement","active", "summaryAnswerRow");

      for(let i=0;i<10;i++){
        temp=document.createElement("p");
        kanji=document.createTextNode(masterList[component][i]);
        temp.appendChild(kanji);
        temp.classList.add("summaryElement","active","summaryAnswer");
        row.appendChild(temp);

      }



  }
}

function resetGame(){
  let summaryElements = document.getElementsByClassName("summaryElement");
  for (let element of summaryElements){
    element.classList.remove("active");
    element.classList.add("hidden");
  }
  askedPool=[];
  document.getElementById("score").innerHTML=0;
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