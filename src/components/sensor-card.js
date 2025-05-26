class SensorCard extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <section class="container-sensor">
            <div class="moisture-card">
                <div class="sensor-label">Sensor 1</div>
                <div class="progress-circle" id="moisture1-circle">
                    <span id="moisture1-value">0%</span>
                </div>
            </div>

            <div class="moisture-card">
                <div class="sensor-label">Sensor 2</div>
                <div class="progress-circle" id="moisture2-circle">
                    <span id="moisture2-value">0%</span>
                </div>
            </div>

            <div class="moisture-card">
                <div class="sensor-label">Sensor 3</div>
                <div class="progress-circle" id="moisture3-circle">
                    <span id="moisture3-value">0%</span>
                </div>
            </div>

            <div class="moisture-card">
                <div class="sensor-label pest">Kontrol Pestisida</div>
                <label class="switch">
                    <input type="checkbox" id="pesticide-toggle">
                    <span class="slider"></span>
                </label>
                <p id="pesticide-status">OFF/ON</p>
            </div>
        </section>
        `;
    }
}
customElements.define('sensor-card', SensorCard);
