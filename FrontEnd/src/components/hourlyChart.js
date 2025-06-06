import Chart from 'chart.js/auto';

class HourlyChart extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="chart-card">
        <h3>Grafik Rata-rata Kelembaban per Jam</h3>
        <canvas id="moistureChart" width="400" height="200"></canvas>
        </div>
        `;
        this.fetchAndRenderChart();
    }

    async fetchAndRenderChart() {
        try {
            const response = await fetch("https://naffscg.my.id/moisture/hourly");
            const data = await response.json();

            const labels = data.map(item => new Date(item.hour_timestamp).toLocaleTimeString());
            const values = data.map(item => item.average_value);

            const barColors = values.map(value => {
                if (value < 20) return '#ef5350';       // merah (kering)
                else if (value < 40) return '#fdd835';  // kuning (cukup)
                else return '#26c6da';                  // biru (basah)
            });

            const ctx = this.querySelector("#moistureChart").getContext("2d");

            new Chart(ctx, {
                type: 'bar', // 🔄 ubah dari 'line' ke 'bar'
                data: {
                    labels,
                    datasets: [{
                        label: 'Kelembapan / Jam',
                        data: values,
                        backgroundColor: barColors, // 🔄 gunakan backgroundColor untuk bar
                        borderColor: barColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Kelembapan (%)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Jam'
                            }
                        }
                    }
                }
            });
        } catch (err) {
            console.error("❌ Gagal fetch data chart:", err);
        }
    }
}

customElements.define('hourly-chart', HourlyChart);
