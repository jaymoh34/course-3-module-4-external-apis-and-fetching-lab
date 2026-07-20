// ============================================================
// index.js – Weather Alerts App (fully compliant)
// ============================================================

// DOM Elements
const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

// -------- Helper functions for error handling --------
function clearError() {
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
    console.error("Error:", message); // as per lab Step 1
}

// -------- Step 1: Fetch weather alerts --------
async function fetchWeatherAlerts(state) {
    const url = `https://api.weather.gov/alerts/active?area=${state.toUpperCase()}`;
    console.log("Fetching:", url); // for debugging

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API response:", data); // Step 1 – log for testing
        return data;
    } catch (error) {
        console.error("Fetch error:", error.message); // Step 1 – catch & log
        throw error; // re-throw so the caller can display it
    }
}

// -------- Step 2: Display alerts --------
function displayAlerts(data) {
    // Clear previous alerts (already done by caller, but safe to do here too)
    alertsDisplay.innerHTML = "";

    // Use the title from the API (e.g., "Current watches, warnings, and advisories for Minnesota")
    const title = data.title || "Weather Alerts";
    const features = data.features || []; // safeguard against undefined
    const count = features.length;

    // Summary message
    const summary = document.createElement("h2");
    summary.textContent = `${title}: ${count}`;
    alertsDisplay.appendChild(summary);

    // List of headlines
    const list = document.createElement("ul");
    if (count > 0) {
        features.forEach(alert => {
            const headline = alert.properties.headline || "No headline available";
            const li = document.createElement("li");
            li.textContent = headline;
            list.appendChild(li);
        });
    } else {
        const li = document.createElement("li");
        li.textContent = "No active alerts for this state.";
        list.appendChild(li);
    }
    alertsDisplay.appendChild(list);
}

// -------- Step 3 & 4: Main handler (clear & reset, error handling) --------
async function handleFetchAlerts() {
    // Clear previous errors and alerts
    clearError();
    alertsDisplay.innerHTML = "";

    // ----- Step 4 (input validation) -----
    const state = stateInput.value.trim();
    // Require exactly two uppercase letters
    if (!state || state.length !== 2 || !/^[A-Z]{2}$/.test(state.toUpperCase())) {
        showError("Please enter a valid two-letter state abbreviation (e.g., MN).");
        return;
    }

    // Step 3: Clear the input field
    stateInput.value = "";

    try {
        const data = await fetchWeatherAlerts(state);
        displayAlerts(data);
        // On success, error is already cleared
    } catch (error) {
        // Step 4: Display the error message in the dedicated div
        showError(`Failed to fetch alerts: ${error.message}`);
    }
}

// -------- Event listeners --------
fetchButton.addEventListener("click", handleFetchAlerts);

// Allow Enter key on the input field
stateInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        fetchButton.click();
    }
});