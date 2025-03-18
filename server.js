app.post("/proxy", async (req, res) => {
    try {
        const targetUrl = "https://leetcode.com/graphql/";
        console.log("Received request body:", req.body); // Log the request body

        const response = await fetch(targetUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

        console.log("Response status:", response.status); // Log the response status

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response data:", data); // Log the response data
        res.json(data);
    } catch (error) {
        console.error("Proxy error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});