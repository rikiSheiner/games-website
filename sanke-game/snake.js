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
    setInterval(update, 1000/10);
}

// הפונקציה הזאת משמשת בשביל לצבוע את הלוח 
function update(){
    console.log("update");

    //סיום המשחק 
    if(gameOver){
        return;
    }

    // צביעה של כל הלוח בשחור
    context.fillStyle = "black";
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
    context.fillStyle = "lime";
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
        alert("Game Over!");

    }

    // הנחש נתקע בגוף של עצמו
    for(let i = 0; i < snakeBody.length; i++){
        if(snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
            alert("Game Over!");
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

