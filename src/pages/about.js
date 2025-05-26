import logo from '../images/WW-logo.png';
import questionPeople from '../images/question-people.png';
import nafiImg from '../images/nafi.png';

const aboutPage = () => {
    document.getElementById("app").innerHTML = `
        <section id="hero-about">
    <div class="row">
      <div class="image-col">
        <img src="${logo}" alt="logo Wisata Wonders" class="img-fluid" width="320" height="320">
      </div>
      <div class="text-col">
        <h1 class="display-6">About us</h1>
        <p class="lead"><strong class="color-ww">Smart Chili Garden </strong>merupakan proyek implementasi sistem Internet of Things untuk melakukan monitoring kelembaban tanah yang disertai penyiraman air otomatis dan kontrol manual pada pompa Pestisida.</p>
      </div>
    </div>
  </section>

  <!-- Why Section -->
  <section id="hero-why">                                       
    <div class="row reverse">
      <div class="image-col">
        <img src="${questionPeople}" alt="people question" class="img-fluid" width="360" height="360">
      </div>
      <div class="text-col">
        <h1 class="display-6">Kenapa Smart Chili Garden?</h1>
        <p class="lead">"Smart Chili Garden" dipilih sebagai nama karena sistem ini secara khusus dirancang untuk mendukung budidaya cabai (chili) secara cerdas melalui implementasi IoT yang memungkinkan monitoring kelembaban tanah secara real-time, penyiraman air otomatis, serta kontrol manual pompa pestisida melalui website, sehingga meningkatkan efisiensi dan kemudahan dalam pengelolaan tanaman.</p>
      </div>
    </div>
  </section>

  <!-- Team Section -->
  <section id="Team">
    <div class="text-center">
      <h2>Profile</h2>
      <p class="lead">Developer Website</p>
    </div>

    <div class="team-grid">
      <!-- Card 1 -->
      <div class="card nafi">
        <img src="${nafiImg}" alt="Profile1" class="profile-img">
        <h5 class="card-title">Moh.Alim Nafi' Adiansyah</h5>
        <p class="card-text">Fullstack</p>
        <div class="socials">
          <a href="#"><button class="icons-size"><i class="fa fa-whatsapp"></i></button></a>
          <a href="https://www.instagram.com/nafiadnsyh_" target="_blank"><button class="icons-size"><i class="fa fa-instagram"></i></button></a>
          <a href="https://www.linkedin.com/in/moh-alim-nafi-adiansyah-01397b220/" target="_blank"><button class="icons-size"><i class="fa fa-linkedin-square"></i></button></a>
          <a href="https://github.com/NafiAdiansyah" target="_blank"><button class="icons-size"><i class="fa fa-github"></i></button></a>
        </div>
      </div>
  </section>    
    `;
};

export default aboutPage;
