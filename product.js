/* =========================================
   LINKMART PRODUCT SYSTEM
========================================= */


/* =========================================
   PRODUCT DATABASE
========================================= */

const products = {

    "Wireless Earbuds": {

        name: "Wireless Earbuds",
        category: "Electronics",
        image: "🎧",
        badge: "Bestseller",
        wholesale: 18,
        selling: 24.99,

        description:
            "Wireless Bluetooth earbuds with a charging case. A popular product suitable for online marketers, traders and resellers."

    },


    "Running Shoes": {

        name: "Running Shoes",
        category: "Fashion",
        image: "👟",
        badge: "Hot Deal",
        wholesale: 25,
        selling: 32.50,

        description:
            "Comfortable and stylish running shoes designed for everyday use, sports and casual wear."

    },


    "Smart Watch": {

        name: "Smart Watch Pro",
        category: "Electronics",
        image: "⌚",
        badge: "Top Rated",
        wholesale: 35,
        selling: 45,

        description:
            "A modern smart watch with fitness tracking and smart features suitable for everyday users."

    },


    "Skincare Set": {

        name: "Skincare Set",
        category: "Beauty",
        image: "🧴",
        badge: "Trending",
        wholesale: 12,
        selling: 18.99,

        description:
            "A complete skincare collection designed for daily personal care and beauty routines."

    }

};


/* =========================================
   GET PRODUCT FROM URL
========================================= */

const urlParams =
    new URLSearchParams(window.location.search);

const productName =
    urlParams.get("product");


/* =========================================
   FIND PRODUCT
========================================= */

const product =
    products[productName];


/* =========================================
   PAGE ELEMENTS
========================================= */

const productImage =
    document.querySelector("#productImage");

const productBadge =
    document.querySelector("#productBadge");

const productCategory =
    document.querySelector("#productCategory");

const productNameElement =
    document.querySelector("#productName");

const productDescription =
    document.querySelector("#productDescription");

const wholesalePrice =
    document.querySelector("#wholesalePrice");

const sellingPrice =
    document.querySelector("#sellingPrice");

const profitPrice =
    document.querySelector("#profitPrice");


/* =========================================
   DISPLAY PRODUCT
========================================= */

if (product) {

    if (productImage) {
        productImage.textContent =
            product.image;
    }

    if (productBadge) {
        productBadge.textContent =
            product.badge;
    }

    if (productCategory) {
        productCategory.textContent =
            product.category;
    }

    if (productNameElement) {
        productNameElement.textContent =
            product.name;
    }

    if (productDescription) {
        productDescription.textContent =
            product.description;
    }

    if (wholesalePrice) {
        wholesalePrice.textContent =
            "$" + product.wholesale.toFixed(2);
    }

    if (sellingPrice) {
        sellingPrice.textContent =
            "$" + product.selling.toFixed(2);
    }


    const profit =
        product.selling - product.wholesale;

    if (profitPrice) {
        profitPrice.textContent =
            "$" + profit.toFixed(2);
    }


    document.title =
        product.name + " | LinkMart";

}


/* =========================================
   PRODUCT NOT FOUND
========================================= */

else {

    if (productNameElement) {

        productNameElement.textContent =
            "Product Not Found";

    }

    if (productDescription) {

        productDescription.textContent =
            "Sorry, this product could not be found.";

    }

}


/* =========================================
   QUANTITY
========================================= */

let quantity = 1;


const quantityDisplay =
    document.querySelector("#quantity");

const plusButton =
    document.querySelector("#plusButton");

const minusButton =
    document.querySelector("#minusButton");


if (plusButton) {

    plusButton.addEventListener(
        "click",
        function() {

            quantity++;

            if (quantityDisplay) {

                quantityDisplay.textContent =
                    quantity;

            }

        }
    );

}


if (minusButton) {

    minusButton.addEventListener(
        "click",
        function() {

            if (quantity > 1) {

                quantity--;

                if (quantityDisplay) {

                    quantityDisplay.textContent =
                        quantity;

                }

            }

        }
    );

}


