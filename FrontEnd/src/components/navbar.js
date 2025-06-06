import logo from '../images/WW-logo.png';

class Navbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <style>
            .navbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 20px;
                background-color: #B0DB9C;
                color: #3b3a3a;
                position: relative;
                z-index: 10;
            }

            .logo-left {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .logo {
                font-weight: bold;
                font-size: 1.2em;
            }

            .hamburger {
                display: none;
                flex-direction: column;
                cursor: pointer;
                width: 30px;
                height: 24px;
                justify-content: space-between;
                z-index: 20;
            }

            .hamburger div {
                height: 4px;
                background-color: #3b3a3a;
                border-radius: 2px;
                transition: 0.3s ease;
            }

            .hamburger.active div:nth-child(1) {
                transform-origin: 0 0;
                transform: rotate(45deg) translate(0px, -1px);

            }

            .hamburger.active div:nth-child(2) {
                opacity: 0;
            }

            .hamburger.active div:nth-child(3) {
                transform-origin: 0 100%;
                transform: rotate(-45deg) translate(1px, 0);
            }

            .nav-left {
                display: flex;
                gap: 15px;
            }

            .nav-left a {
                color: #3b3a3a;
                font-weight: bold;
                text-decoration: none;
                transition: color 0.3s;
            }

            .nav-left a:hover {
                color: #fff;
            }

            @media (max-width: 768px) {
                .hamburger {
                    display: flex;
                }

                .nav-left {
                    flex-direction: column;
                    background-color: #B0DB9C;
                    position: absolute;
                    top: 50px;
                    right: 0;
                    width: 100%;
                    padding: 10px 0;
                    opacity: 0;
                    pointer-events: none;
                    transform: translateY(-10px);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }

                .nav-left.show {
                    opacity: 1;
                    pointer-events: auto;
                    transform: translateY(0);
                }
            }
        </style>

        <nav class="navbar">
            <div class="logo-left">
                <img src="${logo}" alt="Logo" style="height:30px;" />
                <span class="logo">Smart Chili Garden</span>
            </div>
            <div class="hamburger" id="hamburger">
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div class="nav-left" id="nav-links">
                <a href="#" id="home-link">Home</a>
                <a href="#" id="schedule-link">Schedule</a>
                <a href="#" id="about-link">About</a>
            </div>
        </nav>
        `;

        const hamburger = this.querySelector("#hamburger");
        const navLinks = this.querySelector("#nav-links");

        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("show");
            hamburger.classList.toggle("active");
        });

        this.querySelector("#home-link").addEventListener("click", (e) => {
            e.preventDefault();
            navLinks.classList.remove("show");
            hamburger.classList.remove("active");
            loadPage("home");
        });

        this.querySelector("#about-link").addEventListener("click", (e) => {
            e.preventDefault();
            navLinks.classList.remove("show");
            hamburger.classList.remove("active");
            loadPage("about");
        });

        this.querySelector("#schedule-link").addEventListener("click", (e) => {
            e.preventDefault();
            navLinks.classList.remove("show");
            hamburger.classList.remove("active");
            loadPage("schedule");
        });
    }
}

customElements.define('nav-bar', Navbar);
