//javascript for minesweeper

const colors  = ["RGB(70,0,255)","RGB(0,131,7)","RGB(255,0,0)","RGB(29,0,127)","RGB(136,0,0)","RGB(0,132,131)","RGB(0,0,0)","RGB(128,128,128)"]
const tileColor = "rgb(187,189,189)"
const emptyTileColor = "rgb(150,150,150)"
let height = 20
let width = 30

if (window.matchMedia('(max-width: 1200px)').matches) {
    height = 25
    width = 22
}
const board = []
let numberOfBombs = undefined;
let firstClick = true;
let gameInProgress = false
let placeFlags = false
let difficulty
let difficultyColors
let selectedDifficulty
let undiscovered
let solver = null
let tilesToClick = null
let clickIndex = 0
let randomClick = false
let randomProb = 0
var bombsLeft
var clickFlagsButton
var solverLoader
var fullScreenButton
var closeBtn
var activeButton
let body
let div



function fullScreen(event){
    var modal = document.getElementById('modal');
    modal.style.display = 'flex';
    var modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = ""
    modalContent.appendChild(div)
    fullScreenButton.hidden = true
    closeBtn.hidden = false
}

function toggleFlags(event){
    if(solver){
        return
    }
    placeFlags = !placeFlags
    if(placeFlags){
        event.target.style.backgroundImage = "URL('Images/flagSelected.png')"
        // event.target.style.border = "2px solid RGB(255,0,0)"
        
        
    }else{
        event.target.style.backgroundImage = "URL('Images/flag.jpeg')"
    }
}

function closeButton(event){
    closeBtn.hidden = true
    fullScreenButton.hidden = false
    body.appendChild(div)
}


function createMenuButton(id, className, value, linkedFunction){
    var button = document.createElement("button");
    var text = document.createTextNode(id);

    button.appendChild(text)
    button.className = className
    button.style.height = boxWidth + "px";
    button.style.minHeight = boxWidth + "px ";
    button.style.backgroundImage = "none"
    button.id = id
    button.value = value
    button.addEventListener("click",linkedFunction);
    
    return button
}


