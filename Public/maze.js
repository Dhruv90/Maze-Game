class Cell {

    constructor(x, y, hostEl) {
        this.x = x;
        this.y = y;
        this.id = `x${this.x}y${this.y}`;
        this.visited = 'false';
        this.direction = [];
        this.createCell(hostEl);
    }

    createCell(hostEl) {
        const cellEl = document.createElement('td');
        cellEl.setAttribute('data-x', this.x);
        cellEl.setAttribute('data-y', this.y);
        cellEl.id = this.id;
        hostEl.append(cellEl);
    }
}

class Player {
    constructor(cells, row, col){
        this.cells = cells;
        this.row = row;
        this.col = col;
        this.pos = {
            x: 0,
            y: 0
        };
        this.steps = 0;
        this.playerPos;
        this.prevPos;
        this.renderPlayer(this.cells[0]);
        this.boundMovePlayer = this.movePlayer.bind(this);
        document.addEventListener('keydown', this.boundMovePlayer);
        console.log(this);
    }
    renderPlayer(cell) {
        const id = cell.id;
        // console.l    og(id);
        this.pos.x = cell.x; 
        this.pos.y = cell.y;
        this.playerPos = document.getElementById(id);
        this.playerPos.classList.add('player-img');
        if(this.pos.x == this.row-1 && this.pos.y == this.col-1){
            // alert('done');
            this.endPlayer();
            this.showEndMessage();
        }
    }

    showEndMessage() {
        const messageElement = document.getElementById('show-message');
        const okBtn = document.querySelector('#message-btn');
        messageElement.querySelector('p').innerText = `You took ${this.steps} steps!`;
        messageElement.style.display = 'block';
        okBtn.addEventListener('click', () => {messageElement.style.display='none'})
    }

    deletePrevPosition(cell){
        const id = cell.id;
        this.prevPos = document.getElementById(id);
        this.prevPos.classList.remove('player-img');
    }

    movePlayer(event) {   
        this.steps++; 
        const cell = this.cells.filter(cell => cell.x == this.pos.x && cell.y == this.pos.y)[0];
        let newCellId = cell.id;
        if(event.code == 'ArrowDown'){
            if(cell.direction.indexOf('s') >= 0) {
                newCellId = `x${cell.x + 1}y${cell.y}`
            }
        }
        if(event.code == 'ArrowUp'){
            if(cell.direction.indexOf('n') >= 0) {
                newCellId = `x${cell.x - 1}y${cell.y}`
            }
        }
        if(event.code == 'ArrowRight'){
            if(cell.direction.indexOf('e') >= 0) {
                newCellId = `x${cell.x}y${cell.y+1}`
            }
        }
        if(event.code == 'ArrowLeft'){
            if(cell.direction.indexOf('w') >= 0) {
                newCellId = `x${cell.x}y${cell.y-1}`
            }
        }
        const newCell = this.cells.filter(cell => cell.id === newCellId)[0];
        // console.log(newCell);
        this.deletePrevPosition(cell);
        this.renderPlayer(newCell);
    }

    endPlayer(){
        document.removeEventListener('keydown', this.boundMovePlayer);
    }
}

class Maze {

    constructor(row, col, mazeHostEl) {
        // this.toggleLoading();
        this.row = row;
        this.col = col;
        this.cells = [];
        this.posArr = [];
        this.createTable(mazeHostEl);
        this.mapSolution();
        this.constructSolution();
        this.mazify();
        this.mapSolutionToCells();
        this.player = new Player(this.cells, this.row, this.col);
        
    }

    // toggleLoading(){
    //     console.log(document.getElementById('show-loading'));
    //     if( document.getElementById('show-loading').style.display == 'none'){
    //         document.getElementById('show-loading').style.display = 'block';
    //     } else {
    //         document.getElementById('show-loading').style.display = 'none';
    //     }
    // }

    createTable = (mazeHostEl) => {
        let tableElement = document.createElement('table')
        mazeHostEl.append(tableElement);
        for (let i=0; i<this.row; i++){
            let cellHostEl = document.createElement('tr');
            tableElement.append(cellHostEl);
            for(let j=0; j<this.col; j++){
                this.cells.push(new Cell(i, j, cellHostEl));
            }
        }
        console.log(tableElement);
    }

    mazify = () => {
        for (const cell of this.cells){
            if(cell.visited == 'false'){
                const cellEl = document.getElementById(`x${cell.x}y${cell.y}`)
                if (cellEl.getAttribute('data-x') == 0) {
                    if (cellEl.getAttribute('data-y') != this.col-1) {
                        if(Math.random()<0.5){
                            cellEl.style.borderRight = '0px';
                            cellEl.setAttribute(`data-right`,'true');
                        }
                    }
                }else { 
                    if(cellEl.getAttribute('data-y') != this.col-1){ 
                        if(Math.random()<0.5){
                            cellEl.style.borderRight = '0px';
                            cellEl.setAttribute(`data-right`,'true');
                        } else{
                            cellEl.style.borderTop = '0px';
                            cellEl.setAttribute(`data-top`,'true');
                        }
                    }   
                }    
            }
        }
    }

