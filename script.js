document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");

    // Progress circles and labels
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const CardStatsContainer = document.getElementsByClassName("stats-card");

    // Function to validate username
    function validateUsername(userName) {
        if (userName.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
        const isMatching = regex.test(userName);
        if (!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    function updateProgress(solved, total, label, circle) {
        if (total === 0) {
            console.warn("Total questions cannot be zero to avoid division errors.");
            return;
        }

        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    // Function to reset progress and stats
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

    // Function to fetch user details from API
    async function fetchUserDetails(username) {
        try {
            searchButton.textContent = "Searching....";
            searchButton.disabled = true;

            const apiUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error("Unable to fetch user details!");
            }

            const parsedData = await response.json();
            console.log("API Response:", parsedData);
            displayUserData(parsedData);

        } catch (error) {
            console.error("Fetch error:", error);
            statsContainer.innerHTML = '<p>No Data found</p>';
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function displayUserData(parsedData) {
        if (!parsedData || parsedData.status === "error") {
            console.error("Invalid or empty response:", parsedData);
            statsContainer.innerHTML = '<p>No Data Found</p>';
            return;
        }

        const totalEasyQues = parsedData.totalEasy;
        const totalMediumQues = parsedData.totalMedium;
        const totalHardQues = parsedData.totalHard;

        const solvedTotalEasyQues = parsedData.easySolved;
        const solvedTotalMediumQues = parsedData.mediumSolved;
        const solvedTotalHardQues = parsedData.hardSolved;

        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

        const cardData = [
            { label: "Overall Submissions", value: parsedData.totalSolved ?? 0 },
            { label: "Easy Submissions", value: parsedData.easySolved ?? 0 },
            { label: "Medium Submissions", value: parsedData.mediumSolved ?? 0 },
            { label: "Hard Submissions", value: parsedData.hardSolved ?? 0 }
        ];
        console.log("card ka data: ", cardData);

        if (CardStatsContainer.length > 0) {
            CardStatsContainer[0].innerHTML = cardData.map(data => {
                return `
                    <div class="card">
                        <h4>${data.label}</h4>
                        <p>${data.value}</p>  
                    </div>
                `;
            }).join("");
        } else {
            console.error("Stats card container not found!");
        }
    }

    // Event listener for search button
    searchButton.addEventListener("click", function () {
        const username = usernameInput.value;
        console.log("Logging username:", username);
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });

    // Event listener to reset progress when input is cleared
    usernameInput.addEventListener("input", function () {
        if (usernameInput.value.trim() === "") {
            resetProgress();
        }
    });
});
