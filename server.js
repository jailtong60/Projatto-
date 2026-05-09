require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   ROTA CONTATO
========================= */

app.post("/contato", async (req, res) => {

    const { nome, email, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
        return res.status(400).json({
            erro: "Preencha todos os campos"
        });
    }

    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "Nova mensagem do site",
            html: `
                <h2>Nova mensagem</h2>

                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mensagem:</strong></p>
                <p>${mensagem}</p>
            `
        });

        res.status(200).json({
            sucesso: true,
            mensagem: "Mensagem enviada!"
        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            erro: "Erro ao enviar mensagem"
        });
    }
});

/* =========================
   SERVIDOR
========================= */

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});