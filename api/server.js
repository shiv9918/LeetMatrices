const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // Ensure node-fetch is installed

const app = express();
app.use(cors());
app.use(express.json());

app.post("/fetch-leetcode", async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        const query = {
            query: `
                query getUserProfile($username: String!) {
                    matchedUser(username: $username) {
                        username
                        submitStatsGlobal {
                            acSubmissionNum {
                                difficulty
                                count
                            }
                        }
                    }
                }`,
            variables: { username }
        };

        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(query)
        });

        const data = await response.json();
        
        if (!data || !data.data) {
            return res.status(500).json({ error: "Failed to fetch data from LeetCode" });
        }

        res.json(data.data.matchedUser);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Use dynamic PORT for deployment compatibility
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
