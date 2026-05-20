const productGrid = document.getElementById("product-grid");
const productCount = document.getElementById("product-count");
const sortSelect = document.getElementById("sort");
const categoryFilters = document.querySelectorAll(".category-filter");
const ratingFilters = document.querySelectorAll(".rating-filter");
const filterBtn = document.getElementById("filter-btn");
const filterPanel = document.getElementById("filter-panel");
const cartCount = document.querySelector(".cart-count");

if (cartCount) { cartCount.innerText = Number(localStorage.getItem("cartCount")) || 0; }

if (filterBtn && filterPanel) { filterBtn.addEventListener("click", () => { filterPanel.classList.toggle("active"); }); }

function generateStars(rating) {
    let starsHTML = "";
    for (let i = 1; i <= 5; i++) {
        starsHTML += i <= rating ? `<i class="fa-solid fa-star"></i>` : `<i class="fa-regular fa-star"></i>`;
    }
    return starsHTML;
}

function getImagePath(imagePath) {
    return imagePath.startsWith("./") ? imagePath : `./${imagePath}`;
}

function createProductCard(product) {
    return `
    <article class="product-card">
        <a href="product-detail.html?id=${product.id}" class="product-image">
            <img src="${getImagePath(product.image)}" alt="${product.name}"/>
        </a>

        <div class="product-info">
            <a href="product-detail.html?id=${product.id}" class="product-title">
                <h3>${product.name}</h3>
            </a>
            
            <div class="price">
                <span class="new-price">$${product.price.toFixed(2)}</span>
                ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ""}
            </div>

            <div class="ratings">
                <div class="stars">${generateStars(product.rating)}</div>
                  <span>${product.reviews} Reviews</span>
            </div>
        </div>
    </article>
`;
}

function renderProducts(productsArray) {
    if (!productGrid) return;

    productGrid.innerHTML = "";

    if (productCount) {
        productCount.innerText = `(${productsArray.length})`;
    }

    if (productsArray.length === 0) {
        productGrid.innerHTML = `<div class="no-products"><h2>No Products Found</h2></div>`;
        return;
    }

    const productsHTML = productsArray.map(product => createProductCard(product)).join("");
    productGrid.innerHTML = productsHTML;
}

function getSelectedCategories() {
    return Array.from(categoryFilters).filter(filter => filter.checked).map(filter => filter.value);
}

function getSelectedRating() {
    const selectedFilter = Array.from(ratingFilters).find(filter => filter.checked);
    return selectedFilter ? Number(selectedFilter.value) : 0;
}

function filterProducts() {
    let filteredProducts = [...products];

    const selectedCategories = getSelectedCategories();

    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(product => selectedCategories.includes(product.category));
    }

    const selectedRating = getSelectedRating();

    if (selectedRating > 0) {
        filteredProducts = filteredProducts.filter(product => product.rating >= selectedRating);
    }

    return filteredProducts;
}

function sortProducts(productsArray) {
    const sortedProducts = [...productsArray];

    switch (sortSelect.value) {

        case "low-high":
            sortedProducts.sort((a, b) => a.price - b.price);
            break;

        case "high-low":
            sortedProducts.sort((a, b) => b.price - a.price);
            break;

        case "rating":
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;

        case "name":
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;

        default:
            sortedProducts.sort((a, b) => a.id - b.id);
    }

    return sortedProducts;
}

function filterAndSortProducts() {
    const filteredProducts = filterProducts();
    const sortedProducts = sortProducts(filteredProducts);
    renderProducts(sortedProducts);
}

if (sortSelect) {
    sortSelect.addEventListener("change", filterAndSortProducts);
}

categoryFilters.forEach(filter => {
    filter.addEventListener("change", filterAndSortProducts);
});

ratingFilters.forEach(filter => {
    filter.addEventListener("change", filterAndSortProducts);
});

document.addEventListener("DOMContentLoaded", () => { renderProducts(products); });