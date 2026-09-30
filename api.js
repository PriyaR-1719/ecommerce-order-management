const API_BASE_URL = "http://127.0.0.1:8000";


async function apiRequest(endpoint, options = {}) {

    const token = localStorage.getItem("access_token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };


    if (token) {

        headers["Authorization"] = `Bearer ${token}`;

    }


    try {

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                headers
            }
        );


        const contentType =
            response.headers.get("content-type");


        let data;


        if (
            contentType &&
            contentType.includes("application/json")
        ) {

            data = await response.json();

        } else {

            data = await response.text();

        }


        if (!response.ok) {

            const message =
                typeof data === "object"
                    ? data.detail || "Something went wrong"
                    : data;

            throw new Error(message);

        }


        return data;


    } catch (error) {

        console.error("API Error:", error);

        throw error;

    }

}