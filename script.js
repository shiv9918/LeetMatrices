document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");

    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const CardStatsContainer = document.getElementsByClassName("stats-card");

    function validateUsername(userName) {
        if (userName.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
        if (!regex.test(userName)) {
            alert("Invalid Username");
            return false;
        }
        return true;
    }

    function updateProgress(solved, total, label, circle) {
        if (total === 0) return;
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function resetProgress() {
        easyProgressCircle.style.setProperty("--progress-degree", "0%");
        mediumProgressCircle.style.setProperty("--progress-degree", "0%");
        hardProgressCircle.style.setProperty("--progress-degree", "0%");
        easyLabel.textContent = "Easy";
        mediumLabel.textContent = "Medium";
        hardLabel.textContent = "Hard";

        if (CardStatsContainer.length > 0) {
            CardStatsContainer[0].innerHTML = `
                <div class="card"><h4>Overall Submissions</h4><p>0</p></div>
                <div class="card"><h4>Easy Submissions</h4><p>0</p></div>
                <div class="card"><h4>Medium Submissions</h4><p>0</p></div>
                <div class="card"><h4>Hard Submissions</h4><p>0</p></div>
            `;
        }
    }

    async function fetchUserDetails(username) {
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch("http://localhost:3000/fetch-leetcode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username })
            });

            if (!response.ok) throw new Error("Failed to fetch user details!");

            const jsonData = await response.json();
            console.log("LeetCode API Response:", jsonData);

            if (jsonData.submitStatsGlobal && jsonData.submitStatsGlobal.acSubmissionNum) {
                displayUserData(jsonData.submitStatsGlobal.acSubmissionNum);
            } else {
                console.error("Invalid response format");
                statsContainer.innerHTML = '<p>No Data Found</p>';
            }
        } catch (error) {
            console.error("Fetch error:", error);
            statsContainer.innerHTML = '<p>No Data Found</p>';
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function displayUserData(submissionData) {
        if (!submissionData || !Array.isArray(submissionData) || submissionData.length < 4) {
            console.error("Invalid or empty submission data:", submissionData);
            statsContainer.innerHTML = '<p>No Data Found</p>';
            return;
        }

        const totalSolved = submissionData[0]?.count ?? 0;
        const easySolved = submissionData[1]?.count ?? 0;
        const mediumSolved = submissionData[2]?.count ?? 0;
        const hardSolved = submissionData[3]?.count ?? 0;

        // Estimated total questions in each difficulty
        const totalEasy = 700; 
        const totalMedium = 1400;
        const totalHard = 700;

        updateProgress(easySolved, totalEasy, easyLabel, easyProgressCircle);
        updateProgress(mediumSolved, totalMedium, mediumLabel, mediumProgressCircle);
        updateProgress(hardSolved, totalHard, hardLabel, hardProgressCircle);

        if (CardStatsContainer.length > 0) {
            CardStatsContainer[0].innerHTML = `
                <div class="card"><h4>Overall Submissions</h4><p>${totalSolved}</p></div>
                <div class="card"><h4>Easy Submissions</h4><p>${easySolved}</p></div>
                <div class="card"><h4>Medium Submissions</h4><p>${mediumSolved}</p></div>
                <div class="card"><h4>Hard Submissions</h4><p>${hardSolved}</p></div>
            `;
        }
    }

    searchButton.addEventListener("click", function () {
        const username = usernameInput.value.trim();
        console.log("Logging username:", username);
        if (validateUsername(username)) fetchUserDetails(username);
    });

    usernameInput.addEventListener("input", function () {
        if (usernameInput.value.trim() === "") resetProgress();
    });
});
