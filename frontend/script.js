// =====================================
// BIO-FREE SERVICE REPORT APPLICATION
// =====================================

const serviceButtons = document.querySelectorAll(".service-button");

const serviceTypeInput = document.getElementById("serviceType");

const exhaustSection = document.getElementById("exhaustSection");
const generalSection = document.getElementById("generalSection");
const airconSection = document.getElementById("airconSection");

const serviceMessage = document.getElementById("serviceMessage");

const serviceForm = document.getElementById("serviceForm");

const resultMessage = document.getElementById("resultMessage");

const clearButton = document.getElementById("clearButton");

const loadReportsButton = document.getElementById("loadReportsButton");

const reportsContainer = document.getElementById("reportsContainer");


// =====================================
// SERVICE SELECTION
// SWITCH STATEMENT
// =====================================

function selectService(service) {

    // Hide all service sections first
    exhaustSection.classList.add("hidden");
    generalSection.classList.add("hidden");
    airconSection.classList.add("hidden");

    // Reset button styles and availability
    serviceButtons.forEach(button => {

        button.classList.remove("active");

        button.disabled = false;

    });

    // Store selected service
    serviceTypeInput.value = service;

    // Use switch statement
    switch (service) {

        case "Exhaust Cleaning":

            exhaustSection.classList.remove("hidden");

            serviceMessage.textContent =
                "Exhaust Cleaning selected. General Cleaning and Aircon Services are disabled.";

            break;


        case "General Cleaning":

            generalSection.classList.remove("hidden");

            serviceMessage.textContent =
                "General Cleaning selected. Exhaust Cleaning and Aircon Services are disabled.";

            break;


        case "Aircon Services":

            airconSection.classList.remove("hidden");

            serviceMessage.textContent =
                "Aircon Services selected. Exhaust Cleaning and General Cleaning are disabled.";

            break;


        default:

            serviceMessage.textContent =
                "Please select a service type.";

            serviceTypeInput.value = "";

            return;

    }

    // Activate selected button and disable other services
    serviceButtons.forEach(button => {

        if (button.dataset.service === service) {

            button.classList.add("active");

        } else {

            button.disabled = true;

        }

    });

}


// =====================================
// SERVICE BUTTON EVENTS
// =====================================

serviceButtons.forEach(button => {

    button.addEventListener("click", function () {

        const selectedService = this.dataset.service;

        selectService(selectedService);

    });

});


// =====================================
// GET CHECKED CHECKBOX VALUES
// =====================================

function getCheckedValues(name) {

    return Array.from(
        document.querySelectorAll(`input[name="${name}"]:checked`)
    ).map(input => input.value);

}


// =====================================
// GET SERVICE DETAILS
// =====================================

function getServiceDetails() {

    const service = serviceTypeInput.value;

    let details = {};

    switch (service) {

        case "Exhaust Cleaning":

            details = {

                components: getCheckedValues("component"),

                greaseLevel:
                    document.getElementById("greaseLevel").value

            };

            break;


        case "General Cleaning":

            details = {

                cleaningType:
                    document.getElementById("cleaningType").value,

                areas: getCheckedValues("area")

            };

            break;


        case "Aircon Services":

            details = {

                airconType:
                    document.getElementById("airconType").value,

                airconService:
                    document.getElementById("airconService").value,

                units:
                    document.getElementById("airconUnits").value

            };

            break;


        default:

            details = {};

    }

    return details;

}


// =====================================
// SAVE SERVICE REPORT
// =====================================

serviceForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    if (!serviceTypeInput.value) {

        alert("Please select a service type.");

        return;

    }

    const formData = new FormData();

    // Basic information
    formData.append("serviceType", serviceTypeInput.value);

    formData.append(
        "reportDate",
        document.getElementById("reportDate").value
    );

    formData.append(
        "branch",
        document.getElementById("branch").value
    );

    formData.append(
        "technician",
        document.getElementById("technician").value
    );

    formData.append(
        "clientName",
        document.getElementById("clientName").value
    );

    formData.append(
        "contactNumber",
        document.getElementById("contactNumber").value
    );

    formData.append(
        "address",
        document.getElementById("address").value
    );

    // Service details
    formData.append(
        "serviceDetails",
        JSON.stringify(getServiceDetails())
    );

    // Work details
    formData.append(
        "workPerformed",
        document.getElementById("workPerformed").value
    );

    formData.append(
        "findings",
        document.getElementById("findings").value
    );

    formData.append(
        "recommendations",
        document.getElementById("recommendations").value
    );

    // Acknowledgment
    formData.append(
        "clientAcknowledgment",
        document.getElementById("clientAcknowledgment").value
    );

    formData.append(
        "technicianAcknowledgment",
        document.getElementById("technicianAcknowledgment").value
    );

    // Before photos
    const beforeFiles =
        document.getElementById("beforePhotos").files;

    for (const file of beforeFiles) {

        formData.append("beforePhotos", file);

    }

    // After photos
    const afterFiles =
        document.getElementById("afterPhotos").files;

    for (const file of afterFiles) {

        formData.append("afterPhotos", file);

    }

    try {

        resultMessage.textContent = "Saving service report...";

        const response = await fetch("/api/reports", {

            method: "POST",

            body: formData

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message || "Unable to save report.");

        }

        resultMessage.textContent =
            "Success! Report Number: " + data.report.reportNumber;

        resultMessage.style.color = "green";

        serviceForm.reset();

        resetServiceSelection();

        loadReports();

    } catch (error) {

        resultMessage.textContent = error.message;

        resultMessage.style.color = "red";

    }

});


// =====================================
// RESET SERVICE SELECTION
// =====================================

function resetServiceSelection() {

    serviceTypeInput.value = "";

    exhaustSection.classList.add("hidden");

    generalSection.classList.add("hidden");

    airconSection.classList.add("hidden");

    serviceButtons.forEach(button => {

        button.disabled = false;

        button.classList.remove("active");

    });

    serviceMessage.textContent =
        "Please select a service type.";

}


// =====================================
// CLEAR FORM
// =====================================

clearButton.addEventListener("click", function () {

    const confirmed = confirm(
        "Are you sure you want to clear the form?"
    );

    if (!confirmed) return;

    serviceForm.reset();

    resetServiceSelection();

    resultMessage.textContent = "";

});


// =====================================
// LOAD SAVED REPORTS
// =====================================

async function loadReports() {

    try {

        reportsContainer.innerHTML = "Loading reports...";

        const response = await fetch("/api/reports");

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message || "Unable to load reports.");

        }

        reportsContainer.innerHTML = "";

        if (data.reports.length === 0) {

            reportsContainer.textContent =
                "No service reports found.";

            return;

        }

        data.reports.forEach(report => {

            const item = document.createElement("div");

            item.className = "report-item";

            const title = document.createElement("strong");

            title.textContent = report.reportNumber;

            const service = document.createElement("p");

            service.textContent = "Service: " + report.serviceType;

            const client = document.createElement("p");

            client.textContent = "Client: " + report.clientName;

            const branch = document.createElement("p");

            branch.textContent = "Branch: " + report.branch;

            const date = document.createElement("p");

            date.textContent = "Date: " + (report.reportDate || "");

            item.append(title, service, client, branch, date);

            reportsContainer.appendChild(item);

        });

    } catch (error) {

        reportsContainer.textContent = error.message;

    }

}


// =====================================
// LOAD REPORTS BUTTON
// =====================================

loadReportsButton.addEventListener("click", loadReports);


// =====================================
// DEFAULT DATE
// =====================================

document.getElementById("reportDate").value =
    new Date().toLocaleDateString("en-CA");