function createBoard(){
    body = document.getElementById("minesweeperHolder");
    div = document.createElement("div");
    div.id = "mineSweeperContainer";
    body.innerHTML = '';
    body.appendChild(div);

    var easyButton = createMenuButton("Easy", "difficulty", 20, makebombs)
    var mediumButton = createMenuButton("Medium", "difficulty", 50, makebombs)
    var hardButton = createMenuButton("Hard", "difficulty", 80, makebombs)
    var expertButton = createMenuButton("Expert", "difficulty", 120, makebombs)
    var solveButton = createMenuButton("Solve ", "solver", "solve", startSolver)
    clickFlagsButton = createMenuButton("","toggleFlag", 0, toggleFlags)
    clickFlagsButton.style.backgroundSize = boxWidth+ "px " + boxWidth + "px"
    clickFlagsButton.style.backgroundImage = "URL('Images/flag.jpeg')"
    clickFlagsButton.style.width = boxWidth + "px ";
    clickFlagsButton.style.minWidth = boxWidth + "px ";

    fullScreenButton = createMenuButton("","fullScreenButton", 0, fullScreen)
    fullScreenButton.style.backgroundImage = "URL('Images/expand.png')"
    fullScreenButton.style.width = boxWidth + "px ";
    fullScreenButton.style.minWidth = boxWidth + "px ";


    closeBtn = createMenuButton("X","fullScreenButton close", 0, closeButton)
    closeBtn.style.width = boxWidth + "px ";
    closeBtn.style.minWidth = boxWidth + "px ";

    // <button class="fullscreen-button">
  
    closeBtn.hidden = true


    
    solveButton.style.lineHeight = boxWidth + "px"

    solverLoader =  document.createElement("div");
    solverLoader.style.height = boxWidth/3 + "px ";
    solverLoader.style.lineHeight = boxWidth/3 + "px ";
    solverLoader.style.width = boxWidth/3 + "px ";
    
    solverLoader.className = "loader"
    solveButton.appendChild(solverLoader);
    solverLoader.style.visibility = "hidden";
    
    var rightDiv =  document.createElement("div");
    rightDiv.className = "right "

    var centerDiv =  document.createElement("div");
    centerDiv.className = "center "

    bombsLeft = document.createElement("div");
    bombsLeft.disabled = true;
    bombsLeft.className = "mineCounter"
    bombsLeft.style.height = boxWidth + "px ";
    
    
    difficulty = {
       "Easy": easyButton,
       "Medium":mediumButton,
       "Hard":hardButton,
       "Expert": expertButton
    };

    difficultyColors = {
        "Easy": colors[0],
        "Medium":colors[1],
        "Hard":colors[2],
        "Expert": colors[5]
     };

    

    var table =  document.createElement("table");
    table.setAttribute("class","mineSweeperTable");
    div.appendChild(table)

    

    var headerRow = table.insertRow();
    var menu = [easyButton,mediumButton,hardButton,expertButton, bombsLeft, solveButton]
    
    var start = Math.floor((Math.floor(width/3) - 4) / 2)
    console.log(start)
    var j = 0
    for (j; j < width;) {
        var cell = headerRow.insertCell();
        cell.colSpan = 3; // span all x columns
        // cell.innerText = "Column " + (j + 1);
        if(j >= start * 3 && (j/3 - start) < menu.length){
            cell.appendChild(menu[j/3 - start])
        }
        cell.classList.add("mineSweeperCell");
        j += 3
        if(j >= width){
            cell.appendChild(closeBtn)
            cell.appendChild(fullScreenButton)
            cell.appendChild(clickFlagsButton)
        }
    }
    
    selectedDifficulty = easyButton.id

    for(let i = 0; i < height; i++){
        board[i] = [];
        var row = table.insertRow();  
        for(let j = 0; j < width; j++){
            var cell = row.insertCell();
            var btn = document.createElement("button");
            cell.setAttribute("class", "mineSweeperCell")
            btn.setAttribute("class","mineSweeperButton");
            
            board[i][j] = {
                type: "empty",
                x: (i * boxWidth),
                y: (j * boxWidth),
                flagged: false,
                bombsTouching: null,
                button: btn,
                lastClicked: false,
                knownEmpty: false,
                
            };
            
            cell.style.height = boxWidth + "px ";
            cell.style.width = boxWidth + "px ";
            btn.style.height = boxWidth + "px ";
            btn.style.width = boxWidth + "px ";
            btn.style.minHeight = boxWidth + "px ";
            btn.style.minWidth = boxWidth + "px ";
            
            cell.appendChild(btn);
            btn.id = j;
            btn.value =i;
            btn.addEventListener("click",clicked, MouseEvent);
            btn.addEventListener("contextmenu",clicked, MouseEvent);
            
        }
    }

    makebombs()
}  



function makebombs(event){

    let bombNumber;
    firstClick = true
    gameInProgress = true

    
    if(event == undefined){
        if(numberOfBombs == undefined){
            bombNumber = 20;
            difficulty["Easy"].style.textDecoration = "underline " 
            difficulty["Easy"].style.textDecorationColor = colors[0]
        }else{
            bombNumber = numberOfBombs;
        }
    }else{
        bombNumber = parseInt(event.target.value);
        selectedDifficulty = event.target.id
        for (var key in difficulty) {
            difficulty[key].style.textDecoration = "underline"
            difficulty[key].style.textDecorationColor = "rgb(189, 189,189)"
        }
    }
    difficulty[selectedDifficulty].style.textDecoration = "underline "
    difficulty[selectedDifficulty].style.textDecorationColor = difficultyColors[selectedDifficulty]

    numberOfBombs = bombNumber;
    undiscovered = bombNumber;
    bombsLeft.innerHTML = undiscovered
    
    resetMineSweeper();
    drawMinesweeper();
}

