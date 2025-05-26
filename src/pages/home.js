import '../components/sensor-card.js';
import '../components/status-card.js';
import '../components/hourlyChart.js'




export default function homePage(){
    const app = document.getElementById("app");

    app.innerHTML=`
    <sensor-card></sensor-card>
    <div class="status-and-chart">
        <status-card></status-card>
        <hourly-chart></hourly-chart>
    </div>
    `;
}