    mapSolution = () => {

        let x=0;
        let y=0;
        this.posArr = [[x,y]]  //this array will hold the solution path
        let i=0;
        let numLoops = 0;
        let popCount = 0;
        let maxLoops = parseInt(this.row * this.col); // to limit the number of cells traversed in the solution

        while(!(x == this.row-1 && y == this.col-1)){ 
            numLoops++;
            if(numLoops > maxLoops){
                x=0;
                y=0;
                this.posArr = [[x,y]];
                i=0;
                numLoops = 1;
            }
            if(i > 1){
                let prevPosArr = this.posArr.slice(0,i);
                if((prevPosArr.map(JSON.stringify).indexOf(JSON.stringify([x,y]))) >= 0){   
                    console.log('repeat');
                    x = this.posArr[i-1][0];
                    y = this.posArr[i-1][1];
                    this.posArr.pop();
                    i--;
                    popCount++
                }
            }
            // console.log(x,y);

            let random = Math.random();
            if(x == 0){ 
                if (y == 0){
                    if (random < 0.5 ) { x++ }
                    else { y++ }
                }    
                else if (y==this.col-1) {
                    if (random <=0.5 ) { x++ }
                    else { y-- }

                }
                else {
                    if (random <0.33 ) { y-- }
                    else if (random >0.33 && random <=0.66 ) { y++ }
                    else { x++ }

                }
            }
            else if(x==this.row-1){
                if (y==0){
                    if (random <0.5 ) { x-- }
                    else { y++ }

                }    
                else if (y==this.col-1) {
                    if (random <0.5 ) { x-- }
                    else { y-- }

                }
                else {
                    if (random <0.33 ) { y-- }
                    else if (random >0.33 && random <=0.66) { y++ }
                    else { x-- }
                    
                }
            }
            else if(y == 0) {
                if (random <0.33) { x-- }
                else if (random >0.33 && random <=0.66 ) { x++ }
                else { y++ }
            }
            else if(y == this.col-1){ 
                if (random <0.33) { x-- }
                else if (random >0.33 && random <=0.66 ) { x++ }
                else { y-- }
                
            } else{
                if (random <0.25) {x++}
                else if(random >=0.25 && random <0.5) {x--}
                else if (random >=0.5 && random <0.75) {y++}
                else {y--}
                
            }
            // console.log(x,y);
            this.posArr.push([x,y]);
            i++;    

        }
        // console.log(this.posArr);
        console.log("Complete");
        for(const cell of this.posArr){
            for (const cellEl of this.cells){
                if(cellEl.id == `x${cell[0]}y${cell[1]}`){
                    cellEl.visited = 'true';
                }
            }
        }
    }    

    constructSolution() {
        // for breaking down created solution walls
        for (let k = 0; k<this.posArr.length-1; k++) {
            let x = this.posArr[k][0];
            let y = this.posArr[k][1];
            let nx = this.posArr[k+1][0];
            let ny = this.posArr[k+1][1];
    
            if(nx>x){
                const cell = document.getElementById(`x${nx}y${ny}`);
                cell.style.borderTop = '0px';
                cell.setAttribute(`data-top`,'true');
            }
            else if(nx<x){
                const cell = document.getElementById(`x${x}y${y}`);
                cell.style.borderTop = '0px';
                cell.setAttribute(`data-top`,'true');
            }
            else if (ny<y){
                const cell = document.getElementById(`x${nx}y${ny}`);
                cell.style.borderRight = '0px';
                cell.setAttribute(`data-right`,'true');
            }
            else if (ny>y){
                const cell = document.getElementById(`x${x}y${y}`);
                cell.style.borderRight = '0px';
                cell.setAttribute(`data-right`,'true');
            }
            // const solCell = document.getElementById(`x${x}y${y}`);
            // solCell.style.backgroundColor = 'green';
        }
    }

    mapSolutionToCells() {
        for (let i = 0; i<this.cells.length; i++){
            const cellEl = document.getElementById(this.cells[i].id);
            if(cellEl.getAttribute('data-right') == 'true'){
                this.cells[i].direction.push('e');
                this.cells[i+1].direction.push('w');
            }
            if(cellEl.getAttribute('data-top') == 'true'){
                this.cells[i].direction.push('n');
                this.cells[i-this.row].direction.push('s');
            }
        }
        // console.log(this.cells);
        // this.toggleLoading();
    }
 
    endPlay(){
        this.player.endPlayer();
        this.player = null;
    } 
}

class App {
    static init() {
        let mazeHostEl = document.querySelector('#mazeContainer');
        let row = 8;
        let col = 8;
        let maze = new Maze(row, col, mazeHostEl);
        
        const difficulty = document.querySelector('select');
        difficulty.addEventListener('change', selectDifficulty);
        
        const startBtn = document.querySelector('form').querySelector('button');
        startBtn.addEventListener('click', startGame);

        function selectDifficulty() {
            if(difficulty.value == 'Easy'){
                row = 8;
                col = 8;
            }
            if(difficulty.value == 'Medium'){
                row = 12;
                col = 12;
            }
            if(difficulty.value == 'Hard'){
                row = 17;
                col = 17;
            }
        }
             
        function startGame(){
            console.log(maze);
            maze.endPlay();
            mazeHostEl.innerHTML = ``;
            maze = null;
            maze = new Maze(row, col, mazeHostEl);
        }

        // document.onreadystatechange = function(){
        //     if (document.readyState !== "complete") {console.log('loading')}
        //     else {console.log('Loading done')}
        // }
    }

    
}

App.init();