function drawMinesweeper(){
   
    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){

            let button = board[i][j].button;

            if(board[i][j].flagged == true){
                button.style.backgroundImage = "none"
                button.style.backgroundSize = boxWidth+ "px " + boxWidth + "px"
                button.style.backgroundImage = "URL('Images/flag.jpeg')"
            }

            if(board[i][j].type == "cleared"){
                button.style.background = emptyTileColor
                // button.disabled = true;
            }

            let bombCount = board[i][j].bombsTouching;
            let color
            if(bombCount == 0){
                board[i][j].bombsTouching = 0;
            }else{
                color = colors[bombCount-1];
            }
            
            if(isTouchingBomb(i,j)){
                button.style.color = color
                button.style.backgroundColor = tileColor
                button.innerHTML = bombCount;
            }

            if(board[i][j].lastClicked){
                board[i][j].lastClicked = false
            }
        };
    }
    if(gameInProgress){
        checkWin();
    }
}


function resetMineSweeper(){

    if(placeFlags){
        clickFlagsButton.click()
    }
    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            let button = board[i][j].button;
            board[i][j].type = "empty";
            button.style.backgroundImage = "none";
            button.innerHTML= "";
            button.style.border = "none";
            button.style.backgroundColor = tileColor
            button.disabled = false;
            bombCount = undefined;
            board[i][j].flagged = false;
            board[i][j].bombsTouching = null;
            board[i][j].knownEmpty = false
        }
    }
}

function clearSolver(){
    clearInterval(solver)
    solver = null
    solverLoader.style.visibility = "hidden";
}


function alertWithMessage(message, type){
    alertModal.style.display = 'flex';
    alertMessage.innerHTML = message

    alertMessage.classList.remove('alert-pass')
    alertMessage.classList.remove('alert-error')
    
    if(type != undefined){
        if(type){
            alertMessage.classList.add('alert-pass')
            return
        }
        alertMessage.classList.add('alert-error')
    }
}

function checkWin(){

    let count = 0;
    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            if(board[i][j].flagged && board[i][j].type == "bomb"){
                count++;
            }
       
        }
    }
    if(count == numberOfBombs){
        gameInProgress = false
        clearSolver()
        alertWithMessage("Congratulations: You win", true);
        showBombs();
        return;
    }

    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            if(board[i][j].type != "bomb" && board[i][j].type != "cleared"){
                return;
            }
        }
    }
    gameInProgress = false
    clearSolver()
    alertWithMessage("Congratulations: You win", true);
    showBombs();

}

function loose(){
    clearSolver()
    let message 
    if(randomClick){
        message = "Oops, the AI hit a mine! Based on the current tiles available, the AI had a " + (randomProb * 100).toFixed(2) + "% chance of hitting bomb."
    }else{
        message = "Oops, you hit a mine! Better luck next time."  
    }
    alertWithMessage(message, false)
    randomClick = false
    showBombs();
    gameInProgress = false
    
}

function showBombs(){
    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            board[i][j].button.style.backgroundImage = "none";
            board[i][j].flagged = false;
            
            if(board[i][j].type == "bomb" && !board[i][j].flagged){
                let button = board[i][j].button;
                button.style.backgroundImage = "URL('Images/bomb.png')"
                button.style.backgroundSize = boxWidth+ "px " + boxWidth + "px"
            }
        }
    }
}

function flagButton(i,j){

    if(board[i][j].type == "cleared"){
        return
    }

    if(board[i][j].flagged){
        undiscovered++
        board[i][j].flagged = false;
        board[i][j].button.style.backgroundImage = "";
    } else{
        board[i][j].flagged = true;
        undiscovered--;
    }
    bombsLeft.innerHTML = undiscovered
    drawMinesweeper()
}

function select(i,j){
    
    if(board[i][j].type == "empty"){
        board[i][j].type = "cleared";
        board[i][j].bombsTouching = checkBeside(i,j);      
    }else if(board[i][j].type == "bomb"){
        board[i][j].button.style.border = "2px solid RGB(255,0,0)";
        loose();
    }
}

