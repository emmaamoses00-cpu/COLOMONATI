/* =========================================
   COLOMONATI LOGIN
========================================= */

const loginForm = document.querySelector("#loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email =
            document.querySelector("#loginEmail").value.trim();

        const password =
            document.querySelector("#loginPassword").value;

        const passwordInput =
            document.querySelector("#loginPassword");


        // Remove previous error

        const oldError =
            document.querySelector("#loginError");

        if (oldError) {
            oldError.remove();
        }


        if (!email || !password) {

            showLoginError("Please enter your email and password.");

            return;

        }


        try {

            const response = await fetch(
                "/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                showLoginError(
                    "Incorrect email or password."
                );

                passwordInput.focus();

                return;
            }


            // Save login information

            localStorage.setItem(
                "linkmartToken",
                data.token
            );

            localStorage.setItem(
                "linkmartUser",
                JSON.stringify(data.user)
            );

            localStorage.setItem(
                "linkmartLoggedIn",
                "true"
            );


            alert(
                "Welcome back, " +
                data.user.firstName +
                "!"
            );


            // Send user to correct dashboard

            switch (data.user.role) {

                case "supplier":
                    window.location.href =
                        "dashboard-supplier.html";
                    break;

                case "affiliate":
                    window.location.href =
                        "dashboard-affiliate.html";
                    break;

                case "trader":
                    window.location.href =
                        "dashboard-trader.html";
                    break;

                case "customer":
                    window.location.href =
                        "dashboard-customer.html";
                    break;

                default:
                    window.location.href =
                        "index.html";
            }


        } catch (error) {

            console.error("Login error:", error);

            showLoginError(
                "Unable to connect to the server. Please try again."
            );

        }

    });

}


/* =========================================
   SHOW LOGIN ERROR
========================================= */

function showLoginError(message) {

    const passwordInput =
        document.querySelector("#loginPassword");

    if (!passwordInput) return;


    const error =
        document.createElement("div");

    error.id = "loginError";

    error.textContent = message;

    error.style.color = "#d93025";
    error.style.fontSize = "14px";
    error.style.marginTop = "6px";
    error.style.fontWeight = "500";


    passwordInput.insertAdjacentElement(
        "afterend",
        error
    );

}