document.addEventListener("DOMContentLoaded", function () {
    const generateButton = document.getElementById("generate-btn");
    const saveButton = document.getElementById("save-btn");
    const resetButton = document.getElementById("reset-btn");
    const downloadButton = document.getElementById("download-btn");
    const passwordList = document.getElementById("password-list");
    const outputPassword = document.getElementById("output-password");
    const lengthInput = document.getElementById("length");
    const lowercaseCheckbox = document.getElementById("lowercase");
    const uppercaseCheckbox = document.getElementById("uppercase");
    const numbersCheckbox = document.getElementById("numbers");
    const symbolsCheckbox = document.getElementById("symbols");

    let generatedPassword = "";
    let savedPasswords = JSON.parse(localStorage.getItem("savedPasswords")) || [];

    // Function to update the UI with saved passwords
    function updateSavedPasswords() {
        passwordList.innerHTML = savedPasswords.length > 0
            ? savedPasswords.map((password, index) => `
                <li>
                    ${password}
                    <span class="delete-icon" data-index="${index}">&#x1F5D1;</span>
                </li>
            `).join("")
            : "<li>No passwords saved yet.</li>";

        // Enable download button if there are saved passwords
        downloadButton.disabled = savedPasswords.length === 0;
    }

    // Function to switch between tabs
    function switchTab(tabId) {
        // Remove active class from all tab buttons and tab content
        const tabs = document.querySelectorAll(".tab-content");
        const buttons = document.querySelectorAll(".tab-btn");

        tabs.forEach(t => t.classList.remove("active"));
        buttons.forEach(b => b.classList.remove("active"));

        // Add the active class to the selected tab content and button
        const tabContent = document.getElementById(tabId);
        const tabButton = document.querySelector(`#${tabId}-tab`);
        
        tabContent.classList.add("active");
        tabButton.classList.add("active");
    }

    // Function to generate password
    function generatePassword() {
        const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numberChars = "0123456789";
        const symbolChars = "!@#$%^&*()_+{}|:<>?";
        
        let possibleChars = '';

        if (lowercaseCheckbox.checked) possibleChars += lowercaseChars;
        if (uppercaseCheckbox.checked) possibleChars += uppercaseChars;
        if (numbersCheckbox.checked) possibleChars += numberChars;
        if (symbolsCheckbox.checked) possibleChars += symbolChars;

        const passwordLength = parseInt(lengthInput.value, 10);

        if (!possibleChars) {
            alert("Please select at least one character type!");
            return;
        }

        generatedPassword = "";
        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * possibleChars.length);
            generatedPassword += possibleChars[randomIndex];
        }

        outputPassword.textContent = generatedPassword;
        saveButton.disabled = false;
    }

    // Function to save password to local storage
    function savePassword() {
        if (generatedPassword) {
            savedPasswords.push(generatedPassword);
            localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));
            updateSavedPasswords();
        }
    }

    // Function to delete password
    function deletePassword(index) {
        savedPasswords.splice(index, 1);
        localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));
        updateSavedPasswords();
    }

    // Function to download all passwords as a text file
    function downloadPasswords() {
        const blob = new Blob([savedPasswords.join("\n")], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "generated_passwords.txt";
        link.click();
    }

    // Function to reset the password generator
    function resetGenerator() {
        generatedPassword = "";
        outputPassword.textContent = "No password generated yet.";
        saveButton.disabled = true;
        lengthInput.value = 12;
        lowercaseCheckbox.checked = false;
        uppercaseCheckbox.checked = false;
        numbersCheckbox.checked = false;
        symbolsCheckbox.checked = false;
    }

    // Event Listeners
    generateButton.addEventListener("click", function (event) {
        event.preventDefault();
        generatePassword();
    });

    saveButton.addEventListener("click", savePassword);
    resetButton.addEventListener("click", resetGenerator);
    downloadButton.addEventListener("click", downloadPasswords);

    // Handle password deletion
    passwordList.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-icon")) {
            const index = event.target.dataset.index;
            deletePassword(index);
        }
    });

    // Switch between tabs
    document.getElementById("generate-tab").addEventListener("click", function() {
        switchTab("generate-section");
    });
    document.getElementById("saved-passwords-tab").addEventListener("click", function() {
        switchTab("saved-passwords-section");
    });

    // Initial Load: Load saved passwords and set default tab (Generate Password)
    updateSavedPasswords();

    // Set the default tab to "Generate Password" on initial load
    switchTab("generate-section");
});
