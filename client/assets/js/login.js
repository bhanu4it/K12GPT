
function showSignup() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

function showLogin() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('login-container').style.display = 'block';
}

function toggleWorkFields() {
    const workFields = document.getElementById('work-fields');
    workFields.style.display = document.getElementById('working').checked ? 'block' : 'none';
}
function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (input.type === "password") {
        input.type = "text";
        icon.src = "eye-icon.jpg"; 
    } else {
        input.type = "password";
        icon.src = "eye-icon.jpg"; 
    }
}

let generatedOTP;
async function login(event) {
    event.preventDefault();
    const loginInput = document.getElementById("login-input").value;
    const password = document.getElementById("password").value;

    if (!loginInput) {
        alert("Please enter your Email or Mobile.");
        return;
    }

    if (!password) {
        alert("Please enter your password or use OTP login.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3001/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier: loginInput, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login Successful!");

           
            localStorage.setItem("authToken", data.token);

       
            window.location.href = "index.html";
        } else {
            alert(data.message || "Invalid credentials, try again!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
}


async function sendOTP() {
    const userInput = document.getElementById("login-input").value;
    if (!userInput) {
        alert("Please enter your Email or Mobile.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3001/auth/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier: userInput }),
        });

        const data = await response.json();
        if (response.ok) {
            generatedOTP = data.otp; 
            console.log("Generated OTP:", generatedOTP); 
            document.getElementById("otp-popover").style.display = "block";
            document.getElementById("overlay").style.display = "block";
        } else {
            alert(data.message || "Failed to send OTP. Try again!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
}


async function verifyOTP() {
    const userInput = document.getElementById("login-input").value;
    const enteredOTP = document.getElementById("otp-input").value;

    if (!userInput || !enteredOTP) {
        alert("Please enter your Email/Mobile and OTP.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3001/auth/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier: userInput, otp: enteredOTP }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Login Successful!");
            // closePopover();
            showLogin();
         
        } else {
            alert(data.message || "Invalid OTP. Try again!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
}


function closePopover() {
    document.getElementById("otp-popover").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}



async function signup(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    const gender = document.getElementById("gender").value;
    const dob = document.getElementById("dob").value;
    const qualification = document.getElementById("qualification").value;
    const isWorking = document.getElementById("working").checked;
    const department = isWorking ? document.getElementById("department").value : "";
    const experience = isWorking ? document.getElementById("experience").value : "";
    const description = document.getElementById("description").value;


    if (!name || !mobile || !email || !dob || !qualification || !description) {
        alert("Please fill in all required fields.");
        return;
    }

    const signupData = {
        name,
        mobile,
        email,
        password,
        gender,
        dob,
        qualification,
        isWorking,
        department,
        experience,
        description,
    };

    try {
        const response = await fetch("http://localhost:3001/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signupData),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Signup Successful! Please login.");
            showLogin(); 
        } else {
            alert(data.message || "Signup failed. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
}
