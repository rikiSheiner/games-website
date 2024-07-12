
// כל המשבצות שיש בלוח
let boxes = document.querySelectorAll(".box");

let turn = "X";
let isGameOver = false;

boxes.forEach(e =>{
    e.innerHTML = ""
    e.addEventListener("click", ()=>{
        if(!isGameOver && e.innerHTML === ""){
            e.innerHTML = turn;
            cheakWin();
            cheakDraw();
            changeTurn();
        }
    })
})


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
updateScoresTable('tic-tac-toe');


// מטרת הפונקציה היא לשנות את השחקן לשחקן הבא בתור
function changeTurn(){
    if(turn === "X"){
        // מחליפים שחקן
        turn = "O";
        //  מחליפים את הסימון של השחקן בראש העמוד
        document.querySelector(".bg").style.left = "85px";
    }
    else{
        // מחליפים שחקן
        turn = "X";
        //  מחליפים את הסימון של השחקן בראש העמוד
        document.querySelector(".bg").style.left = "0";
    }
}

//  המטרה של פוקציה זו היא לבדוק האם יש ניצחון
function cheakWin(){
    // רשימה זו מגדירה את כל צירופי המיקומים 
    // האפשריים בשביל ניצחון
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // אותה שורה
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // אותה עמודה
        [0, 4, 8], [2, 4, 6]  // אותו אלכסון
    ];

    // בלולאה זו בודקים האם יש רצף של שחקן אחד , אם כן הוא מנצח
    for(let i = 0; i<winConditions.length; i++){
        let v0 = boxes[winConditions[i][0]].innerHTML;
        let v1 = boxes[winConditions[i][1]].innerHTML;
        let v2 = boxes[winConditions[i][2]].innerHTML;

        if(v0 != "" && v0 === v1 && v0 === v2){
            isGameOver = true;
            document.querySelector("#results").innerHTML = turn +  " ניצח 🏆";
            document.querySelector("#play-again").style.display = "inline";

            // שמירה של הניקוד עבור משתמש זה
            // נניח שהשחקן הראשון זה המשתמש הנוכחי
            let score = turn === "X" ? 1 : 0;
            saveUserScore('tic-tac-toe', score);

            // בלולאה זו מסמנים את הרצף שנמצא על גבי לוח המשחק
            for(j = 0; j<3; j++){
                boxes[winConditions[i][j]].style.backgroundColor = "#08D9D6"
                boxes[winConditions[i][j]].style.color = "#000"
            }
        }
    }
}

// מטרת הפונקציה היא לבדוק האם כל הלוח כבר מלא
// ייתכן שהמשחק ייגמר כשהלוח מלא גם אם אין ניצחון
function cheakDraw(){
    if(!isGameOver){
        let isDraw = true;

        //עוברים על כל המשבצות בלוח ובודקים האם יש עדיין משבצת פנויה
        // שמאפשרת להמשיך את המשחק
        boxes.forEach(e =>{
            if(e.innerHTML === "") isDraw = false;
        })

        // אם הלוח מלא לגמרי אי אפשר להמשיך לשחק
        if(isDraw){
            isGameOver = true;
            document.querySelector("#results").innerHTML = "הלוח מלא ";
            document.querySelector("#play-again").style.display = "inline";

            // שמירה של הניקוד עבור משתמש זה
            // במקרה שכל הלוח מלא ואין רצף המשחק נגמר בלי מנצח
            saveUserScore('tic-tac-toe', 0);
        }
    }
}

// אם רוצים לשחק שוב צריך לעדכן את התצוגה בהתאם
document.querySelector("#play-again").addEventListener("click", ()=>{
    isGameOver = false;
    turn = "X";
    document.querySelector(".bg").style.left = "0";
    document.querySelector("#results").innerHTML = "";
    document.querySelector("#play-again").style.display = "none";

    boxes.forEach(e =>{
        e.innerHTML = "";
        e.style.removeProperty("background-color");
        e.style.color = "#fff"
    })
})


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
    updateScoresTable('tic-tac-toe');
}


// מטרת הפונקציה היא לעדכן את טבלת ההישגים של המשחק
// בהתאם להישגי המשתתפים במשחק עד כה
function updateScoresTable(gameName){

    const scoresTableBody = document.querySelector("#scores-table tbody");

    scoresTableBody.innerHTML = "";

    const scores = JSON.parse(localStorage.getItem('allScores')) || {};
    //let scoresGame = scores['tic-tac-toe'];
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