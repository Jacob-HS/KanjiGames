let pbois = document.getElementById("myContainer").children
    for (let i = 0; i<pbois.length;i++){
      pbois[i].style.animationDelay=i*.15+"s";
    }