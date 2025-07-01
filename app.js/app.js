let resetBtn= document.querySelector("#reset-btn");
let newGameBtn= document.querySelector("#new-btn");

let lastMove = null;
let undoUsed = false;
let undoBtn = document.querySelector("#undo-btn");

// Add these at top of app.js
let moveSound = new Audio("move.mp3");
let winSound = new Audio("win.mp3");
let drawSound = new Audio("draw.mp3");

function playSound(sound){
    if(!isMuted){
        sound.play();
    }
}

let muteBtn =document.querySelector("#mute-btn");
let isMuted=false;


let boxes= document.querySelectorAll(".box");

let msgContainer = document.querySelector(".msg-container");
let msg=document.querySelector("#msg");

let turnO= true; //playerX, playerO

let scoreX = 0;
let scoreO = 0;
let gameOver= false;

let timerDisplay = document.querySelector("#timer");
let timerInterval;
let timeLeft = 10;

let scoreXDisplay = document.querySelector("#scoreX");
let scoreODisplay = document.querySelector("#scoreO");

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8]
];

const resetGame = () =>{
     resetBoardOnly();  //Board Reset

     scoreX = 0;
scoreO = 0;
scoreXDisplay.innerText = scoreX;
scoreODisplay.innerText = scoreO;

};

const resetBoardOnly = () => {
    turnO = true;
    enableBoxes();
    msgContainer.classList.add("hide");
    gameOver=false;
    startTimer();  // Start new turn timer
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (box.innerText !== "") return; // extra safety

    let symbol = turnO ? "O" : "X";
    box.innerText = symbol;

    // 👇 Store last move
    lastMove = { index: Array.from(boxes).indexOf(box), symbol };
    undoUsed = false; // undo allow for new move

    turnO = !turnO;
    playSound(moveSound);
    box.disabled = true;

    clearInterval(timerInterval);

    if (!checkWinner()) {
      checkDraw();
      startTimer();
    }
  });
});

const disableBoxes =()=>{
    for(let box of boxes ){
        box.disabled=true;
        clearInterval(timerInterval); // Stop current timer
    }

};

const enableBoxes =()=>{
    for(let box of boxes ){
        box.disabled=false;
        box.innerText="";
        box.classList.remove("win");  //  remove animation
    }

};

clearInterval(timerInterval);
const showWinner= (winner)=>{
    playSound(winSound);
    msg.innerText=`Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();

    gameOver=true;

    if (winner === "X") {
  scoreX++;
  scoreXDisplay.innerText = scoreX;
} else {
  scoreO++;
  scoreODisplay.innerText = scoreO;
}
};
const checkWinner=() => {
    for(let pattern of winPatterns){
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if( pos1Val !="" && pos2Val !=="" && pos3Val !=""){
            if(pos1Val=== pos2Val && pos2Val === pos3Val){
            
                //For Animation
                boxes[pattern[0]].classList.add("win");
                boxes[pattern[1]].classList.add("win");
                boxes[pattern[2]].classList.add("win");
                showWinner(pos1Val);
                return true;
            }
        }
    }

    return false;
};


clearInterval(timerInterval);
const checkDraw = () => {

    
    let isDraw = true;

    boxes.forEach((box) => {
        if (box.innerText === "") {
            isDraw = false;  // Agar koi bhi box empty hai, toh draw nahi ho sakta
        }
    });

    if (isDraw) {
        playSound(drawSound);
        msg.innerText = "Match Draw !";
        msgContainer.classList.remove("hide");
        disableBoxes();

        gameOver=true;
    }
};

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 10;
    timerDisplay.innerText = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timerInterval);
            switchTurnDueToTimeout();
        }
    }, 1000);
}

function switchTurnDueToTimeout() {
    msg.innerText = `Time's up! ${turnO ? 'O' : 'X'} missed the turn!`;
    msgContainer.classList.remove("hide");
    turnO = !turnO;
    startTimer();
}

newGameBtn.addEventListener("click", resetBoardOnly);
resetBtn.addEventListener("click", resetGame);

undoBtn.addEventListener("click", () => {
    if (lastMove && !undoUsed && !gameOver) {
        let box = boxes[lastMove.index];
        if (box.innerText === lastMove.symbol) {
            box.innerText = "";
            box.disabled = false;
            turnO = lastMove.symbol === "O"; // previous turn restore
            lastMove = null;
            undoUsed = true;

            clearInterval(timerInterval);
            startTimer();
        }
    }
});


const themeToggleBtn = document.querySelector("#theme-toggle");

startTimer();

// Mute/unmute toggle
muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  muteBtn.innerText = isMuted ? "🔇 Mute" : "🔊 Sound";
});
