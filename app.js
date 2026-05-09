const form = document.getElementById("formContato");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const mensagem = document.getElementById("mensagem").value;

    try {

        const resposta = await fetch("http://localhost:3000/contato", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                nome,
                email,
                mensagem
            })
        });

        const dados = await resposta.json();

        if (dados.sucesso) {

            status.textContent = "Mensagem enviada com sucesso!";
            status.style.color = "#00ffae";

            form.reset();

        } else {

            status.textContent = dados.erro;
            status.style.color = "red";
        }

    } catch (erro) {

        status.textContent = "Erro no servidor";
        status.style.color = "red";
    }
});



