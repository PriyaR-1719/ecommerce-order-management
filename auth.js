async function registerUser() {

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("message");


    if (!name || !email || !password) {

        message.textContent =
            "Please fill all fields.";

        return;
    }


    try {

        const user = await apiRequest(
            "/api/auth/register",
            {
                method: "POST",

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            }
        );


        message.textContent =
            `Registration successful! Welcome ${user.name}.`;


        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 1000);


    } catch (error) {

        message.textContent =
            error.message;
    }
}



async function loginUser() {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("message");


    if (!email || !password) {

        message.textContent =
            "Please enter email and password.";

        return;
    }


    try {

        const data = await apiRequest(
            "/api/auth/login",
            {
                method: "POST",

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        localStorage.setItem(
            "access_token",
            data.access_token
        );


        message.textContent =
            "Login successful!";


        setTimeout(() => {

            window.location.href =
                "products.html";

        }, 800);


    } catch (error) {

        message.textContent =
            error.message;
    }
}



function logoutUser() {

    localStorage.removeItem(
        "access_token"
    );

    window.location.href =
        "login.html";
}



function isLoggedIn() {

    return !!localStorage.getItem(
        "access_token"
    );
}