function clicked(MouseEvent){

    MouseEvent.preventDefault()

    let x;
    let y;
    if(MouseEvent.target.tagName == "DIV"){
        let button = MouseEvent.target.parentElement;
        y = parseInt(button.id);
        x = parseInt(button.value);
        var newtext = document.createTextNode("");
        button.replaceChild(newtext,event.target);
    }else{
     y = parseInt(MouseEvent.target.id);
     x = parseInt(MouseEvent.target.value);
    }
    if(MouseEvent.button == 2 || placeFlags){
        if(gameInProgress && !firstClick){
            flagButton(x,y);
        }
    }else{
        
        if(gameInProgress || firstClick){
            if(firstClick){
                board[x][y].type = "cleared";
                first(x,y);
                board[x][y].bombsTouching = select(x,y);
                firstClick = false;

            }else{
                board[x][y].lastClicked = true
                board[x][y].flagged = false;
                select(x,y);
            }
        }
       
    }
    drawMinesweeper();
}

function clear(i,j){
    board[i][j].type = "cleared";
    return true
}

function clearAndClick(i,j){
    board[i][j].type = "empty"
    select(i,j)
    return true   
}

function first(a,b){

    makebombs(undefined);
    actOnNeighbours(0, a, b, 0, clear, false)

    for(let i = 0; i < numberOfBombs; i++){
        let rowNumber = Math.floor((Math.random() * height));
        let collomNumber = Math.floor((Math.random() * width));
        if(board[rowNumber][collomNumber].type == "bomb" || board[rowNumber][collomNumber].type == "cleared"){
            i--;  
        }else{
            board[rowNumber][collomNumber].type = "bomb";
        }
    }

    clearAndClick(a,b)
    actOnNeighbours(0, a, b, 0, clearAndClick, false)
    drawMinesweeper();
    bombsLeft.innerHTML = undiscovered
}


function checkBeside(i,j){   
    let count = 0;
    for(let x = -1; x < 2; x++){
        for(let y = -1; y < 2; y++){
            if(x != 0 || y != 0 ){
                let xValue = i+x;
                let yValue = j+y;
                if(xValue >= 0 && xValue < height && yValue >= 0 && yValue < width){
                    if(board[xValue][yValue].type == "bomb" ){
                     count++;   
                    }
                }
            }
        }
    }
    if(count == 0){
        actOnNeighbours(0, i, j, 0, select, false)
    }
   
    return count;
}


function actOnNeighbours(radius, i,j,bombsRemaining, action, returnOnFirst){

    actionTaken = false

    for(let x = -1 - radius; x < 2 + radius; x++){
        for(let y = -1 - radius ; y < 2 + radius; y++){
            if(x != 0 || y != 0 ){
                let xValue = i+x;
                let yValue = j+y;
                if(xValue >= 0 && xValue < height && yValue >= 0 && yValue < width){
                    actionTaken = action(xValue, yValue,bombsRemaining, i, j)
                    if(returnOnFirst && actionTaken){
                        return true
                    }
                }
            }
        }
    }

    return actionTaken
}


function flagUndiscovered(xValue, yValue, bombsRemaining, i, j){
    if(isUnclickedTile(xValue,yValue)){
        flagButton(xValue,yValue);
        return true                        
    }
    return false
}

function clickUndiscovered(xValue, yValue, bombsRemaining, i, j){
    if(isUnclickedTile(xValue,yValue)){
        board[xValue][yValue].button.click()
        return true
    }
    return false
}


function startSolver(){

    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            if(board[i][j].flagged){
                flagButton(i,j);
            }
        }
    }

    runSolver()
}

function runSolver(){
    if(placeFlags){
        clickFlagsButton.click()
    }
    clearSolver()
    solverLoader.style.visibility = "visible";
    solver = setInterval(solve, 10);
}


