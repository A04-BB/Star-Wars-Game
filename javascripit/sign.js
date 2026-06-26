// user can sign-up
function signup(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const user = document.getElementById('user').value;
    const password = document.getElementById('password').value;
    const dob = document.getElementById('DOB').value;
    const phone = document.getElementById('phone').value;

    // password validation using a regular expression
    var passwordPattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordPattern.test(password)) {
        alert("Password must be at least 6 characters long and include one symbol, uppercase letters, and numbers.");
        return;
    }

    // minus todays date by 10 and set min date 10 years ago
    var today = new Date();
    var mindate = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());

    // decides if the date of birth meets the requirements
    var dobdate = new Date(dob);

    // checks if the date of birth is vaild
    if (dobdate > mindate) {
        alert("You must be at least 10 years old to sign up.");
        return;
    }
    
    // checks if the number is uk valid
    var ukPhonePattern = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
    if (!ukPhonePattern.test(phone)) {
        alert("Please enter a valid UK phone number.");
        return;
    }

   // how user data is stored
    const userData = {
        email: email,
        user: user,
        password: password,
        dob: dob,
        phone: phone
    };

    // retrieve the existing users from localStorage or create the array
    var users = JSON.parse(localStorage.getItem('users')) || [];

    // check if the username or email is already taken
    var userExists = users.some(u => u.user === user || u.email === email);
    if (userExists) {
        alert("Username or email already exists. Please choose a different one.");
        return;
    }

    // add the new user data to the users array
    users.push(userData);

    // save the users detail array back to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    alert("Sign-up successful! You can now log in.");
    console.log("User data saved:", userData);

    window.location.href = "login.html";
}


// user can login
function login(event) {
    event.preventDefault();

    const username = document.getElementById('loginuser').value;
    const password = document.getElementById('loginPassword').value;

    // retrieve the users array from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // find the user that matches the entered username and password
    const userData = users.find(user => user.user === username && user.password === password);

    if (userData) {
        alert("Login successful!");
        console.log("User logged in:", userData);

        // Save the logged in user to sessionStorage
        sessionStorage.setItem('user', userData.user);

        document.getElementById('loginLink').style.display = 'none';
        document.getElementById('loggedInUser').style.display = 'block';
        document.getElementById('username').textContent = userData.user;
        document.getElementById('logoutLink').style.display = 'block';

        window.location.href = "index.html";
    } else {
        alert("Invalid username or password. Please try again.");
    }
}

//checking login status and updates the dropdown
function checkLoginStatus() {
    const username = sessionStorage.getItem('user');

    const loginLink = document.getElementById("loginLink");
    const signUpLink = document.getElementById("signUpLink");
    const loggedInUser = document.getElementById("loggedInUser");
    const logoutLink = document.getElementById("logoutLink");
    const usernameSpan = document.getElementById("username");

    if (username) {
        loginLink.style.display = "none"; // hide login link
        signUpLink.style.display = "none";  // hide sign Up link
        loggedInUser.style.display = "block"; // show loggedinuser
        logoutLink.style.display = "block"; // show logoutlink
        usernameSpan.textContent = username; // shows username
    } else {
        loginLink.style.display = "block";  // show login link when logged out
        signUpLink.style.display = "block";  // show sign Up link when logged out
        loggedInUser.style.display = "none"; // hide loggedinuser link
        logoutLink.style.display = "none"; // hide logoutlink 
        usernameSpan.textContent = "";
    }
}


// log out
function logout() {
    // remove the logged in user from sessionStorage
    sessionStorage.removeItem('user');

    // update the function
    checkLoginStatus();

    alert("You have logged out.");

    window.location.href = "index.html";
}


function displayLeaderboard() {
    const leaderboardTable = document.getElementById('leaderboardTable');
    
    if (!leaderboardTable) {
        console.warn("Leaderboard table not found.");
        return;
    }
    
    const tbody = leaderboardTable.querySelector('tbody');
    tbody.innerHTML = ''; // clear previous leaderboard entries

    // retrieve scores from localStorage 
    let scores = JSON.parse(localStorage.getItem('scores')) || [];

    // Sort scores in descending order
    scores.sort((a, b) => b.score - a.score);

    // Display the top scores 
    scores.slice(0).forEach((entry, index) => {
        const row = tbody.insertRow();
        const rankCell = row.insertCell(0); 
        const usernameCell = row.insertCell(1); 
        const scoreCell = row.insertCell(2); 

        rankCell.textContent = "#" + (index + 1); //displays ranking
        usernameCell.textContent = entry.username; // displays username
        scoreCell.textContent = entry.score; // displays highest score
    });
}



window.onload = function () {
    checkLoginStatus();
    //check if there is data in the local storage for leaderboard
    if (document.getElementById('leaderboardTable')) {
        displayLeaderboard();
    }
};



