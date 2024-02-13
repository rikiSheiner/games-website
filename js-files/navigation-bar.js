document.getElementById("logout-btn").addEventListener("click", logout);
//window.addEventListener('beforeunload', logout);



// מטרת הפונקציה היא לתעד את זמן ההתנתקות של המשתמש 
// ולהעביר את המשתמש לעמוד ההתחברות
function logout() {
    const now = getTimeIsrael();

    const times = JSON.parse(localStorage.getItem('logInOutTimes')) || {};


    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (times[currentUser.username]) {
        times[currentUser.username].logoutTimes.push(now);
        localStorage.setItem('logInOutTimes', JSON.stringify(times));

        console.log("המשתמש " + currentUser.username + " התנתק");

        // ניווט לעמוד ההתחברות
        window.location.href = "/html-files/login.html";
    } else {
        console.log("המשתמש " + currentUser.username + " לא התחבר.");    
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