function solve(){

    if(firstClick){
        var i = Math.floor(Math.random() * 10);
        var j = Math.floor(Math.random() * 10);
        board[i][j].button.click()
    }

    let solution = true
    if(gameInProgress ){
        
        solution = false
        findButton:
        for(let i = 0; i < height; i++){
            for(let j = 0; j < width; j++){

                if(board[i][j].bombsTouching == null || board[i][j].bombsTouching == 0){ // only check square that have a number
                    continue;
                }

                var bombTiles = board[i][j].bombsTouching;
                var undiscoveredTiles = 0

                for(let x = -1; x < 2; x++){
                    for(let y = -1; y < 2; y++){
                        if(x != 0 || y != 0 ){
                            let xValue = i+x;
                            let yValue = j+y;
                            if(xValue >= 0 && xValue < height && yValue >= 0 && yValue < width){
                                if(isUnclickedTile(xValue,yValue)){
                                    undiscoveredTiles++; // the number of tiles around that have an unknown stes
                                }

                                if(board[xValue][yValue].flagged){
                                    bombTiles--; // the number of tiles around which are flagged (bombs)
                                }
                            }
                        }
                    }
                }

                if(bombTiles == undiscoveredTiles){ // the remaining tiles are all bombs
                    solution = actOnNeighbours(0,i,j,bombTiles,flagUndiscovered, true)
                    if(solution){
                        break findButton
                    }
                }

                if((bombTiles == 0 && undiscoveredTiles > 0)){ // the reamining tiles are safe
                    solution = actOnNeighbours(0,i,j,bombTiles,clickUndiscovered, true)
                    if(solution){
                        break findButton
                    }
                }

                if(undiscoveredTiles > 0 && bombTiles == 1){
                    solution = actOnNeighbours(0,i,j,bombTiles,solveNeighbourLimit, true)
                    if(solution){
                        break findButton
                    }
                }

                if(undiscoveredTiles > 0 && bombTiles > 1){
                    solution = actOnNeighbours(1,i,j,bombTiles, solveSelfLimit, true)
                    if(solution){
                        break findButton
                    }
                }
            }
        }
    }
    if(!solution) // if no progress was made last loop, solve using bruteforce
        bruteForce()
}

function solveSelfLimit(a,b,bombTiles, i,j){ // the current tile may require more bombs then the neighbour can have, making non-shared tiles bombs

    let radius = 2
    let shared = 0
    let notShared = 0
    let remainingSquares = 0
    let bombs = board[a][b].bombsTouching

    if(!(bombs > 0)){
        return false
    }

    for(let x = (-1 - radius); x < (2 + radius); x++){
        for(let y = (-1 - radius); y < (2 + radius); y++){
            let xValue = i+x;
            let yValue = j+y;
            if(xValue >= 0 && xValue < height && yValue >= 0 && yValue < width){

                if(isUnclickedTile(xValue,yValue)){
                    if(isTouching(xValue, yValue, a, b) && isTouching(xValue, yValue, i, j)){
                        shared++
                    }else if (isTouching(xValue, yValue, a, b) && !isTouching(xValue, yValue, i, j)){
                        notShared++
                    }else{
                        remainingSquares++
                    }
                }else if(board[xValue][yValue].flagged){
                    if(isTouching(xValue, yValue, a, b)){
                        bombs--
                    }
                }
            }
        }
    }

    if((notShared == 0 && shared > 0 && bombs == 1 && remainingSquares < bombTiles) ){
        for(let x = -1; x < 2; x++){
            for(let y = -1; y < 2; y++){
                let xValue = i+x;
                let yValue = j+y;
                if(xValue >= 0 && xValue < height && yValue >= 0 && yValue < width){
                    if(isTouching(xValue, yValue, a, b)){
                        continue
                    }
                    if(isUnclickedTile(xValue,yValue)){
                        flagButton(xValue,yValue);
                        return true
                    }
                }
            }
        }
    }

    return false

}

function isTouching(i1, j1, i2, j2){
    return (Math.max(Math.abs(i1 - i2), Math.abs(j1 - j2)) == 1)
}

