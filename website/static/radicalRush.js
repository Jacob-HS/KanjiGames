let difficulty=0;
let pbois = document.getElementById("myContainer").children;
const masterSheet = JSON.parse("{{ componentsToKanji }}");
alert(masterSheet)
for (let i = 0; i<pbois.length;i++){
  pbois[i].style.animationDelay=i*.15+"s";
}
function makeGoAway(diff){
  let diffh = document.getElementById("diffh");
  let container= document.getElementById("myContainer");
  diffh.classList.add("goAway");
  container.classList.add("goAway");

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
    element.className="gameplayElement active";
  }

}