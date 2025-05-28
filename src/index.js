import homePage from "./pages/home.js";
import aboutPage from "./pages/about.js";
import "./components/navbar.js";
import 'font-awesome/css/font-awesome.min.css';
import "./styles.css";

const API_URL = "https://backend-ta-production-fa27.up.railway.app";
const WS_URL = "8f3fd6867485477db38c34b326a4073b.s1.eu.hivemq.cloud:8884/mqtt";

window.loadPage = (page) => {
    if (page === "home") {
        homePage();
        setupEventListeners(); // Tambahkan ini
    }
    if (page === "about") aboutPage();
};


document.addEventListener("DOMContentLoaded", () => {
    loadPage("home");
    fetchPesticideStatus();
    setupWebSocket();
});

  function setupEventListeners() {
    const checkInterval = setInterval(() => {
        const averageCircle = document.getElementById("average-circle");
        if (averageCircle) {
            clearInterval(checkInterval);
            console.log("✅ average-circle ditemukan di DOM, setup WebSocket dimulai");
            fetchPesticideStatus();
            setupWebSocket();
        } else {
            console.log("⏳ Menunggu average-circle...");
        }
    }, 100);

    const pesticideToggle = document.getElementById("pesticide-toggle");
    if (pesticideToggle) {
        pesticideToggle.addEventListener("change", handlePesticideToggle);
    } else {
        console.error("❌ Elemen pesticide-toggle tidak ditemukan!");
    }
}

//Update warna dan progress bar
function setProgressCircle(circleId, percentage){
    const circle = document.getElementById(circleId);
    if(!circle) return;

    let color = "#00cfd1";
    if(percentage<40){
        color="#e53935";
    }else if(percentage <60){
        color="#fbc02d";
    }

    circle.style.background=`conic-gradient(${color} 0% ${percentage}%, #eee ${percentage}% 100%)`;

    circle.setAttribute("data-tooltip", `${percentage}%`)
}

// ✅ Fungsi untuk mendapatkan status pestisida
async function fetchPesticideStatus() {
    try {
        const response = await fetch(`${API_URL}/pesticide/status`);
        if (!response.ok) throw new Error("Gagal mengambil status pestisida");

        const data = await response.json();
        updatePesticideStatus(data.status);
    } catch (error) {
        console.error("⛔ Gagal mengambil status pestisida:", error);
    }
}

// ✅ Fungsi untuk mengontrol pompa pestisida
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

        if (response.ok) {
            updatePesticideStatus(status);
        } else {
            console.error("❌ Gagal mengirim kontrol pestisida:", result);
        }
    } catch (error) {
        console.error("⛔ Kesalahan saat mengirim kontrol pestisida:", error);
    }
}

// ✅ Fungsi untuk menerima update WebSocket
function setupWebSocket() {
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
        console.log("🔗 WebSocket connected");
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("📩 Data diterima dari WebSocket:", data);

        if (data.topic === "moisture/data") {
            let moistureData;
            try{
                moistureData = typeof data.msg === "string"? JSON.parse(data.msg) : data.msg;
                updateMoistureData(moistureData);
            }
            catch(e){
                console.error("Gagal mem-parse data moisture:",e);
            }
        }
    };

    socket.onclose = () => {
        console.log("❌ WebSocket disconnected. Mencoba reconnect dalam 3 detik...");
        setTimeout(setupWebSocket, 3000);
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };
}

// ✅ Fungsi untuk update data kelembapan tanah secara real-time
function updateMoistureData(data) {
    try {
        const moistureElements = [
            { id: "moisture1-value", value: `${data.moisture1}%` },
            { id: "moisture2-value", value: `${data.moisture2}%` },
            { id: "moisture3-value", value: `${data.moisture3}%` },
            { id: "average-value", value: `${data.average}%` }
        ];

        moistureElements.forEach(({ id, value }) => {
            const element = document.getElementById(id);
            if (element) {
                element.innerText = value;
                const percent = parseInt(value);
                const circleId = id.replace("-value","-circle");
                setProgressCircle(circleId,percent);
            } else {
                console.warn(`⚠️ Elemen ${id} tidak ditemukan di DOM!`);
            }
        });
    } catch (error) {
        console.error("Gagal memproses data kelembapan dari WebSocket:", error);
    }
    // Update kondisi kelembapan dan status penyiraman
updateStatusCondition(data.average, data.moisture_pump_status);

}

// ✅ Fungsi untuk update status pestisida secara real-time
function updatePesticideStatus(status) {
    const toggle = document.getElementById("pesticide-toggle");
    const statusText = document.getElementById("pesticide-pump-status");

    if (toggle) toggle.checked = status === "ON" || status === true;

    if (statusText) {
        const isActive = status === "ON" || status === true;

        statusText.innerText = isActive ? "Aktif" : "Tidak Aktif";
        statusText.style.fontWeight = "bold";
        statusText.style.color = isActive ? "#00c853" : "#999"; // Hijau atau abu-abu
    }
}


function updateStatusCondition(average, wateringStatus) {
    const conditionEl = document.getElementById("moisture-condition");
    const wateringEl = document.getElementById("watering-status");

    if (conditionEl) {
        let conditionText = "Tidak diketahui";
        let color = "#999"; // Default abu-abu

        if (average < 50) {
            conditionText = "Kering";
            color = "#e53935"; // Merah
        } else if (average <= 85) {
            conditionText = "Normal";
            color = "#fbc02d"; // Kuning
        } else {
            conditionText = "Basah";
            color = "#00cfd1"; // Biru
        }

        conditionEl.innerText = conditionText;
        conditionEl.style.fontWeight = "bold";
        conditionEl.style.color = color;
    }

    if (wateringEl) {
        wateringEl.innerText = wateringStatus ? "Aktif" : "Tidak Aktif";
        wateringEl.style.fontWeight = "bold";
        wateringEl.style.color = wateringStatus ? "#00c853" : "#999";
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('Service Worker registered:', reg))
    .catch(err => console.error('Service Worker registration failed:', err));
    });
}



console.log("⏱️ Cek average-circle:", document.getElementById("average-circle"));