function solveNeighbourLimit(a,b,bombsRemaining, i, j){ // a neighbouring tile may need a shared tiles, making non shared tiles safe

    let radius = 1
    let shared = 0
    let notShared = 0
    let bombs = board[a][b].bombsTouching

    if(!(bombs > 0)){
        return false
    }

    for(let x = (-1 - radius); x < (2 + radius); x++){
        for(let y = (-1 - radius); y < (2 + radius); y++){
            
            let xValue = i+x;
            let yValue = j+y;
            if(xValue >= 0 && xValue < height && yValue >= 0 && yValue < width){

                if(isUnclickedTile(xValue,yValue)){
                    if(isTouching(xValue, yValue, a, b) && isTouching(xValue, yValue, i, j)){
                        shared += 1
                    }else if (isTouching(xValue, yValue, a, b) && !isTouching(xValue, yValue, i, j)){
                        notShared += 1
                    }
                }else if(board[xValue][yValue].flagged){
                    if(isTouching(xValue, yValue, a, b)){
                        bombs--
                    }
                }
            }
        }
    }

    if((notShared < bombs && shared > 0) ){
        for(let x = -1; x < 2; x++){
            for(let y = -1; y < 2; y++){
                let xValue = i+x;
                let yValue = j+y;
                if(xValue >= 0 && xValue < height && yValue >= 0 && yValue < width){
                    if(isTouching(xValue, yValue, a, b)){
                        continue
                    }
                    if(isUnclickedTile(xValue,yValue)){
                        board[xValue][yValue].button.click()
                        return true
                    }
                }
            }
        }
    }

    return false
}

function isTouchingBomb(i,j){
    if(board[i][j].bombsTouching != 0 && board[i][j].bombsTouching != null){
        return true
    }
    return false
}

function isBoundaryTile(i,j){
    if(!isUnclickedTile(i,j))
        return false

    return actOnNeighbours(0,i,j,0,isTouchingBomb, true)
}

function isUnclickedTile(i,j){
    return (board[i][j].bombsTouching == null && (!board[i][j].flagged) && board[i][j].type != "cleared")
}

function isTouching(i,j,x,y){
    return (Math.max(Math.abs(i-x), Math.abs(j-y)) == 1)
}


function findSubsections(tiles) {
    const subSections = [];
    const visited = new Set();
    

    function dfs(tile, subsection) {
        visited.add(tile);
        subsection.push(tile);
        
        for (const nextTile of tiles) {
            if (visited.has(nextTile)) continue;
            if (isTouching(tile.height,tile.width,nextTile.height, nextTile.width)) {
                dfs(nextTile, subsection);
            }
        }
    }
    
    for (const tile of tiles) {
        if (visited.has(tile)) continue;
        const subsection = [];
        dfs(tile, subsection);
        subSections.push(subsection);
    }

    subSections.sort((a, b) => a.length - b.length);
    
    return subSections;
}


function makeSubBoard(minY, maxY, minX, maxX){
    var subBoard = []
    

    var _minHeight = Math.max(0,minY-2)
    var _maxHeight = Math.min(height,maxY+2)

    var _minWidth = Math.max(0,minX-2)
    var _maxWidth = Math.min(width,maxX+2)


    for(let i = _minHeight; i <= _maxHeight; i++){
        subBoard[i] = []
        for(let j = _minWidth; j <= _maxWidth; j++){
            if(i >= 0 && i < height && j >= 0 && j < width){

                let tile = Object.assign({}, board[i][j])
                subBoard[i][j] = tile
                subBoard[i][j].button = {"height": i, "width": j}
            }
        }
    }
    return subBoard
}


function clickBoard() {
    if(tilesToClick == null){
        clearSolver()
        runSolver()
    }else{
        tilesToClick[clickIndex].button.click()
        clickIndex -= 1
        if(clickIndex == -1){
            tilesToClick = null
        }
    }
}

