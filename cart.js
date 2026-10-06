/* =========================================
   LINKMART CART
========================================= */


/* =========================================
   GET CART
========================================= */

let cart =
    JSON.parse(
        localStorage.getItem("linkmartCart")
    ) || [];


/* =========================================
   CLEAN OLD / BROKEN CART ITEMS
========================================= */

cart = cart.filter(function(item) {

    return (
        item &&
        item.name &&
        item.price !== undefined &&
        item.quantity > 0
    );

});


/* =========================================
   ELEMENTS
========================================= */

const cartItems =
    document.querySelector("#cartItems");

const emptyCart =
    document.querySelector("#emptyCart");

const cartSummary =
    document.querySelector("#cartSummary");

const cartItemCount =
    document.querySelector("#cartItemCount");

const cartSubtotal =
    document.querySelector("#cartSubtotal");

const cartTotal =
    document.querySelector("#cartTotal");

const checkoutButton =
    document.querySelector("#checkoutButton");


/* =========================================
   DISPLAY CART
========================================= */

function displayCart() {

    if (!cartItems) {

        return;

    }


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        if (emptyCart) {

            emptyCart.style.display =
                "block";

        }

        if (cartSummary) {

            cartSummary.style.display =
                "none";

        }

        if (cartItemCount) {

            cartItemCount.textContent =
                "0";

        }

        return;

    }


    if (emptyCart) {

        emptyCart.style.display =
            "none";

    }


    if (cartSummary) {

        cartSummary.style.display =
            "block";

    }


    let total = 0;

    let totalItems = 0;


    cart.forEach(
        function(item, index) {

            const price =
                Number(item.price) || 0;


            const quantity =
                Number(item.quantity) || 1;


            const itemTotal =
                price * quantity;


            total += itemTotal;

            totalItems += quantity;


            const cartItem =
                document.createElement("div");


            cartItem.className =
                "cart-item";


            cartItem.innerHTML = `

                <div class="cart-product-image">
                    ${item.image || "🛍️"}
                </div>


                <div class="cart-product-info">

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        ${item.category || "Product"}
                    </p>

                    <strong>
                        $${price.toFixed(2)}
                    </strong>

                </div>


                <div class="cart-quantity">

                    <button
                        onclick="changeQuantity(${index}, -1)">
                        −
                    </button>

                    <span>
                        ${quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${index}, 1)">
                        +
                    </button>

                </div>


                <div class="cart-item-total">

                    <strong>
                        $${itemTotal.toFixed(2)}
                    </strong>

                    <button
                        class="remove-cart"
                        onclick="removeItem(${index})">

                        Remove

                    </button>

                </div>

            `;


            cartItems.appendChild(
                cartItem
            );

        }
    );


    if (cartItemCount) {

        cartItemCount.textContent =
            totalItems;

    }


    if (cartSubtotal) {

        cartSubtotal.textContent =
            "$" + total.toFixed(2);

    }


    if (cartTotal) {

        cartTotal.textContent =
            "$" + total.toFixed(2);

    }


    /* Save cleaned cart */

    saveCart();

}


/* =========================================
   CHANGE QUANTITY
========================================= */

function changeQuantity(
    index,
    amount
) {

    if (!cart[index]) {

        return;

    }


    cart[index].quantity =
        Number(cart[index].quantity) +
        amount;


    if (
        cart[index].quantity <= 0
    ) {

        cart.splice(index, 1);

    }


    saveCart();

    displayCart();

}


/* =========================================
   REMOVE ITEM
========================================= */

function removeItem(index) {

    if (!cart[index]) {

        return;

    }


    cart.splice(index, 1);


    saveCart();

    displayCart();

}


/* =========================================
   SAVE CART
========================================= */

function saveCart() {

    localStorage.setItem(
        "linkmartCart",
        JSON.stringify(cart)
    );

}


/* =========================================
   CHECKOUT
========================================= */

if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        function() {

            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            alert(
                "Checkout will be connected to the real order and payment system later."
            );

        }
    );

}


/* =========================================
   START
========================================= */

displayCart();