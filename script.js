const gameSettings=document.querySelector('#game-settings');
let activeGuess = document.querySelectorAll(".active .guess");
let mastersMind = []
let activeColors = [];
let round = 0;
let maxRound = 0

//set up array with colors
let colors = ['red', 'green', 'blue', 'yellow', 'orange', 'salmon', 'purple', 'brown', 'grey', 'white', 'black', 'maroon', 'teal', 'plum'];

//give colorsselect the option between 6 and the max number of colors
for (let i = 6; i<= colors.length; i++) {
    const colorSelect = document.querySelector("#color-select");
    const nextOption = document.createElement("option", "value=i");
    nextOption.textContent=`${i}`;
    colorSelect.appendChild(nextOption);
};


function makeGameSettings() {
    const gameDiv = document.querySelector("#core");
    gameDiv.appendChild(gameSettings);
}

//functions for starting the game
function removeGameSettings() {
    gameSettings.remove();
};

function makeActiveColors(input) {
    let selectedColors = []
    for (i = 0; i<input; i++) {
        selectedColors.push(colors[i])
    }
    return selectedColors
};

function makeDifficulty(input) {
    let options = activeColors.length
    if (input === 'easy') {
        maxRound = ((options - 1)*(options - 3) + 6);
    } else if (input == `medium`) {
        maxRound = ((options - 3) * (options - 3) + 6);
    } else {
        maxRound = ((options - 5) * (options - 5) + 6);
    };
};

function makeMastersMind() {
    mastersMind = [];
    for (let i = 0; i < 4; i++) {
        let index = Math.floor(Math.random() * activeColors.length);
        mastersMind.push(activeColors[index]);
       
    }; 
};

function makeGameDiv() {
    const gameDiv= document.createElement('div');
    gameDiv.setAttribute("id", "game-div")
    //gameDiv.setAttribute("height", '75px');
    //gameDiv.setAttribute("width", '200px');
    document.querySelector("#core").appendChild(gameDiv);
};

function makeRoundDiv() {
    let roundDiv = document.createElement('div');
    let currentRound = "round"+round;
    roundDiv.setAttribute("id", currentRound);
    roundDiv.setAttribute('class', 'round-div');
    document.querySelector('#game-div').appendChild(roundDiv);
};

function makeGuessDivs() {
    let currentRoundId = "#round" + round
    let currentRound = document.querySelector(currentRoundId)
    for (let i=0; i<4; i++) {
        let guessDiv = document.createElement('div');
        let currentGuess = "round"+round+"guess"+i
        guessDiv.setAttribute('id', currentGuess);
        guessDiv.setAttribute('class', "guess active");
        guessDiv.setAttribute('style', 'background-color:'+activeColors[0]);
        currentRound.appendChild(guessDiv);
    };
    let resultsDiv = document.createElement("div");
    let resultId = "round" + round + "-results"
    resultsDiv.setAttribute("id", resultId);
    resultsDiv.setAttribute("class", "results-div");
    currentRound.appendChild(resultsDiv);
};

function makeSubmitRestart(){
    const submit = document.createElement('button');
    submit.setAttribute("id", "submit-guess");
    const giveup = document.createElement('button');
    giveup.setAttribute("id", "giveup");
    submit.textContent = "Submit Guess";
    giveup.textContent = "Give Up";
    document.querySelector("#core").appendChild(submit);
    document.querySelector("#core").appendChild(giveup);
    submitGuess();
    setGiveUpListener();
}

function removeSubmitRestart(){
    document.querySelector("#submit-guess").remove();
    document.querySelector("#giveup").remove();
};


function makePlayAgainNewGame(){
    let playAgain = document.createElement("button");
    playAgain.setAttribute("id", "play-again");
    playAgain.textContent = "Play Again"
    let newGame = document.createElement("button");
    newGame.setAttribute("id", "new-game");
    newGame.innerText = "New Game"
    document.querySelector("#core").appendChild(playAgain);
    document.querySelector('#core').appendChild(newGame);
}

function setPlayAgainNewGameListeners() {
    document.querySelector("#play-again").addEventListener("click", (e)=> {
            document.querySelector("#game-div").remove();
            removePlayAgainNewGame();
            gameStart();
        })
    document.querySelector("#new-game").addEventListener("click", (e)=>{
            document.querySelector("#game-div").remove();
            removePlayAgainNewGame();
            makeGameSettings();
        })
    }



function removePlayAgainNewGame(){
    document.querySelector("#new-game").remove();
    document.querySelector('#play-again').remove();
}


function changeGuessColor(element) {
    let currentColor = element.style.backgroundColor
    let currentIndex = activeColors.indexOf(currentColor);
    if (element.getAttribute("class").includes("active"))
        if (currentIndex < (activeColors.length-1)) {
            let nextColor =  "background-color:"+activeColors[currentIndex+1]
            element.removeAttribute("style")
            element.setAttribute("style", nextColor);
        } else {
            let nextColor = "background-color:" + activeColors[0];
            element.removeAttribute("style")
            element.setAttribute("style", nextColor);
        }
    }

