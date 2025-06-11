import homePage from "./pages/home.js";
import aboutPage from "./pages/about.js";
import schedulePage from "./pages/schedulePage.js";
import './components';
import 'font-awesome/css/font-awesome.min.css';
import "./styles.css";

const API_URL = "https://naffscg.my.id";
const WS_URL = "wss://naffscg.my.id";
let globalWebSocket = null;

window.loadPage = async (page) => {
    const main = document.getElementById("mainContent");
    if (!main) {
        console.error("Elemen #mainContent tidak ditemukan!");
        return;
    }

    main.innerHTML = "";

    let pageContent;
    switch (page) {
        case "home":
            pageContent = homePage();
            break;
        case "about":
            pageContent = aboutPage();
            break;
        case "schedule":
            pageContent = schedulePage();
            break;
        default:
            console.warn(`Halaman '${page}' tidak dikenal.`);
            return;
    }

    if (pageContent) {
        main.appendChild(pageContent);
    }

    if (page === "home") {
        await fetchPesticideStatus();
        setupPesticideToggleListener();
        setupWebSocket();
    }
};

function setupPesticideToggleListener() {
    const pesticideToggle = document.getElementById("pesticide-toggle");
    if (pesticideToggle) {
        pesticideToggle.removeEventListener("change", handlePesticideToggle);
        pesticideToggle.addEventListener("change", handlePesticideToggle);
        console.log("✅ Event listener untuk pesticide-toggle terpasang.");
    } else {
        console.warn("⚠️ Elemen pesticide-toggle tidak ditemukan saat mencoba memasang listener.");
    }
}

// Update warna dan progress bar
function setProgressCircle(circleId, percentage){
    const circle = document.getElementById(circleId);
    if(!circle) return;

    let color = "#00cfd1";
    if(percentage < 40){
        color = "#e53935";
    } else if(percentage < 60 && percentage < 80){
        color = "#fbc02d";
    }

    circle.style.background = `conic-gradient(${color} 0% ${percentage}%, #eee ${percentage}% 100%)`;
    circle.setAttribute("data-tooltip", `${percentage}%`);
}

async function fetchPesticideStatus() {
    const pesticideToggleElement = document.getElementById("pesticide-toggle");
    if (!pesticideToggleElement) {
        console.warn("⚠️ Elemen pesticide-toggle tidak ditemukan, tidak bisa mengambil status awal.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/pesticide/status`);
        if (!response.ok) throw new Error("Gagal mengambil status pestisida");

        const data = await response.json();
        console.log("✅ Status pestisida awal dari API:", data.status);
        updatePesticideStatus(data.status);
    } catch (error) {
        console.error("⛔ Gagal mengambil status pestisida:", error);
    }
}

async function handlePesticideToggle(event) {
    const status = event.target.checked ? "ON" : "OFF";
    console.log(`🚀 Mengirim kontrol pestisida: ${status}`);

    try {
        const response = await fetch(`${API_URL}/control/pesticide`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });

        const result = await response.json();
        console.log("✅ Response dari server:", result);

        if (!response.ok) {
            console.error("❌ Gagal mengirim kontrol pestisida:", result);
            const toggle = document.getElementById("pesticide-toggle");
            if (toggle) toggle.checked = !event.target.checked;
        }
    } catch (error) {
        console.error("⛔ Kesalahan saat mengirim kontrol pestisida:", error);
        const toggle = document.getElementById("pesticide-toggle");
        if (toggle) toggle.checked = !event.target.checked;
    }
}

