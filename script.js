/* =========================================
   LINKMART JAVASCRIPT
========================================= */


/* =========================================
   PRODUCT FLIP
========================================= */

const productCards = document.querySelectorAll(".product-card");

productCards.forEach(function(card) {

    const flipButton = card.querySelector(".flip-btn");
    const backButton = card.querySelector(".flip-back");

    flipButton.addEventListener("click", function(event) {

        event.stopPropagation();

        card.classList.add("flipped");

    });


    backButton.addEventListener("click", function(event) {

        event.stopPropagation();

        card.classList.remove("flipped");

    });

});



/* =========================================
   SEARCH
========================================= */

const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");

const productsSection = document.querySelector("#products");

const noProducts = document.querySelector("#noProducts");


function searchProducts() {

    const searchText =
        searchInput.value.toLowerCase().trim();


    let foundProducts = [];


    productCards.forEach(function(card) {

        const productName =
            card.dataset.name.toLowerCase();

        const category =
            card.dataset.category.toLowerCase();


        const matches =
            productName.includes(searchText) ||
            category.includes(searchText) ||
            searchText === "";


        if (matches) {

            card.style.display = "";

            foundProducts.push(card);

        } else {

            card.style.display = "none";

        }

    });


    /* ===============================
       NO RESULTS
    =============================== */

    if (foundProducts.length === 0) {

        noProducts.style.display = "block";

        return;

    }


    noProducts.style.display = "none";


    /* ===============================
       SCROLL TO PRODUCTS
    =============================== */

    productsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });


    /* ===============================
       HIGHLIGHT FIRST RESULT
    =============================== */

    if (searchText !== "") {

        foundProducts[0].style.outline =
            "3px solid #35ed87";


        setTimeout(function() {

            foundProducts[0].style.outline = "";

        }, 2000);

    }

}


/* Search button */

searchButton.addEventListener(
    "click",
    searchProducts
);


/* Search while typing */

searchInput.addEventListener(
    "input",
    function() {

        if (searchInput.value.trim() === "") {

            searchProducts();

        }

    }
);


/* Press ENTER */

searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            searchProducts();

        }

    }
);



/* =========================================
   CATEGORY FILTER
========================================= */

const categoryButtons =
    document.querySelectorAll(".category-btn");


categoryButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            const selectedCategory =
                button.dataset.category;


            let foundProducts = 0;


            productCards.forEach(function(card) {

                if (
                    card.dataset.category ===
                    selectedCategory
                ) {

                    card.style.display = "";

                    foundProducts++;

                } else {

                    card.style.display = "none";

                }

            });


            if (foundProducts === 0) {

                noProducts.style.display = "block";

            } else {

                noProducts.style.display = "none";

            }


            productsSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

});



/* =========================================
   VIEW ALL PRODUCTS
========================================= */

const viewAllButton =
    document.querySelector("#viewAllButton");


viewAllButton.addEventListener(
    "click",
    function() {

        productCards.forEach(function(card) {

            card.style.display = "";

        });


        noProducts.style.display = "none";


        productsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);



/* =========================================
   BROWSE PRODUCTS
========================================= */

const browseButton =
    document.querySelector("#browseButton");


browseButton.addEventListener(
    "click",
    function() {

        productsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);



/* =========================================
   JOIN LINKMART
========================================= */

const joinButton =
    document.querySelector("#joinButton");


joinButton.addEventListener(
    "click",
    function() {

        alert(
            "Welcome to LinkMart!\n\nRegistration will be connected to the real account system later."
        );

    }
);



/* =========================================
   LOGIN
========================================= */

const loginButton =
    document.querySelector(".login-btn");


loginButton.addEventListener(
    "click",
    function() {

        alert(
            "Login system coming next.\n\nLater you will be able to choose:\n\n• Supplier\n• Affiliate Marketer\n• Trader / Reseller\n• Customer"
        );

    }
);

/* =========================================
   SIGN UP
========================================= */

const signupButton = document.querySelector(".signup-btn");

if (signupButton) {

    signupButton.addEventListener("click", function () {

        window.location.href = "signup.html";

    });

}



/* =========================================
   HERO PRODUCT
========================================= */

const heroProductButton =
    document.querySelector(".hero-product-btn");


heroProductButton.addEventListener(
    "click",
    function() {

        searchInput.value = "earbuds";

        searchProducts();

    }
);



/* =========================================
   PRODUCT PAGE
========================================= */

const productButtons =
    document.querySelectorAll(".product-btn");


productButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            const card =
                button.closest(".product-card");


            const productName =
                card.dataset.name;


            window.location.href =
                "product.html?product=" +
                encodeURIComponent(productName);

        }
    );

});





/* =========================================
   BUSINESS BUTTONS
========================================= */

const businessButtons =
    document.querySelectorAll(".business-card button");


businessButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            alert(
                "This section will become a real LinkMart account and dashboard later."
            );

        }
    );

});



/* =========================================
   FOOTER BUTTON
========================================= */

const footerButton =
    document.querySelector(".footer-btn");


footerButton.addEventListener(
    "click",
    function() {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);



/* =========================================
   PAGE START
========================================= */

console.log(
    "LinkMart marketplace loaded successfully."
);
function searchProducts() {

    const search =
        document.getElementById("searchInput");

    if (!search) return;

    const value =
        search.value.trim();

    if (value === "") {

        alert("Please enter a product name.");

        return;

    }

    window.location.href =
        "products.html?search=" +
        encodeURIComponent(value);

}
// ==========================================
// COLOMONATI ACCOUNT SELECTION
// ==========================================

let selectedAccountType = "";

function selectAccount(role) {

    selectedAccountType = role;

    const registrationForm = document.getElementById("registrationForm");
    const selectedAccount = document.getElementById("selectedAccount");

    const accountNames = {
        supplier: "Supplier",
        affiliate: "Affiliate Marketer",
        trader: "Trader / Reseller",
        customer: "Customer"
    };

    if (selectedAccount) {
        selectedAccount.textContent =
            "You are creating a " + accountNames[role] + " account.";
    }

    if (registrationForm) {
        registrationForm.style.display = "block";

        registrationForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

}