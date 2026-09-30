async function loadProductDetails() {

    const container = document.getElementById(
        "product-details-container"
    );

    if (!container) {
        console.error("Product details container not found.");
        return;
    }

    const params = new URLSearchParams(
        window.location.search
    );

    const productId = params.get("id");

    if (!productId) {

        container.innerHTML = `
            <div class="error-message">
                <h2>Product Not Found</h2>

                <p>
                    No product ID was provided.
                </p>

                <br>

                <a
                    href="products.html"
                    class="btn"
                >
                    Back to Products
                </a>
            </div>
        `;

        return;
    }

    try {

        const product = await apiRequest(
            `/api/products/${productId}`
        );

        console.log("Product details:", product);

        const image = product.image_url
            ? `
                <img
                    src="${escapeHTML(product.image_url)}"
                    alt="${escapeHTML(product.name)}"
                >
              `
            : `
                <div class="product-detail-placeholder">
                    🛍️
                </div>
              `;

        container.innerHTML = `

            <div class="product-detail-card">

                <div class="product-detail-image">
                    ${image}
                </div>

                <div class="product-detail-info">

                    <span class="product-category">
                        ShopEase Product
                    </span>

                    <h1>
                        ${escapeHTML(product.name)}
                    </h1>

                    <p class="product-detail-description">
                        ${escapeHTML(
                            product.description || ""
                        )}
                    </p>

                    <div class="product-detail-price">
                        ₹${Number(
                            product.price
                        ).toLocaleString("en-IN")}
                    </div>

                    <p class="product-stock">
                        <strong>
                            Available Stock:
                        </strong>
                        ${product.stock}
                    </p>

                    <div class="product-detail-actions">

                        <button
                            class="btn"
                            onclick="addProductToCart(${product.id})"
                        >
                            🛒 Add to Cart
                        </button>

                        <a
                            href="products.html"
                            class="btn secondary-btn"
                        >
                            ← Back to Products
                        </a>

                    </div>

                </div>

            </div>

        `;

    } catch (error) {

        console.error(
            "Product details error:",
            error
        );

        container.innerHTML = `

            <div class="error-message">

                <h2>
                    Unable to Load Product
                </h2>

                <p>
                    ${escapeHTML(error.message)}
                </p>

                <br>

                <a
                    href="products.html"
                    class="btn"
                >
                    Back to Products
                </a>

            </div>

        `;
    }
}


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

        console.error(
            "Cart error:",
            error
        );

        alert(error.message);
    }
}


function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


document.addEventListener(
    "DOMContentLoaded",
    loadProductDetails
);