//  הצינורות במשחק והרווח בינהם
var pipe1_hg, hole1_hg, pipe2_hg;
// הציפור המעופפת
var elem = document.getElementById("bird");
// כפתור שמאפשר לשחק שוב במקרה של פסילה
var playAgainBtn = document.getElementById("play-again"); 
// האינטרוולים שמגדיירם את הפעולות שצריך לבצע במשחק
var gravityInterval, gameInterval, scoreInterval, collisionCheckInterval;
// הניקוד שצבר המשתמש במשחק
var score = 0;

// פונקציה שמופעלת כשמתחילים את המשחק
function startGame() {
    // עדכוני תצוגה
    playAgainBtn.style.display = "none"; 
    elem.style.top = "100px";
    // איפוס הניקוד
    score = 0; 

    // הגדרת האינטרוול שמשפיע על מיקום הצינורות
    gameInterval = setInterval(() => {
        pipe1_hg = Math.floor(Math.random() * 10) + 30;
        hole1_hg = Math.floor(Math.random() * 20) + 20;
        document.getElementById("pipe1").style.height = pipe1_hg + "%";
        document.getElementById("pipe2").style.top = pipe1_hg + hole1_hg + "%";
        document.getElementById("pipe2").style.height = 100 - (pipe1_hg + hole1_hg) + "%";
    }, 4000);

    // הגדרת האינטרוול של כוח הכבידה
    // אינטרוול זה משפיע על מיקוםהציפור וגורם לה לרדת למטה 
    // אם לא מעלים אותה למעלה
    gravityInterval = setInterval(() => {
        var x = parseInt(window.getComputedStyle(elem).getPropertyValue("top"));
        if (x <= 510) {
            elem.style.top = (x + 3) + "px";
        } else {
            gameOver();
        }
    }, 30);

    // הגדרת האינטרוול שמשפיע על הניקוד במשחק
    // כל חצי שניה הניקוד גדל ב-1
    scoreInterval = setInterval(() => {
        score++;
        document.getElementById("scr").innerHTML = score;
    }, 500);

    // הגדרת האינטרוול שבודק האם יש פסילה
    // פסילה קורה כאשר יש התנגשות של הציפור בצינורות
    collisionCheckInterval = setInterval(() => {
        if (checkCollision(document.getElementById("bird"), document.getElementById("pipe1")) ||
            checkCollision(document.getElementById("bird"), document.getElementById("pipe2"))) {
            elem.style.top = "513px";
            setTimeout(gameOver, 10);
        }
    }, 100);
}

// פונקציה של סיום המשחק
function gameOver() {
    // מבטלים את כל האינטרוולים - כלומר מפסיקים את פעולת המשחק
    clearInterval(gravityInterval);
    clearInterval(gameInterval);
    clearInterval(scoreInterval);
    clearInterval(collisionCheckInterval);

    // מתריעים על סיום המשחק
    alert("הפסדת! הניקוד שלך הוא: " + score);
    
    // שומרים את ניקוד המשתמש הנוכי במשחק זה
    saveUserScore('flappy-bird', score);

    // מציגים את הכפתור שמאפשר לשחק שוב
    playAgainBtn.style.display = "block";
}

// פונקציה זו משמשת לבדיקה האם יש התנגשות בין שני אלמנטים
function checkCollision(elm1, elm2) {
    var elm1Rect = elm1.getBoundingClientRect();
    var elm2Rect = elm2.getBoundingClientRect();
    
    // בודקים האם יש חפיפה בגבולות של האלמנטים 
    return (elm1Rect.right >= elm2Rect.left && 
            elm1Rect.left <= elm2Rect.right) && 
           (elm1Rect.bottom >= elm2Rect.top && 
            elm1Rect.top <= elm2Rect.bottom);
}

// הוספת אירוע שמטרתו להקפיץ את הציפור בלחיצה
document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        jump();
    }
});

// מטרת הפונקציה היא להעלות את הציפור
function jump(){
    var fly = parseInt(window.getComputedStyle(elem).getPropertyValue("top"));
    if(fly >= 14){
        elem.style.top=(fly-40)+"px";
    }
}

// הוספת אירוע של תחילת משחק לכפתור שחק שוב
playAgainBtn.addEventListener('click', startGame);
// התחלת המשחק
startGame();



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
    updateScoresTable('flappy-bird');
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
          valueCell.textContent = values.join('  ');
          row.appendChild(valueCell);
          
          scoresTableBody.appendChild(row);
        });
      
    }
    else{
        scoresTableBody.parentElement.style.display = 'none';
    }
}