function changeGuessColorReverse(element) {
    let currentColor = element.style.backgroundColor
    let currentIndex = activeColors.indexOf(currentColor);
    if (element.getAttribute("class").includes("active"))
        if (currentIndex == 0) {
            let nextColor = "background-color:" + activeColors[(activeColors.length -1)];
            element.removeAttribute("style")
            element.setAttribute("style", nextColor);
        } else {
            let nextColor =  "background-color:"+activeColors[currentIndex-1]
            element.removeAttribute("style")
            element.setAttribute("style", nextColor);
        }
    }

function setActiveGuess() {
    activeGuess = document.querySelectorAll(".active")
    activeGuess.forEach((element)=> element.addEventListener("click", (e)=>{changeGuessColor(element)}))
    activeGuess.forEach((element)=> element.addEventListener("contextmenu", (e)=>{
        e.preventDefault();
        changeGuessColorReverse(element);
    }) )
}



 function makeGuessResults(){
   let currentGuess = [];
   let tempMind = [...mastersMind];
   for (let i = 0; i <=3; i++) {
    let currentRoundSelect = "#round" + round + "guess"+i;
    let guessOfI = document.querySelector(currentRoundSelect);
    currentGuess.push(guessOfI.style.backgroundColor);
   };
//check for right color right place
    for (let i = 0; i <=3; i++) {
        if (currentGuess[i] === tempMind[i]) {
            currentGuess[i] = "correct";
            tempMind[i] = "compared";
            let iDiv = document.querySelector(`#round${round}guess${i}`);
            iDiv.setAttribute("class", "compared guess");
        };
};

if ((!currentGuess.every((result) => result == 'correct')) 
&& (round < maxRound)){ 
//decide if right color right place
    for (let i = 0; i <=3; i++) {
        if (currentGuess[i]!="correct" && tempMind.includes(currentGuess[i])){
            tempMind[tempMind.indexOf(currentGuess[i])] = "compared";
            currentGuess[i] = "present";
            let iDiv = document.querySelector(`#round${round}guess${i}`);
            iDiv.setAttribute("class", "compared guess");
        } else if (currentGuess[i] !="correct"){
            currentGuess[i] = "wrong";
            let iDiv = document.querySelector(`#round${round}guess${i}`);
            iDiv.setAttribute("class", "compared guess");
        };
    };

    //display results as new div next to guess


    currentGuess.sort().map((x)=>{
    let clue = document.createElement("div");
    clue.setAttribute("class"," result" );
    if (x=== "correct") {
    clue.setAttribute("style", "background-color: green;");
    } else if (x === "present") {        
    clue.setAttribute("style", "background-color: yellow;");
    } else if (x === "wrong") {
    clue.setAttribute("style", "background-color: red;")

    }
    document.querySelector(`#round${round}-results`).appendChild(clue);

    })

    round++
    makeRoundDiv();
    makeGuessDivs();

    } else if (currentGuess.every((result)=> result = "correct") ){
    youWin()
    } else if (round >= maxRound) {
    youLose();
   };
   setActiveGuess();
};

function submitGuess(){
    document.querySelector("#submit-guess").addEventListener("click", (e)=>{makeGuessResults()});
};

function setGiveUpListener(){
    document.querySelector("#giveup").addEventListener("click", (e)=>{
        youLose();
    })
}

function revealMastersMind() {
    let master = document.createElement("div");
    master.setAttribute("class", "round-div master");
    for (let i = 0; i < 4; i++){
        let mind = document.createElement("div");
        mind.setAttribute("class", "guess")
        let mindsI = "background-color: " + mastersMind[i];
        mind.setAttribute("style", mindsI);
        master.appendChild(mind);
    };
    document.querySelector('#game-div').appendChild(master);
};


function newGame(){
    let colorNumber = Number(document.querySelector('#color-select').value);
    activeColors = makeActiveColors(colorNumber);
    let difficultyValue = document.querySelector('#difficulty-select').value;
    makeDifficulty(difficultyValue);
}

function gameStart() {
    makeMastersMind();
    removeGameSettings();
    makeGameDiv();
    round = 1;
    makeRoundDiv();
    makeGuessDivs();
    makeSubmitRestart();
    setActiveGuess();
}


const gameStartButton = document.querySelector("#game-settings");
gameStartButton.addEventListener("submit", (e)=>{
    newGame();
    gameStart();
});


function youWin() {
    let winner = document.createElement('h2');
    winner.innerText = "Congratulations, You took down the MasterMind";
    document.querySelector('#game-div').appendChild(winner);
    removeSubmitRestart();
    makePlayAgainNewGame();
    setPlayAgainNewGameListeners();
}

function youLose() {
    let loser = document.createElement('h2');
    loser.innerText = "You Lose, the Master had in mind";
    document.querySelector('#game-div').appendChild(loser);
    revealMastersMind();
    removeSubmitRestart();
    makePlayAgainNewGame();
    setPlayAgainNewGameListeners();
}


/* 
from the start:
    colors array
    color select modifier
    dificulty settings
    submit settings

on start 
    remove settings
    set active colors
    set number of rounds
    set master's mind
    add game
    add round
    add guess
    add guess listener
    add submit guess
    add giveup

on submit guess
        create an array of guess colors
        compare master's mind
            set guesses to no longer active
        if
            win
                reveal master's mind
                set win message
            lose
                reveal master's mind
                set lose message
            still have a chance
                create accuracy report
                create next round
                create next guesses
                increase round number
                */
                