function bruteForce(){

    if(!gameInProgress)
        return

    let boundaryTiles = []
    let unClickedTiles = []

    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){

            const tile = {"height": i, "width": j}

            if(isBoundaryTile(i,j)){
                boundaryTiles.push(tile)
            }else if(isUnclickedTile(i,j)){
                unClickedTiles.push(tile)
            }
        }
    }

    let subSections
    if(undiscovered < 10){
        subSections = [boundaryTiles]
    }else{
        subSections = findSubsections(boundaryTiles)
    }


    console.log(subSections.length + " subsections found")
    let bombsProbArray = []
    let solved = false;
    let combinationsFound = []
    let minimumRequired = 0
    for (const subSection of subSections) {

        if(subSection.length > 41){
            continue
        }else if(subSection.length <= 1){
            continue
        }

        let possibleBombs = new Set()
        let possibleBombsArray = []
        let attempts = [0]
        let minBombs = [undiscovered]
        if(!gameInProgress)
            return

        let minHeight = subSection[0].height
        let maxHeight = minHeight

        let minWidth = subSection[0].width
        let maxWidth = minWidth


        for(const tile of subSection){
            if(tile.height < minHeight)
                minHeight = tile.height
            if(tile.height > maxHeight)
                maxHeight = tile.height
            if(tile.width < minWidth)
                minWidth = tile.width
            if(tile.width > maxWidth)
                maxWidth = tile.width
        }

        let subBoard = makeSubBoard(minHeight, maxHeight, minWidth, maxWidth)
        console.log("Attempting bruteforce for " + subSection.length + " tile large section")
        bruteForceRecursive(subSection, subBoard,minHeight,minWidth, maxHeight - minHeight,maxWidth-minWidth, 0, possibleBombs, 0, possibleBombsArray, attempts, minBombs) // fill possible bombs with valid bomb loctations
        
        if(possibleBombsArray.length > 0){
            combinationsFound.push(attempts[0])
            console.log(attempts[0] + " different bomb combinations were found")
            console.log(minBombs[0] + " is the minimum number of bombs for a solution")
            minimumRequired += minBombs[0]
            bombsProbArray.push(possibleBombsArray)
        }
        if(possibleBombs.size != 0 && gameInProgress){
            tilesToClick = []
            clickIndex = -1
            for(const tile of subSection){
                if(possibleBombs.has(subBoard[tile.height][tile.width].button))
                    continue

                tilesToClick.push(board[tile.height][tile.width])
                clickIndex++
                solved = true
                if(solved){
                    clearSolver()
                    solverLoader.style.visibility = "visible";
                    if(placeFlags){
                        clickFlagsButton.click()
                    }
                    solver = setInterval(clickBoard, 10);
                    return
                }
            }
        }
    }
    
    if(!solved && bombsProbArray.length > 0){
        let lowestProb = Infinity
        let selection = null
        
        for(let i = 0; i < bombsProbArray.length; i++){
            const bombs = bombsProbArray[i]
        
            let occurances = countCoordinates(bombs)
            let minCount = Infinity;
            let argMin = null;
            let maxCount = -Infinity
           
            for (let tile in occurances) {

                if (occurances[tile] < minCount) {
                    minCount = occurances[tile];
                    argMin = tile;
                }

                if (occurances[tile] > maxCount) {
                    maxCount = occurances[tile];
                }
                
        
            }
            // console.log(minCount)
            // console.log(combinationsFound[i])
            if( (minCount /combinationsFound[i]) < lowestProb || selection == null){
                lowestProb = minCount / combinationsFound[i]
                selection = argMin
            }


        }

        let [x, y] = selection.split(',').map(Number);
        if(unClickedTiles.length > 0){
            let randomUnclikedProb = (undiscovered - minimumRequired) / unClickedTiles.length
            //console.log(randomUnclikedProb)
            if(randomUnclikedProb < lowestProb){
                console.log("Non-Boundary tile had lower prob " + randomUnclikedProb +  " vs " + lowestProb)
                lowestProb = randomUnclikedProb
                let randomTile = unClickedTiles[Math.floor(Math.random()*unClickedTiles.length)];
                x = randomTile.height;
                y = randomTile.width;
            }
        }
            

        console.log("No Solution going to click lowest prob")
        randomClick = true
        randomProb = lowestProb
        board[x][y].button.click()
        randomClick = false

    }else{

        console.log("Subsection is too long to solve ")
        let randomUnclikedProb = (undiscovered) / unClickedTiles.length
        let lowestProb = randomUnclikedProb
        let randomTile = unClickedTiles[Math.floor(Math.random()*unClickedTiles.length)];
        let x = randomTile.height;
        let y = randomTile.width;
            
        randomClick = true
        randomProb = lowestProb
        board[x][y].button.click()
        randomClick = false
    }

    

    

}

