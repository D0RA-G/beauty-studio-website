const bookingForm = document.getElementById("bookingForm");
const bookingMessage = document.getElementById("bookingMessage");

bookingForm.addEventListener("submit", function(event){
    event.preventDefault();
    bookingMessage.textContent = "Your appoiment request has been sent."
    bookingMessage.style.color = "#4CAF50";
    bookingMessage.style.marginTop = "15px";
    bookingForm.reset();
});

document.addEventListener("DOMContentLoaded", function() {

    const cartButtons = document.querySelectorAll(".add-to-cart");
    const cartMessage = document.getElementById("cartMessage");

    cartButtons.forEach(button => {
        button.addEventListener("click", function() {
            const productName = this.dataset.product;

            cartMessage.textContent = productName + " added to cart!";
            cartMessage.style.color = "#4CAF50";
            cartMessage.style.marginTop = "20px";
        });
    });
});