const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));
const product = products.find(item => item.id === productId);

const productTitle = document.getElementById("product-title");
const productPrice = document.getElementById("product-price");
const productOldPrice = document.getElementById("product-old-price");
const productReviews = document.getElementById("product-reviews");
const productDescription = document.getElementById("product-description");

const productStars = document.getElementById("product-stars");
const breadcrumbProduct = document.querySelector(".breadcrumb span");
const mainImage = document.getElementById("mainImage");
const thumbnailContainer = document.getElementById("thumbnailContainer");

const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");
const wishlistBtn = document.getElementById("wishlist-btn");
const toggle = document.getElementById("toggle");
const cartCount = document.getElementById("cart-count");
const addToCartBtn = document.querySelector(".button-group .cart-btn");
const buyNowBtn = document.querySelector(".button-group .buy-btn");

function updateCartCount(count) {
    localStorage.setItem("cartCount", String(count));
    if (cartCount) {
        cartCount.innerText = count;
    }
}

updateCartCount(Number(localStorage.getItem("cartCount")) || 0);

if (!product) {
    document.body.innerHTML = `
    <h1 style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:Poppins;">
      Product Not Found
    </h1>`;
    throw new Error("Product not found");
}

productTitle.innerText = product.name;
productPrice.innerText = `$${product.price.toFixed(2)}`;

if (product.oldPrice) {
    productOldPrice.innerText = `$${product.oldPrice.toFixed(2)}`;
} else {
    productOldPrice.innerText = "";
}

productReviews.innerText = `${product.reviews} Reviews`;
productDescription.innerText = product.description;

mainImage.src = product.image;

if (breadcrumbProduct) {
    breadcrumbProduct.innerText = product.name;
}

let starsHTML = "";

for (let i = 1; i <= 5; i++) {
    if (i <= product.rating) {
        starsHTML += `<i class="fa-solid fa-star"></i>`;
    } else {
        starsHTML += `<i class="fa-regular fa-star"></i>`;
    }
}

productStars.innerHTML = starsHTML;
thumbnailContainer.innerHTML = "";

const productImages =
    product.thumbnails && product.thumbnails.length > 0
        ? product.thumbnails
        : [product.image];

productImages.forEach(
    (image, index) => {
        thumbnailContainer.innerHTML += `
      <img src="${image}" alt="${product.name} thumbnail ${index + 1}" class="thumbnail ${index === 0 ? "active-thumb" : ""}"/>`;
    }
);

const thumbnails = document.querySelectorAll(".thumbnail");

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener("click", () => {
        mainImage.src = thumbnail.src;
        thumbnails.forEach(item => item.classList.remove("active-thumb")
        );
        thumbnail.classList.add("active-thumb");
    }
    );
});

tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        const target = button.dataset.tab;
        tabButtons.forEach(btn => btn.classList.remove("active-tab"));
        tabPanels.forEach(panel => panel.classList.remove("active-panel"));

        button.classList.add("active-tab");
        document.getElementById(target).classList.add("active-panel");
    }
    );
});

wishlistBtn.addEventListener("click", () => {
    if (toggle.classList.contains("fa-regular")) {
        toggle.classList.remove("fa-regular");
        toggle.classList.add("fa-solid");
        toggle.style.color = "red";
    } else {
        toggle.classList.remove("fa-solid");
        toggle.classList.add("fa-regular");
        toggle.style.color = "";
    }
});

[addToCartBtn, buyNowBtn].forEach(button => {
    if (!button) return;
    button.addEventListener("click", () => {
        const currentCount = Number(localStorage.getItem("cartCount")) || 0;
        updateCartCount(currentCount + 1);
    });
});
