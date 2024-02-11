let signupBtn = document.getElementById('signup-btn');

signupBtn.addEventListener('click', signUp);


function signUp(){
    let username = document.getElementById('username').value,
        email = document.getElementById('email').value,
        password = document.getElementById('password').value;

    let usersDetails = JSON.parse(localStorage.getItem('usersDetails')) || [];

    let exist = usersDetails.length && 
        JSON.parse(localStorage.getItem('usersDetails')).some(data => 
            data.username.toLowerCase() == username.toLowerCase());

    if(!exist){
        console.log("החשבון נוצר בהצלחה");

        usersDetails.push({ username, email, password });
        localStorage.setItem('usersDetails', JSON.stringify(usersDetails));
        document.querySelector('form').reset();
        document.getElementById('username').focus();

        alert("החשבון נוצר בהצלחה. \n\n בבקשה התחבר באמצעות הקישור שלמטה ")
    }
    else{
        alert("אופס... נמצאה כפילות!!!  אתה כבר רשום")
    }
}