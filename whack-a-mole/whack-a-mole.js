
let currentMoleTile;
let currentPlantTile;

let score = 0;
let gameOver = false;

window.onload = function() {
    setGame();
}

function setGame() {
    // אתחול של הגריד בלוח המשחק
    for (let i = 0; i < 9; i++){
       let tile = document.createElement("div");
       tile.id = i.toString();
       tile.addEventListener("click", selectTile);
       document.getElementById("board").appendChild(tile);
    }

    // כל 1 שניות קובעים מיקום לחפרפרת
    setInterval(setMole, 1000);
    // כל 2 שניות קובעים מיקום לצמח הטורף
    setInterval(setPlant, 2000);
}

function getRandomTile(){
    // מחזיר מספר בין 0 ל8 עבור מיקום החפרפרת 
    let num = Math.floor(Math.random()*9);
    return num.toString();
}

function setMole(){

    if(gameOver){
        return;
    }

    if(currentMoleTile){
        currentMoleTile.innerHTML = "";
    }

    let mole = document.createElement("img");
    mole.src = '/whack-a-mole/monty-mole.png'

    let num  = getRandomTile();

    // פה אנחנו בודקים אם מיקום הצמח והחפרפרפרת זהה 
    // במקרה זה לא נעדכן את מיקום החפרפרת
    if(currentPlantTile && currentPlantTile.id == num){
        return;
    }

    currentMoleTile = document.getElementById(num);
    currentMoleTile.appendChild(mole);
}

function setPlant(){
    if(gameOver){
        return;
    }

    if(currentPlantTile){
        currentPlantTile.innerHTML = "";
    }

    let plant = document.createElement("img");
    plant.src = '/whack-a-mole/plant.png'

    let num = getRandomTile();

    // פה אנחנו בודקים אם מיקום הצמח והחפרפרפרת זהה 
    // במקרה זה לא נעדכן את מיקום הצמח
    if(currentMoleTile && currentMoleTile.id == num){
        return;
    }

    currentPlantTile = document.getElementById(num);
    currentPlantTile.appendChild(plant);
}

function selectTile(){
    if(gameOver){
        return;
    }
    // המטרה היא לתפוס חפרפרת ולא לתפוס בטעות צמח טורף

    // אם תפסנו חפרפרת הצלחנו
    // ולכן הניקוד עולה
    if(this == currentMoleTile){
        score += 10;
        document.getElementById("score").innerText = score.toString();
    }

    // אם תפסנו צמח טורף הפסדנו במשחק
    else{
        gameOver = true;
        document.getElementById("score").innerText = 'המשחק נגמר: '   + score.toString();
    }
}