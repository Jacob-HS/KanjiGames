var currentQuestion="";
var poolSize;
var askedPool = new Set();
var answer=document.getElementById("answer");
var keys = Object.keys(masterList);
answer.addEventListener("keypress", function(event){
  if(event.key=="Enter"){
    checkAnswer();
    console.log("hello")
  }
})
function tickDown(){
  document.getElementById("timer").innerHTML=parseInt(document.getElementById("timer").innerHTML)-1;
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
  document.getElementById("label").classList.add("goAway");
  document.getElementById("diffChanger").classList.add("goAway");
  diffh.addEventListener("transitionend", () =>
  {
    diffh.remove();
    container.remove();
    startGame(diff);
  })
}
function startGame(diff){
  let gameplayElements = document.getElementsByClassName("gameplayElement");
  for (let element of gameplayElements){
    element.classList.remove("hidden");
    element.classList.add("active");
  }
  document.getElementById("timer").innerHTML=10;
  setInterval(tickDown,1000);
  pickQuestion();
  document.getElementById("answer").focus();
}
function pickQuestion(){
  do{
    candidate= keys[ poolSize * Math.random() << 0];
  } while (askedPool.has(candidate));
  askedPool.add(candidate);
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
      break;
    }
    if (masterList[currentQuestion].includes(kanji)){
      document.getElementById("score").innerHTML=1+parseInt(document.getElementById("score").innerHTML);
      pickQuestion();
      addTime();
      break;
    }
  }
}