function bruteForceRecursive(subSection, _board,minHeight, minWidth, height_b, width_b, k, possibleBombs, newBombs, possibleBombsArray, attempts, minBombs){
    if(!checkBoardValidity(_board, minHeight, minWidth, height_b, width_b))
        return

    if(newBombs > bombsLeft){
        return
    }

    if(k == subSection.length){ // a valid solution was found for this subsection of boundary tiles
        for (const tile of subSection){
            if(_board[tile.height][tile.width].flagged){
                possibleBombs.add(_board[tile.height][tile.width].button) // add the bomb tiles to the set (no duplicates)
                possibleBombsArray.push(_board[tile.height][tile.width].button) 
            }

            if(minBombs[0] > newBombs){
                minBombs[0] = newBombs
            }
        }

        attempts[0] = attempts[0] + 1
        return
    }

    let tileCoord = subSection[k] // either the boundary  tile is a mine or not. Try both
    let x = tileCoord.height
    let y = tileCoord.width

    _board[x][y].flagged = true // try with it being a mine
    bruteForceRecursive(subSection, _board, minHeight, minWidth, height_b, width_b, k+1,possibleBombs, newBombs+1, possibleBombsArray, attempts, minBombs)
    _board[x][y].flagged = false
    _board[x][y].knownEmpty = true // try with it being a known empty
    bruteForceRecursive(subSection, _board, minHeight, minWidth, height_b, width_b, k+1, possibleBombs, newBombs,possibleBombsArray, attempts,minBombs)
    _board[x][y].knownEmpty = false
}

function countCoordinates(tiles) {
    let count = {};
    for (let i = 0; i < tiles.length; i++) {
        let tile = tiles[i];
        let key = `${tile.height},${tile.width}`;
        if (count[key]) {
            count[key]++;
        } else {
            count[key] = 1;
        }
    }
    return count;
}


function checkAroundTile(_board, i, j){

    let neighbours = 0
    let flags = 0
    let undiscoveredTiles = 0
    let knownEmpty = 0

    for(let x = -1; x < 2; x++){
        for(let y = -1; y < 2; y++){
            if(x != 0 || y != 0 ){
                let xValue = i+x;
                let yValue = j+y;
                if(xValue >= 0 && xValue < height && yValue >= 0 && yValue < width){
                    tile = _board[xValue][yValue]
                    
                    if(tile.bombsTouching != null && tile.bombsTouching != 0){
                        neighbours++;
                    }else if(tile.flagged){
                        flags++;
                    }else if(tile.bombsTouching == null){
                        undiscoveredTiles++;  
                        if(tile.knownEmpty){
                            knownEmpty++;
                        }
                    }
                }
            }
        }
    }

    return [neighbours, flags, undiscoveredTiles, knownEmpty]
}


function checkBoardValidity(_board, minY, minX, heightY, widthX){
    
    let _minHeight = Math.max(0,minY-1)
    let _maxHeight = Math.min(height-1,minY+heightY+1)

    let _minWidth = Math.max(0,minX-1)
    let _maxWidth = Math.min(width-1,minX+widthX+1)

    for(let i = _minHeight; i <= (_maxHeight); i++){
        for(let j = _minWidth; j <= (_maxWidth); j++){
            let tile = _board[i][j]

            if(tile.bombsTouching != 0 && tile.bombsTouching != null){
                let status = checkAroundTile(_board, i, j)

                let flagCount = status[1]
                let undiscoveredTiles = status[2]
                let knownEmpty = status[3]
                
                //check 1 - are too many bombs toching this tile
                if(flagCount > tile.bombsTouching){
                    return false
                }

                //check 2 - have we assumed too many tiles are not bombs
                if( (undiscoveredTiles - knownEmpty ) < (tile.bombsTouching- flagCount) ){ // maybe - flagCount
                    return false
                }
            }
        }
    }

    return true
}

createBoard();
