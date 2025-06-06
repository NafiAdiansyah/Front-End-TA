import '../components/sensor-card.js';
import '../components/status-card.js';
import '../components/hourlyChart.js'

const homePage= () =>{
    const container = document.createElement("div");
    container.innerHTML=`
    <sensor-card></sensor-card>
    <div class="status-and-chart">
        <status-card></status-card>
        <hourly-chart></hourly-chart>
    </div>
    `;

    return container;
};

export default homePage;
