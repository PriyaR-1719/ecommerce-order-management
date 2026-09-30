async function loadCart() {

    const container =
        document.getElementById(
            "cart-container"
        );

    container.innerHTML =
        "<p>Loading cart...</p>";


    try {

        const cartItems =
            await apiRequest(
                "/api/cart/"
            );


        if (cartItems.length === 0) {

            container.innerHTML = `

                <div class="empty-state">

                    <h2>
                        Your cart is empty 🛒
                    </h2>

                    <br>

                    <a
                        href="products.html"
                        class="btn"
                    >
                        Continue Shopping
                    </a>

                </div>

            `;


            updateCartTotal([]);

            return;
        }


        const detailedItems = [];


        for (const item of cartItems) {

            try {

                const product =
                    await apiRequest(
                        `/api/products/${item.product_id}`
                    );


                detailedItems.push({
                    ...item,
                    product
                });


            } catch (error) {

                console.error(
                    "Product loading error:",
                    error
                );
            }
        }


        container.innerHTML =
            detailedItems.map(item => `

                <div class="cart-item">

                    <div class="cart-product-image">

                        ${
                            item.product.image_url
                                ? `
                                    <img
                                        src="${escapeHTML(item.product.image_url)}"
                                        alt="${escapeHTML(item.product.name)}"
                                        style="
                                            width:100%;
                                            height:100%;
                                            object-fit:contain;
                                            border-radius:15px;
                                        "
                                        onerror="this.style.display='none';"
                                    >
                                  `
                                : "🛍️"
                        }

                    </div>


                    <div class="cart-item-info">

                        <h3>
                            ${escapeHTML(
                                item.product.name
                            )}
                        </h3>


                        <p>
                            Price:
                            ₹${Number(
                                item.product.price
                            ).toFixed(2)}
                        </p>


                        <p>
                            Quantity:
                            ${item.quantity}
                        </p>


                        <p>
                            Subtotal:
                            ₹${(
                                item.product.price *
                                item.quantity
                            ).toFixed(2)}
                        </p>

                    </div>

                </div>

            `).join("");


        updateCartTotal(
            detailedItems
        );


    } catch (error) {

        container.innerHTML = `

            <div class="error-message">

                ${escapeHTML(
                    error.message
                )}

            </div>

        `;
    }
}



function updateCartTotal(items) {

    const total =
        items.reduce(
            (sum, item) =>
                sum +
                item.product.price *
                item.quantity,
            0
        );


    const totalElement =
        document.getElementById(
            "cart-total"
        );


    if (totalElement) {

        totalElement.textContent =
            `₹${total.toFixed(2)}`;
    }
}



async function placeOrder() {

    try {

        const order =
            await apiRequest(
                "/api/orders/",
                {
                    method: "POST"
                }
            );


        alert(
            `Order #${order.id} placed successfully! 📦`
        );


        window.location.href =
            "orders.html";


    } catch (error) {

        alert(error.message);
    }
}



function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value ?? "");

    return div.innerHTML;
}