/* =========================================
   ADD TO CART
========================================= */

const addCartButton =
    document.querySelector("#addCartButton");


if (addCartButton) {

    addCartButton.addEventListener(
        "click",
        function(event) {

             event.preventDefault();

            if (!product) {

                alert(
                    "This product could not be added because it was not found."
                );

                return;

            }


            let cart =
                JSON.parse(
                    localStorage.getItem("linkmartCart")
                ) || [];


            const existingProduct =
                cart.find(function(item) {

                    return item.name === product.name;

                });


            if (existingProduct) {

                existingProduct.quantity += quantity;

            }

            else {

                cart.push({

                    name: product.name,

                    category: product.category,

                    image: product.image,

                    price: Number(product.selling),

                    quantity: quantity

                });

            }


            
        localStorage.setItem(
    "linkmartCart",
    JSON.stringify(cart)
);

showCartSuccess(product.name);

        }
    );

}


/* =========================================
   AFFILIATE BUTTON
========================================= */

const affiliateButton =
    document.querySelector("#affiliateButton");


if (affiliateButton) {

    affiliateButton.addEventListener(
        "click",
        function() {

            if (!product) {

                return;

            }


            const profit =
                product.selling -
                product.wholesale;


            alert(

                "Affiliate Opportunity\n\n" +

                product.name +

                "\n\n" +

                "Suggested selling price: $" +
                product.selling.toFixed(2) +

                "\n\n" +

                "Potential margin: $" +
                profit.toFixed(2) +

                "\n\n" +

                "The real affiliate link system will be connected later."

            );

        }
    );

}


/* =========================================
   SEARCH FILTER
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const search =
            params.get("search");


        if (!search) {

            return;

        }


        const cards =
            document.querySelectorAll(
                ".flip-card"
            );


        cards.forEach(
            function(card) {

                const text =
                    card.innerText.toLowerCase();


                if (
                    !text.includes(
                        search.toLowerCase()
                    )
                ) {

                    card.style.display =
                        "none";

                }

            }
        );

    }
);
/* =========================================
   PROFESSIONAL CART SUCCESS MODAL
========================================= */

function showCartSuccess(productName) {

    /* Create modal */

    const modal =
        document.createElement("div");

    modal.className =
        "cart-success-overlay";


    modal.innerHTML = `

        <div class="cart-success-modal">

            <button
                class="cart-success-close"
                id="cartSuccessClose">
                ×
            </button>


            <div class="cart-success-icon">
                ✓
            </div>


            <h2>
                Added to Cart
            </h2>


            <p>
                <strong>${productName}</strong>
                has been added to your cart successfully.
            </p>


            <div class="cart-success-actions">

                <button
                    class="continue-shopping-btn"
                    id="continueShoppingBtn">

                    Continue Shopping

                </button>


                <button
                    class="view-cart-btn"
                    id="viewCartBtn">

                    View Cart

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    /* Close button */

    document
        .querySelector("#cartSuccessClose")
        .addEventListener(
            "click",
            function() {

                modal.remove();

            }
        );


    /* Continue shopping */

    document
        .querySelector("#continueShoppingBtn")
        .addEventListener(
            "click",
            function() {

                modal.remove();

            }
        );


    /* View cart */

    document
        .querySelector("#viewCartBtn")
        .addEventListener(
            "click",
            function() {

                window.location.href =
                    "cart.html";

            }
        );


    /* Close when clicking outside */

    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === modal
            ) {

                modal.remove();

            }

        }
    );

}
/* =========================================
   WHATSAPP PRODUCT BUTTON
========================================= */

const whatsappButton =
    document.querySelector("#whatsappButton");

if (whatsappButton && product) {

    const phoneNumber = "211927712527";

    const message =
        "Hello LinkMart, I am interested in " +
        product.name +
        ". Is this product available?";

    whatsappButton.href =
        "https://wa.me/" +
        phoneNumber +
        "?text=" +
        encodeURIComponent(message);

}