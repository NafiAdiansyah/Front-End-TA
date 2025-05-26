class StatusCard extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
                <div class="status-content">
                <div class="status-header"><span class="header-text">Status</span></div>
                    <div class="average-section">
                        <p>Rata-rata kelembaban tanah</p>
                        <div class="progress-circle big" id="average-circle">
                            <span id="average-value">0%</span>
                        </div>
                    </div>

                    <div class="text-status">
                        <p>Kondisi Kelembaban : <span id="moisture-condition">Tidak diketahui</span></p>
                        <p>Penyiraman Air : <span id="watering-status">Tidak Aktif</span></p>
                        <p>Penyemprot Pestisida : <span id="pesticide-pump-status">Tidak Aktif</span></p>
                    </div>
                </div>

        `;
    }
}
customElements.define('status-card', StatusCard);
