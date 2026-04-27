// falle com nosco =========
document.getElementById("formContato").addEventListener("submit", function(e) {
    e.preventDefault();

    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let mensagem = document.getElementById("mensagem").value;
    let status = document.getElementById("status");

    if (nome === "" || email === "" || mensagem === "") {
        status.textContent = "Preencha todos os campos!";
        status.style.color = "red";
        return;
    }

    status.textContent = "Mensagem enviada com sucesso!";
    status.classList.add("show");
    status.style.color = "#00ffae";

    this.reset();
    setTimeout(() => {
    status.classList.remove("show");
    }, 3000);
});




