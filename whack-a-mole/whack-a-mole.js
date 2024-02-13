
let currentMoleTile;
let currentPlantTile;

let score = 0;
let gameOver = false;

window.onload = function() {
    setGame();
}

// הוספת אירוע הצגת הישגי המשחק 
// כשלוחצים על הכפתור תתעדכן התצוגה של טבלת 
// ההישגים בהתאם למה שהיה לפני הלחיצה
let showScoresBtn = document.getElementById('display-scores-btn');
showScoresBtn.addEventListener('click', function(){
    // עדכון התצוגה של טבלת ההישגים
    let scoresTable = document.querySelector('#scores-table');
    let tableDisplay = scoresTable.style.display;    
    scoresTable.style.display = tableDisplay === 'none' ? 'block' : 'none';

    // עדכון התוכן של הכפתור
    if(showScoresBtn.innerHTML === 'צפה בהישגים'){
        showScoresBtn.innerHTML = 'הסתר הישגים'
    }
    else{
        showScoresBtn.innerHTML = 'צפה בהישגים'
    }
});

// עדכון טבלת ההישגים של המשחק
updateScoresTable('whack-a-mole');

// אם רוצים לשחק שוב צריך לעדכן את התצוגה בהתאם
document.querySelector("#play-again").addEventListener("click", ()=>{
    gameOver = false;
    document.querySelector("#results").innerHTML = "";
    document.querySelector("#play-again").style.display = "none";

    setGame();
})

function setGame() {
    // אתחול הניקוד במשחק
    score = 0;
    // ניקוי לוח המשחק
    document.getElementById("board").innerHTML = "";

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

        // שמירה של הניקוד עבור משתמש זה
        saveUserScore('whack-a-mole', score);

        // הוספת אפשרות לשחק שוב
        document.querySelector("#play-again").style.display = "inline";

    }
}


// שמירה של הניקוד עבור משתמש זה
function saveUserScore(gameName, gameScore){
    // יש לנו טבלת ניקוד לכל המשחקים ביחד
    // שבה שמורה רשומה לכל משחק
    // המפתח הוא שם המשחק
    // והערך הוא רשימה שמכילה רשומות של ניקוד לכל משתמש

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const allScores = JSON.parse(localStorage.getItem('allScores')) || {};
    
    // נבדוק האם לא שמרנו ניקוד בעבר עבור משחק זה
    if(!allScores[gameName]){
        // ניצור רשימת ניקוד עבור משחק זה
        allScores[gameName] = {};
    }

    
    // בדיקה האם משתמש זה לא שיחק במשחק זה
    if(!allScores[gameName][currentUser.username] ){
        // שמירה של ניקוד המשתמש במשחק
        allScores[gameName][currentUser.username] = [gameScore];
    }
    else{
        // שמירה של ניקוד המשתמש במשחק
        allScores[gameName][currentUser.username].push(gameScore);
    }
    
    // עדכון רשימת ההישגים של המשתמש במשחק זה
    localStorage.setItem("allScores", JSON.stringify(allScores));


    // עדכון טבלת ההישגים של כל המשתתפים
    updateScoresTable('whack-a-mole');
}


// מטרת הפונקציה היא לעדכן את טבלת ההישגים של המשחק
// בהתאם להישגי המשתתפים במשחק עד כה
function updateScoresTable(gameName){

    const scoresTableBody = document.querySelector("#scores-table tbody");

    scoresTableBody.innerHTML = "";

    const scores = JSON.parse(localStorage.getItem('allScores')) || {};
    let scoresGame = scores[gameName];

    
    if(scoresGame){    
        scoresTableBody.parentElement.style.display = 'block';

        const sortedKeys = Object.keys(scoresGame).sort();
  
        sortedKeys.forEach(key => {
          const values = scoresGame[key];
          const row = document.createElement("tr");
          
          const keyCell = document.createElement("td");
          keyCell.textContent = key;
          row.appendChild(keyCell);
          
          const valueCell = document.createElement("td");
          valueCell.textContent = values.join("  ");
          row.appendChild(valueCell);
          
          scoresTableBody.appendChild(row);
        });
      
    }
    else{
        scoresTableBody.parentElement.style.display = 'none';
    }
}