function setupWebSocket() {
    if (globalWebSocket && globalWebSocket.readyState === WebSocket.OPEN) {
        console.log("🔗 WebSocket sudah terhubung.");
        return;
    }

    const socket = new WebSocket(WS_URL);
    globalWebSocket = socket;

    socket.onopen = () => {
        console.log("🔗 WebSocket connected");
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("📩 Data diterima dari WebSocket:", data);
        if (data.topic === "moisture/data") {
            const averageCircleElement = document.getElementById("average-circle");
            if (averageCircleElement) {
                let moistureData;
                try {
                    moistureData = typeof data.msg === "string" ? JSON.parse(data.msg) : data.msg;
                    updateMoistureData(moistureData);
                } catch (e) {
                    console.error("Gagal mem-parse data moisture dari WebSocket:", e);
                }
            } else {
                console.warn("⚠️ Elemen kelembapan tidak ditemukan di DOM, melewatkan update moisture/data.");
            }
        } else if (data.topic === "pesticide/status") {
            const pesticideToggleElement = document.getElementById("pesticide-toggle");
            if (pesticideToggleElement) {
                const pesticideStatus = data.msg;
                console.log(`💡 Status pestisida diterima via WebSocket: ${pesticideStatus}`);
                updatePesticideStatus(pesticideStatus);
            } else {
                console.warn("⚠️ Elemen pesticide-toggle tidak ditemukan di DOM, melewatkan update pesticide/status.");
            }
        }
    };

    socket.onclose = () => {
        console.log("❌ WebSocket disconnected. Mencoba reconnect dalam 3 detik...");
        globalWebSocket = null;
        setTimeout(setupWebSocket, 3000);
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        if (globalWebSocket) {
            globalWebSocket.close();
            globalWebSocket = null;
        }
    };
}

function closeWebSocket() {
    if (globalWebSocket && globalWebSocket.readyState === WebSocket.OPEN) {
        globalWebSocket.close();
        globalWebSocket = null;
        console.log("❌ WebSocket closed.");
    }
}

function updateMoistureData(data) {
    try {
        const moistureElements = [
            { id: "moisture1-value", value: `${data.moisture1}%`, circleId: "moisture1-circle" },
            { id: "moisture2-value", value: `${data.moisture2}%`, circleId: "moisture2-circle" },
            { id: "moisture3-value", value: `${data.moisture3}%`, circleId: "moisture3-circle" },
            { id: "average-value", value: `${data.average}%`, circleId: "average-circle" }
        ];

        moistureElements.forEach(({ id, value, circleId }) => {
            const element = document.getElementById(id);
            if (element) {
                element.innerText = value;
                const percent = parseInt(value);
                setProgressCircle(circleId, percent);
            } else {
                console.warn(`⚠️ Elemen ${id} tidak ditemukan di DOM saat updateMoistureData.`);
            }
        });
    } catch (error) {
        console.error("Gagal memproses data kelembapan dari WebSocket:", error);
    }
    updateStatusCondition(data.average, data.moisture_pump_status);
}

function updatePesticideStatus(status) {
    const toggle = document.getElementById("pesticide-toggle");
    const statusText = document.getElementById("pesticide-pump-status");

    const isActive = status === "ON" || status === true;

    if (toggle) {
        toggle.checked = isActive;
    } else {
        console.warn("⚠️ Elemen pesticide-toggle tidak ditemukan saat update status.");
    }

    if (statusText) {
        statusText.innerText = isActive ? "Aktif" : "Tidak Aktif";
        statusText.style.fontWeight = "bold";
        statusText.style.color = isActive ? "#00c853" : "#e53935";
    } else {
        console.warn("⚠️ Elemen pesticide-pump-status tidak ditemukan saat update status.");
    }
}

function updateStatusCondition(average, wateringStatus) {
    const conditionEl = document.getElementById("moisture-condition");
    const wateringEl = document.getElementById("watering-status");

    if (conditionEl) {
        let conditionText = "Tidak diketahui";
        let color = "#999";

        if (average < 50) {
            conditionText = "Kering";
            color = "#e53935"; 
        } else if (average <= 80) {
            conditionText = "Normal";
            color = "#fbc02d"; 
        } else {
            conditionText = "Basah";
            color = "#00cfd1"; 
        }

        conditionEl.innerText = conditionText;
        conditionEl.style.fontWeight = "bold";
        conditionEl.style.color = color;
    } else {
        console.warn("⚠️ Elemen moisture-condition tidak ditemukan saat update status kondisi.");
    }

    if (wateringEl) {
        wateringEl.innerText = wateringStatus ? "Aktif" : "Tidak Aktif";
        wateringEl.style.fontWeight = "bold";
        wateringEl.style.color = wateringStatus ? "#00c853" : "#e53935";
    } else {
        console.warn("⚠️ Elemen watering-status tidak ditemukan saat update status penyiraman.");
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker registered:', reg))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadPage("home");
});