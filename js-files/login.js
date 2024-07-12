
let loginBtn = document.getElementById('login-btn');
loginBtn.addEventListener('click', logIn);

let exist;


let retryTimer = document.getElementById('retry-timer');
let countLoginFailure = 0;

var form = document.getElementById('login-form');
form.onsubmit = function () {
    if(exist) form.action = '/index.html';
    else form.action = '';
};

// המשתמש יהיה חסום לדקה
const BLOCK_TIME = 60000; 


function logIn() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let usersDetails = JSON.parse(localStorage.getItem('usersDetails')) || [];
    
    let currentUser = null;

    exist = usersDetails.length && 
    JSON.parse(localStorage.getItem('usersDetails'))
        .some(data => 
            {
                if(data.username.toLowerCase() == username && data.password.toLowerCase() == password){
                    currentUser = data;
                    return true;
                }
            }
        );

    const blockedUntil = localStorage.getItem('blockedUntil');
    if (blockedUntil && new Date().getTime() < Number(blockedUntil)) {
        alert('נחסמת לאחר מספר ניסיונות כושלים. אנא נסה שנית מאוחר יותר.');
        return;
    }

    
    if(!exist){
        let failedAttempts = parseInt(localStorage.getItem('failedLoginAttempts') || '0');
        failedAttempts++;

        if (failedAttempts >= 3) {
            // חסימת המשתמש אחרי 3 ניסיונות התחברות כושלים
            const now = new Date().getTime();
            // עדכון הזמן שבו תפוג חסימת המשתמש
            localStorage.setItem('blockedUntil', now + BLOCK_TIME);
            alert('נחסמת למשך דקה לאחר 3 ניסיונות כושלים.');
            // איפוס המונה של ניסיונות כושלים
            // כדי שאחרי שהחסימה תתבטל המניה תתחיל מחדש
            localStorage.setItem('failedLoginAttempts', '0');
        } 
        else {
            // הגדלת המונה של מספר הניסיונות הכושלים
            localStorage.setItem('failedLoginAttempts', failedAttempts.toString());
            alert(`פרטי התחברות שגויים. נותרו ${3 - failedAttempts} ניסיונות.`);
        }
    }
    else{
        //alert("ההתחברות בוצעה בהצלחה");

        // תיעוד שעת הכניסה של המשתמש לאתר
        const now = getTimeIsrael();
        const logInOutTimes = JSON.parse(localStorage.getItem('logInOutTimes')) || {};
        
        // בדיקה האם המשתמש לא ביצע בעבר התחברות לאתר
        if (!logInOutTimes[username]) {
            // יצירת רשומה חדשה של זמני כניסה ויציאה עבור משתמש זה
            logInOutTimes[username] = { loginTimes: [], logoutTimes: [] };
        }

        // עדכון רשימת זמני הניסה של המשתמש
        logInOutTimes[username].loginTimes.push(now);
        localStorage.setItem('logInOutTimes', JSON.stringify(logInOutTimes));

        console.log("המשתמש " + username + " התחבר " + now + ".");

        // עדכון המתשתמש הנוכחי באתר
        localStorage.setItem("currentUser", JSON.stringify(currentUser));


        // שמירה של מועד ההתחברות האחרון בעוגיה של משתמש זה 
        setOrUpdateUserCookie(username);
    }
}

function getTimeIsrael(){
    let now = new Date();

    let formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Jerusalem',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    let timeInIsrael = formatter.format(now);
    return timeInIsrael
}

function setOrUpdateUserCookie(username) {
    const now = new Date();
    const lastLoginTime = getCookie(username); 

    if (lastLoginTime !== "") {
        alert(`ברוך שובך ${username} ! ההתחברות האחרונה שלך הייתה ב: ${lastLoginTime}`);
    } else {
        alert(`ברוך הבא ${username} ! .זו ההתחברות הראשונה שלך`);
    }

    setCookie(username,getTimeIsrael(),30);
}

function setCookie(cname, cvalue, exdays) {
    const d = getTimeIsrael();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = `${cname}=${encodeURIComponent(cvalue)};${expires};path=/`;
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
