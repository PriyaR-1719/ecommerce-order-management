async function loadProducts() {

    const container = document.getElementById("products-container");

    if (!container) {
        console.error("Products container not found.");
        return;
    }

    try {

        const products = await apiRequest("/api/products/");

        console.log("Products received:", products);

        if (!products || products.length === 0) {

            container.innerHTML = `
                <div class="empty-state">
                    <h2>No Products Available</h2>
                    <p>There are currently no products in the database.</p>
                </div>
            `;

            return;
        }


        container.innerHTML = products.map(product => {

            const image = product.image_url
                ? `
                    <img
                        src="${escapeHTML(product.image_url)}"
                        alt="${escapeHTML(product.name)}"
                        style="
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                            border-radius: 15px;
                        "
                        onerror="this.style.display='none';"
                    >
                  `
                : `<span>🛍️</span>`;


            return `
                <div class="product-card">

                    <div class="product-image">
                        ${image}
                    </div>


                    <h3>
                        ${escapeHTML(product.name)}
                    </h3>


                    <p class="product-description">
                        ${escapeHTML(product.description || "")}
                    </p>


                    <div class="product-price">
                        ₹${Number(product.price).toLocaleString("en-IN")}
                    </div>


                    <p>
                        <strong>Stock:</strong>
                        ${product.stock}
                    </p>


                    <br>


                    <button
                        class="btn"
                        onclick="viewProduct(${product.id})"
                    >
                        View Details
                    </button>


                    <button
                        class="btn"
                        onclick="addProductToCart(${product.id})"
                    >
                        Add to Cart 🛒
                    </button>

                </div>
            `;

        }).join("");


    } catch (error) {

        console.error("Product loading error:", error);

        container.innerHTML = `
            <div class="error-message">

                <h2>Unable to Load Products</h2>

                <p>
                    ${escapeHTML(error.message)}
                </p>

                <br>

                <button
                    class="btn"
                    onclick="loadProducts()"
                >
                    Try Again
                </button>

            </div>
        `;
    }
}


/* ================= VIEW PRODUCT ================= */

function viewProduct(productId) {

    window.location.href =
        `product-details.html?id=${productId}`;
}


/* ================= ADD TO CART ================= */

async function addProductToCart(productId) {

    try {

        await apiRequest("/api/cart/", {

            method: "POST",

            body: JSON.stringify({

                product_id: productId,

                quantity: 1

            })

        });

        alert("Product added to cart! 🛒");

    } catch (error) {

        console.error("Cart error:", error);

        alert(error.message);
    }
}


/* ================= SECURITY ================= */

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


/* ================= LOAD PRODUCTS ================= */

document.addEventListener(
    "DOMContentLoaded",
    loadProducts
);