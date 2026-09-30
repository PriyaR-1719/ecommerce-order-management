async function loadOrders() {

    const container =
        document.getElementById(
            "orders-container"
        );


    container.innerHTML =
        "<p>Loading orders...</p>";


    try {

        const orders =
            await apiRequest(
                "/api/orders/"
            );


        if (orders.length === 0) {

            container.innerHTML = `

                <div class="empty-state">

                    <h2>
                        No orders yet.
                    </h2>

                    <br>

                    <a
                        href="products.html"
                        class="btn"
                    >
                        Start Shopping
                    </a>

                </div>

            `;

            return;
        }


        container.innerHTML =
            orders.map(order => `

                <div class="order-card">

                    <h3>
                        Order #${order.id}
                    </h3>


                    <p>

                        Total:
                        ₹${Number(
                            order.total_amount
                        ).toFixed(2)}

                    </p>


                    <p>

                        Status:

                        <span class="status">

                            ${escapeHTML(
                                order.status
                            )}

                        </span>

                    </p>

                </div>

            `).join("");


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



function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value ?? "");

    return div.innerHTML;
}