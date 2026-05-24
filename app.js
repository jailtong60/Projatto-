class ContactForm {
    constructor() {
        this.form = document.getElementById("formContato");
        this.status = document.getElementById("status");
        this.btnSubmit = this.form.querySelector("button[type='submit']");
        this.apiUrl = this.getApiUrl();
        this.requestTimeout = 8000;
        this.init();
    }

    getApiUrl() {
        const isProduction = window.location.hostname !== "localhost";
        return isProduction
            ? `${window.location.protocol}//${window.location.host}/contato`
            : "http://localhost:5500/contato";
    }

    init() {
        this.form.addEventListener("submit", (e) => this.handleSubmit(e));
        this.setupInputValidation();
    }

    setupInputValidation() {
        const inputs = this.form.querySelectorAll("input, textarea");
        inputs.forEach(input => {
            input.addEventListener("change", () => this.validateInput(input));
            input.addEventListener("blur", () => this.validateInput(input));
        });
    }

    validateInput(input) {
        if (input.type === "email") {
            const isValid = this.isValidEmail(input.value.trim());
            input.setAttribute("aria-invalid", !isValid && input.value !== "");
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailRegex.test(email);
    }

    validateForm() {
        const nome = this.form.nome.value.trim();
        const email = this.form.email.value.trim();
        const mensagem = this.form.mensagem.value.trim();

        if (!nome || !email || !mensagem) {
            this.showStatus("❌ Preencha todos os campos obrigatórios", "error");
            return null;
        }

        if (nome.length > 100) {
            this.showStatus("❌ Nome muito longo (máximo 100 caracteres)", "error");
            return null;
        }

        if (!this.isValidEmail(email)) {
            this.showStatus("❌ E-mail inválido", "error");
            return null;
        }

        if (mensagem.length < 10) {
            this.showStatus("❌ Mensagem muito curta (mínimo 10 caracteres)", "error");
            return null;
        }

        if (mensagem.length > 5000) {
            this.showStatus("❌ Mensagem muito longa (máximo 5000 caracteres)", "error");
            return null;
        }

        return { nome, email, mensagem };
    }

    showStatus(message, type) {
        this.status.textContent = message;
        this.status.setAttribute("role", "alert");
        this.status.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
        this.status.className = type;

        if (type === "success") {
            setTimeout(() => {
                this.status.textContent = "";
            }, 5000);
        }
    }

    disableSubmit() {
        this.btnSubmit.disabled = true;
        this.btnSubmit.setAttribute("aria-busy", "true");
        this.btnSubmit.textContent = "📤 Enviando...";
    }

    enableSubmit() {
        this.btnSubmit.disabled = false;
        this.btnSubmit.setAttribute("aria-busy", "false");
        this.btnSubmit.textContent = "Enviar Mensagem";
    }

    async handleSubmit(e) {
        e.preventDefault();

        const dados = this.validateForm();
        if (!dados) return;

        this.disableSubmit();

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

            const response = await fetch(this.apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            await this.handleResponse(response);

        } catch (error) {
            if (error.name === "AbortError") {
                this.showStatus("❌ Requisição expirou. Tente novamente.", "error");
            } else if (error instanceof TypeError) {
                this.showStatus("❌ Erro de conexão. Verifique sua internet.", "error");
            } else {
                this.showStatus("❌ Erro ao enviar mensagem. Tente novamente.", "error");
            }
            console.error("Erro na requisição:", error);
        } finally {
            this.enableSubmit();
        }
    }

    async handleResponse(response) {
        try {
            const dados = await response.json();

            switch (response.status) {
                case 200:
                    if (dados.sucesso) {
                        this.showStatus("✅ Mensagem enviada com sucesso!", "success");
                        this.form.reset();
                    } else {
                        this.showStatus(`❌ ${dados.erro}`, "error");
                    }
                    break;
                case 429:
                    this.showStatus(`⏱️ ${dados.erro}`, "warning");
                    break;
                case 400:
                    this.showStatus(`❌ ${dados.erro}`, "error");
                    break;
                case 500:
                    this.showStatus("❌ Erro no servidor. Tente novamente mais tarde.", "error");
                    break;
                default:
                    this.showStatus("❌ Erro desconhecido. Tente novamente.", "error");
            }
        } catch {
            this.showStatus("❌ Erro ao processar resposta do servidor.", "error");
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new ContactForm();
});


/* =========================================
LOADER
========================================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        document.querySelector(".loader")
        .classList.add("hide");

    }, 1800);

});

/* =========================================
CURSOR
========================================= */

const cursor = document.querySelector(".cursor");
const blur = document.querySelector(".cursor-blur");

document.addEventListener("mousemove", (e) => {

    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";

    blur.style.left = e.clientX + "px";
    blur.style.top = e.clientY + "px";

});

/* =========================================
PARTICLES
========================================= */

particlesJS("particles-js", {

    particles: {

        number: {
            value: 80
        },

        color: {
            value: "#00d4ff"
        },

        opacity: {
            value: 0.3
        },

        size: {
            value: 3
        },

        line_linked: {
            enable: true,
            opacity: 0.15
        },

        move: {
            speed: 1.2
        }

    }

});

/* =========================================
REVEAL
========================================= */

const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", reveal);

function reveal(){

    reveals.forEach((element) => {

        const windowHeight = window.innerHeight;
        const revealTop = element.getBoundingClientRect().top;

        if(revealTop < windowHeight - 100){

            element.classList.add("active");

        }

    });

}

reveal();

/* =========================================
GSAP
========================================= */

gsap.registerPlugin(ScrollTrigger);

gsap.from(".title-anim", {

    y:120,
    opacity:0,
    duration:1.5,
    ease:"power4.out"

});

gsap.from(".intro", {

    y:80,
    opacity:0,
    duration:1.5,
    delay:.2,
    ease:"power4.out"

});

/* =========================================
MENU MOBILE
========================================= */

const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => {

    menu.classList.toggle("active");

});