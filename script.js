document.addEventListener("DOMContentLoaded", function () {
    // Booking
    const bookingForm = document.getElementById("bookingForm");
    const bookingMessage = document.getElementById("bookingMessage");
    const serviceSelect = document.getElementById("serviceSelect");

    const params = new URLSearchParams(window.location.search);
    const selectedService = params.get("service");

    if (selectedService && serviceSelect) {
        serviceSelect.value = selectedService;
    }

    if (bookingForm && bookingMessage) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault();

            bookingMessage.textContent = "Your appointment request has been booked successfully.";
            bookingMessage.style.color = "#4CAF50";
            bookingMessage.style.marginTop = "15px";

            bookingForm.reset();
        });
    }

    // Shop
    const cartButtons = document.querySelectorAll(".add-to-cart");
    const cartMessage = document.getElementById("cartMessage");
    const cartCount = document.getElementById("cartCount");
    const navCartCount = document.getElementById("navCartCount");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartCount() {
        if (cartCount){
            if (cart.length === 1){
                cartCount.textContent = "Cart: 1 item";
            } else{
                cartCount.textContent = "Cart :" + cart.length + " items";
            }
        }

        if (navCartCount){
            navCartCount.textContent = cart.length;
        }
    }

    updateCartCount();

    if (cartButtons.length > 0) {
        cartButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                const productName = this.dataset.product;
                const productPrice = this.dataset.price;

                const product = {
                    name: productName,
                    price: productPrice
                };

                cart.push(product);
                localStorage.setItem("cart", JSON.stringify(cart));

                if (cartMessage) {
                    cartMessage.textContent = productName + " added to cart!";
                    cartMessage.style.color = "#4CAF50";
                    cartMessage.style.marginTop = "20px";
                    cartMessage.style.fontWeight = "bold";
                }

                updateCartCount();

                this.textContent = "Added";
                this.disabled = true;
                this.style.opacity = "0.7"

                setTimeout(() => {
                    this.textContent = "Add to Cart";
                    this.disabled = false;
                    this.style.opacity = "1";
                }, 2000);
            });
        });
    }

    // Checkout
    const checkoutItems = document.getElementById("checkoutItems");
    const checkoutTotal = document.getElementById("checkoutTotal");
    const checkoutForm = document.getElementById("checkoutForm");
    const checkoutMessage = document.getElementById("checkoutMessage");
    const clearCartBtn = document.getElementById("clearCartBtn");
    const itemsCount = document.getElementById("itemsCount");

    function updateCheckoutState(){
        if (!placeOrderBtn) return;

        placeOrderBtn.disabled = cart.length === 0;
        placeOrderBtn.style.opacity = cart.length === 0 ? "0.6" : "1";
        placeOrderBtn.style.cursor = cart.length === 0 ? "not-allowed" : "pointer";
    }

    function renderCheckout() {
        if (!checkoutItems || !checkoutTotal) return;

        let total = 0;
        checkoutItems.innerHTML = "";

        if (itemsCount){
            itemsCount.textContent = "Items: " + cart.length;
        }

        if (cart.length === 0) {
            checkoutItems.innerHTML = "<p>Your cart is empty.</p>";
            checkoutTotal.textContent = "";
            return;
        }

        const groupedCart = {};

        cart.forEach(function (item) {
            if (groupedCart[item.name]){
                groupedCart[item.name].quantity += 1;
            } else{
                groupedCart[item.name]={
                    price: Number(item.price),
                    quantity: 1
                };
            }
        });

        Object.entries(groupedCart).forEach(function([name, details]) {
            const div = document.createElement("div");
            div.classList.add("checkout-item");
            
            div.innerHTML = `
                <span>${name}</span>

                <div class="quantity-controls">
                    <button class="decrease-btn" data-name="${name}">-</button>
                    <span>${details.quantity}</span>
                    <button class="increase-btn" data-name="${name}">+</button>
                </div>

                <span>${details.price * details.quantity} DKK</span>
            `;
            checkoutItems.appendChild(div);

            total += details.price * details.quantity;
        });

        checkoutTotal.textContent = "Total: " + total + " DKK";

        // + button
        const increaseButtons = document.querySelectorAll(".increase-btn");
        increaseButtons.forEach(button => {
            button.addEventListener("click", function(){
                const name = this.dataset.name;

                const item = cart.find(p => p.name === name);
                if (item) {
                    cart.push(item);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    updateCartCount();
                    renderCheckout();
                }
            });
        });

        // - button
        const decreaseButtons = document.querySelectorAll(".decrease-btn");
        decreaseButtons.forEach(button => {
            button.addEventListener("click", function(){
                const name = this.dataset.name;

                const index = cart.findIndex(p => p.name === name);
                if (index !== -1) {
                    cart.splice(index, 1);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    updateCartCount();
                    renderCheckout();
                }
            });
        });

        const removeButtons = document.querySelectorAll(".remove-item-btn");
        removeButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                const itemIndex = Number(this.dataset.index);
                cart.splice(itemIndex, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                renderCheckout();
            });
        });
    }

    renderCheckout();
    updateCheckoutState();

    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", function () {
            cart = [];
            localStorage.removeItem("cart");
            updateCartCount();
            renderCheckout();
            updateCheckoutState();
        });
    }

    if (checkoutForm && checkoutMessage) {
        checkoutForm.addEventListener("submit", function (event) {
            event.preventDefault();

            checkoutMessage.textContent = "Thank you! Your order has been received. We will contact you shortly.";
            checkoutMessage.style.color = "#4CAF50";
            checkoutMessage.style.marginTop = "15px";

            localStorage.removeItem("cart");
            cart = [];

            checkoutForm.reset();
            updateCartCount();
            renderCheckout();
            updateCheckoutState();
        });
    }

  
});