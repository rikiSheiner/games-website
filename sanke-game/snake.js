/*
הסבר על משחק הנחש: 
יש לנו לוח בגודל 20*20
תזוזה בעמודות מתבטאת בשינוי ערך בציר הX
תזוזה בשורות מתבטאת בשינוי ערך בציר הY

גודל הלוח נקבע ע"י משתנה הנקרא BOX-SIZE
ניתן למקם את האוכל של הנחש בריבועים בתוך הלוח

*/

// הלוח
var blockSize = 25; // מה הגודל של כל משבצת בלוח (רוחב וגובה של כל ריבוע בלוח)
var rows = 20; // כמה שורות יש בלוח
var cols = 20; // כמה עמודות יש בלוח

var board; 
var context;

// ראש הנחש
// נקודת ההתחלה של הנחש תיהיה במשבצת (5,5)
// כלמור שורה 5 עמודה 5
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

// קביעת כיוון התאוצה של הנחש
// לאיזה כיוון הנחש זז כעת
// בתחילה הנחש לא זז בשורות ולא זז בעמודות
// רק כשהשחקן לוחץ על אחד החצים בתחילת המשחק הנחש מתחיל לזוז לפי החץ שנבחר
var velocityX = 0; // מציין כיוון תזוזה בשורות
var velocityY = 0; // מציין כיוון תזוזה בעמודות

// מערך שיכיל את כל המשבצות של גוף הנחש
var snakeBody = []

// food
// קביעת מיקום האוכל בלוח
var foodX; 
var foodY;

// האם המשחק נגמר
var gameOver = false;

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

// עדכון טבלת ההישגים של המשתתפים במשחק
updateScoresTable('snake');

// אם רוצים לשחק שוב צריך לעדכן את התצוגה בהתאם
document.querySelector("#play-again").addEventListener("click", ()=>{
    gameOver = false;
    document.querySelector("#results").innerHTML = "";
    document.querySelector("#play-again").style.display = "none";

    window.location.reload();
});

let updateInterval;
window.onload = function() {
    board = document.getElementById("board");
    // קביעת הגודל של לוח המשחק
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); // משמש בשביל לצייר על הלוח

    // מיקום האוכל בלוח
    placeFood();

    // הוספת מאזין לאירוע שינוי כיוון של הנחש
    document.addEventListener("keyup", changeDirection);
    
    // צריך לעדכן את הלוח כל רגע במהלך המשחק
    // בהתאם לפעולות שהשחקן מבצע
    updateInterval = setInterval(update, 1000/10);
}

function drawImageCover(ctx, img, x, y, w, h) {
    // Calculate the best-fitting size for the image
    // (maximizes size while preserving aspect ratio)
    // First, calculate the ratios of canvas to image dimensions
    let imgRatio = img.width / img.height;
    let canvasRatio = w / h;

    let drawWidth, drawHeight, offsetX, offsetY;

    // Determine whether to fill vertically or horizontally
    if (imgRatio < canvasRatio) {
        // Image is narrower than canvas, so fill horizontally
        drawWidth = w;
        drawHeight = w / imgRatio;
        offsetX = 0;
        offsetY = -(drawHeight - h) / 2;
    } else {
        // Image is wider than canvas, so fill vertically
        drawHeight = h;
        drawWidth = h * imgRatio;
        offsetX = -(drawWidth - w) / 2;
        offsetY = 0;
    }

    // Draw the image on canvas
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}


// הפונקציה הזאת משמשת בשביל לצבוע את הלוח 
function update(){
    console.log("update");

    //סיום המשחק 
    if(gameOver){
        clearInterval(updateInterval);
        return;
    }

    // צביעה של כל הלוח בשחור
    context.fillStyle = "#1a9c27";
    context.fillRect(0,0,board.width, board.height);

   //צביעה של המשבצת של האוכל
   context.fillStyle = "red";
   context.fillRect(foodX, foodY, blockSize,blockSize);
    
   // הגדלה של גוף הנחש כשהוא מצליח לתפוס אוכל
    if(snakeX == foodX && snakeY == foodY){
        snakeBody.push([foodX, foodY]);
        // קביעת מיקום חדש של האוכל בלוח
        placeFood();
    }

    // מעדכנים את המיקומים של גוף הנחש 
    // להיות אחד קדימה בשביל פנות מקום לראש
    for(let i = snakeBody.length-1; i > 0; i--){
        snakeBody[i] = snakeBody[i-1];
    }

    // אם אורך גוף הנחש גדול מ-0 נכניס בתחילת הגוף את מיקום הראש
    if(snakeBody.length){
        snakeBody[0] = [snakeX, snakeY];
    }

    // צביעה של הריבוע שבו ממוקם ראש הנחש
    context.fillStyle = "yellow";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);

    // צביעה של כל הריבועים שבהם ממוקם גוף הנחש
    for(let i = 0; i < snakeBody.length; i++){
        context.fillRect(snakeBody[i][0], snakeBody[i][1],  blockSize, blockSize);
    }

    //תנאים לסיום המשחק

    // הנחש יצא מהגבולות של הלוח
    if(snakeX < 0 || snakeY > cols * blockSize || snakeY < 0 || snakeY > rows * blockSize){
        gameOver = true;
        alert("המשחק נגמר!");
        
        // שמירת הניקוד של המשתמש במשחק
        let score = snakeBody.length + 1;
        saveUserScore('snake', score);

        // הוספת אפשרות לשחק שוב
        document.querySelector("#play-again").style.display = "inline";

    }

    // הנחש נתקע בגוף של עצמו
    for(let i = 0; i < snakeBody.length; i++){
        if(snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
            alert("המשחק נגמר!");

            // שמירת הניקוד של המשתמש במשחק
            let score = snakeBody.length + 1;
            saveUserScore('snake', score);
            
            // הוספת אפשרות לשחק שוב
            document.querySelector("#play-again").style.display = "inline";

        }
    }
 }

 // פונקציה בשביל שינוי כיוון של תנועת הנחש בהתאם לחץ במקלדת
function changeDirection(e){
    if(e.code == "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    }
    else if(e.code == "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }
    else if(e.code == "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }
    else if(e.code == "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }
}

// פונקציה בשביל למקם את האוכל במיקום אקראי בלוח
function placeFood(){
    // (0-1) * cols => (0,19) * 25
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;

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

    // עדכון טבלת ההישגים של המשתתפים במשחק
     updateScoresTable('snake');
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