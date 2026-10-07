// ==========================================
// COLOMONATI ACCOUNT SELECTION & SIGNUP
// ==========================================

let selectedAccountType = "";


// ==========================================
// SELECT ACCOUNT TYPE
// ==========================================

function selectAccount(role) {

    selectedAccountType = role;

    // Save the selected account type
    localStorage.setItem("linkmartRole", role);

    const registrationForm =
        document.getElementById("registrationForm");

    const selectedAccount =
        document.getElementById("selectedAccount");

    const accountNames = {
        supplier: "Supplier",
        affiliate: "Affiliate Marketer",
        trader: "Trader / Reseller",
        customer: "Customer"
    };

    // Update the message
    if (selectedAccount) {

        selectedAccount.textContent =
            "You are creating a " +
            accountNames[role] +
            " account.";

    }

    // Show registration form
    if (registrationForm) {

        registrationForm.style.display = "block";

        registrationForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// ==========================================
// REGISTER USER
// ==========================================

async function registerUser(event) {

    event.preventDefault();

    const firstName =
        document.getElementById("firstName").value.trim();

    const lastName =
        document.getElementById("lastName").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const role =
        localStorage.getItem("linkmartRole");


    // Make sure an account type was selected

    if (!role) {

        alert("Please choose an account type first.");

        return;

    }


    // Check passwords

    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;

    }


    try {

        const response = await fetch(
            "/api/auth/register",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    firstName,
                    lastName,
                    email,
                    phone,
                    password,
                    role

                })

            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.message);

            return;

        }


        alert(
            "Account created successfully!"
        );


        // Send user to login

        window.location.href =
            "login.html";


    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to COLOMONATI server."
        );

    }

}


// ==========================================
// CONNECT REGISTRATION FORM
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const signupForm =
            document.getElementById("signupForm");


        if (signupForm) {

            signupForm.addEventListener(
                "submit",
                registerUser
            );

        }

    }
);