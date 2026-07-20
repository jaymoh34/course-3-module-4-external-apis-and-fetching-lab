

// DOM Elements
const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

function clearError() {
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
    console.error("Error:", message); 
}

async function fetchWeatherAlerts(state) {
    const url = `https://api.weather.gov/alerts/active?area=${state.toUpperCase()}`;
    console.log("Fetching:", url); // for debugging

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API response:", data); 
        return data;
    } catch (error) {
        console.error("Fetch error:", error.message);
        throw error; 
    }
}

function displayAlerts(data) {
    alertsDisplay.innerHTML = "";

    const title = data.title || "Weather Alerts";
    const features = data.features || []; 
    const count = features.length;

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

async function handleFetchAlerts() {
    // Clear previous errors and alerts
    clearError();
    alertsDisplay.innerHTML = "";

    const state = stateInput.value.trim();
    // Require exactly two uppercase letters
    if (!state || state.length !== 2 || !/^[A-Z]{2}$/.test(state.toUpperCase())) {
        showError("Please enter a valid two-letter state abbreviation (e.g., MN).");
        return;
    }

    stateInput.value = "";

    try {
        const data = await fetchWeatherAlerts(state);
        displayAlerts(data);
      
    } catch (error) {
       
        showError(`Failed to fetch alerts: ${error.message}`);
    }
}


fetchButton.addEventListener("click", handleFetchAlerts);

stateInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        fetchButton.click();
    }
});
