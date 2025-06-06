import Swal from "sweetalert2";
import 'font-awesome/css/font-awesome.min.css';

const API_URL = "https://naffscg.my.id";

export default function schedulePage() {
  const container = document.createElement("div");

  const style = document.createElement("style");
  style.textContent = `
 .schedule-wrapper {
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
  margin-top: 1rem;
}

.schedule-container {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  max-width: 1000px;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
}

.schedule-block,
.list-container {
  background-color: #ecfae5d0;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.schedule-block h3,
.list-container h3 {
  margin-bottom: 2rem;
  margin-top: 0.5rem;
  text-align: center;
}

.schedule-block h3{
padding: 5px;
    background: #B0DB9C;
    color: #3b3a3a;
    border-radius: 12px;
    text-align: center;
}

.schedule-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.schedule-form label {
  display: flex;
  flex-direction: column;
  font-weight: 500;
  color: #333;
}

.schedule-form input {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  margin-top: 0.25rem;
}

.schedule-form button {
  margin-top: 1rem;
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  width: fit-content;
  align-self: center;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: bold;
}

.schedule-form button:hover {
  background-color: #45a049;
}

#schedule-list {
  list-style-type: none;
  padding: 0;
  margin-top: 1rem;
}

.list-container h3 {
    padding: 5px;
    background: #B0DB9C;
    color: #3b3a3a;
    border-radius: 12px;
    text-align: center;
}

#schedule-list li {
  background-color: #f9f9f9;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#schedule-list button {
  background-color: #e74c3c;
  border: none;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  justify-content: center;
}

.schedule-list button:hover{
  background-color: #c0392b;
}

.schedule-list button i{
  color: white;
  font-size: 0.8rem;
  pointer-events: none;
}

/* Responsif untuk mobile */
@media (max-width: 768px) {
  .schedule-container {
    flex-direction: column;
    align-items: center;
    margin: 1rem;
  }
}

  `;

  document.head.appendChild(style);

  container.innerHTML = `
  <div class="schedule-wrapper">
    <div class="schedule-container">
      <div class="schedule-block">
        <h3>Penjadwalan Pompa Pestisida</h3>
        <form id="schedule-form" class="schedule-form">
          <label>Jam (24 jam):
            <input type="number" id="hour" min="0" max="23" required>
          </label>
          <label>Menit:
            <input type="number" id="minute" min="0" max="59" required>
          </label>
          <label>Durasi (detik):
            <input type="number" id="duration" min="1" required>
          </label>
          <button type="submit">Simpan Jadwal</button>
        </form>
        <div id="schedule-message"></div>
      </div>

      <div class="list-container">
        <h3>Daftar Jadwal</h3>
        <ul id="schedule-list"></ul>
      </div>
    </div>
  </div>
  `;

  const form = container.querySelector("#schedule-form");
  const message = container.querySelector("#schedule-message");
  const list = container.querySelector("#schedule-list");

  async function loadSchedules() {
    list.innerHTML = "Memuat...";
    try {
      const res = await fetch(`${API_URL}/api/schedules`);
      const schedules = await res.json();
      if (!Array.isArray(schedules)) throw new Error("Format tidak valid");

      list.innerHTML = "";

      if(schedules.length ===0){
        list.innerHTML = "<li style='text-align:center; color:#777';>Tidak ada jadwal tersimpan</li>"
        return;
      }

      schedules.forEach(schedule => {
        const li = document.createElement("li");
        li.innerHTML = `
          Jam: ${schedule.hour}:${schedule.minute.toString().padStart(2, '0')} -
          Durasi: ${schedule.duration}s
          <button data-id="${schedule.id}">
          <i class="fa fa-trash"></i>
          </button>
        `;
        list.appendChild(li);
      });

      list.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.getAttribute("data-id");

          const confirm = await Swal.fire({
            title: 'Yakin ingi menghapus jadwal ini?',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: 'Ya, hapus',
            cancelButonText: 'Batal'
          });

          if(confirm.isConfirmed){
            await fetch(`${API_URL}/api/schedules/${id}`,{ method : "DELETE"});

            Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Jadwal berhasil dihapus',
              timer: 1500,
              showConfirmButton: false
            });

            loadSchedules();
          }
        });
      });

    } catch (err) {
      list.innerHTML = "Gagal memuat jadwal.";
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const hour = parseInt(document.getElementById("hour").value);
    const minute = parseInt(document.getElementById("minute").value);
    const duration = parseInt(document.getElementById("duration").value);

    const response = await fetch(`${API_URL}/api/schedules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hour, minute, duration })
    });

    const result = await response.json();
    Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: result.message || 'Jadwal berhasil disimpan',
      timer: '2000',
      showConfirmButton: false
    })
    form.reset();
    loadSchedules(); // reload list
  });

  loadSchedules(); // load once on page open

  return container;
}