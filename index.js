const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const QRCode = require('qrcode');

const app = express();
const port = process.env.PORT || 3000;
let qrCodeImage = "";

// 1. Servidor para visualização do QR Code
app.get('/', (req, res) => {
    if (qrCodeImage) {
        res.send(`
            <div style="text-align: center; font-family: sans-serif; margin-top: 50px;">
                <h1>Escaneie para o PC Solidário</h1>
                <img src="${qrCodeImage}" style="border: 10px solid #eee; padding: 10px;">
                <p>Abra o WhatsApp > Aparelhos Conectados</p>
            </div>
        `);
    } else {
        res.send('<h1>Bot PC Solidário Conectado com Sucesso! ✅</h1>');
    }
});

app.listen(port, () => console.log(`✅ Servidor na porta ${port}`));

// 2. Configuração do Bot
const bot = new Client({
    puppeteer: {
        headless: true,
        executablePath: './chrome-linux/chrome',
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--disable-dev-shm-usage', 
            '--no-zygote', 
            '--single-process', 
            '--disable-gpu'
        ]
    }
});

bot.on('qr', (qr) => {
    QRCode.toDataURL(qr, (err, url) => { qrCodeImage = url; });
});

bot.on('ready', () => {
    qrCodeImage = ""; // Limpa o QR após conectar
    console.log('🚀 PC Solidário ONLINE!');
});

// 3. Lógica de Atendimento com melhorias
bot.on('message', async (msg) => {
    if (msg.from.endsWith('@g.us')) return;

    const chat = await msg.getChat();
    const texto = msg.body.toLowerCase().trim();

    // Função interna para simular digitação
    const responderComAtraso = async (conteudo) => {
        await chat.sendStateTyping();
        await new Promise(res => setTimeout(res, 2000)); // Espera 2 segundos
        await bot.sendMessage(msg.from, conteudo);
    };

    const saudações = ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'menu', 'início', 'inicio'];

    // MENU PRINCIPAL
    if (saudações.includes(texto)) {
        await responderComAtraso(
            `Olá! 👋 Bem-vindo ao *PC Solidário*.\n\n` +
            `Como podemos te ajudar?\n\n` +
            `1️⃣ - Quero doar um equipamento\n` +
            `2️⃣ - Conhecer o projeto\n` +
            `3️⃣ - Local de entrega\n\n` +
            `*Digite apenas o número da opção.*`
        );
    } 

    // OPÇÃO 1: FICHA DE DOAÇÃO
    else if (texto === '1') {
        await responderComAtraso(
            `📝 *FICHA DE DOAÇÃO*\n\n` +
            `Por favor, preencha os dados abaixo:\n` +
            `* *Nome:* \n` +
            `* *O que quer doar?:* \n` +
            `* *Funciona?:* \n` +
            `* *Não? Qual é o problema?:* \n` +
            `* *Pode levar até a unidade?:* \n` +
            `* *Não? Onde podemos buscar?:* \n\n` +
            `_Dica: Você pode copiar esta mensagem, preencher e nos enviar de volta!_ 🤝♻️`
        );
    }

    // OPÇÃO 2: SOBRE O PROJETO (REVISADO)
    else if (texto === '2') {
        await responderComAtraso(
            `O **PC Solidário** é um projeto social que visa arrecadar e recondicionar computadores em desuso para doação em comunidades de Belém! ♻️\n\n` +
            `Com a parceria do **Senac**, os alunos do curso Técnico em Informática são os responsáveis por tomar a frente do projeto, fazendo o marketing e a manutenção dos materiais arrecadados. 🛠️\n\n` +
            `Por fim, todo equipamento que não tem possibilidade de recondicionamento recebe o descarte ecológico correto, através de uma equipe própria para essa finalidade.\n\n` +
            `Venha e faça parte dessa rede de solidariedade! Ajude uma comunidade a ter acesso à inclusão digital e a novas oportunidades. ✨`
        );
    }

    // OPÇÃO 3: LOCAL DE ENTREGA
    else if (texto === '3') {
        await responderComAtraso(
            `📍 *Endereço:* R. Aristides Lobo, 1058 - Campina, Belém - PA, 66017-010\n` +
            `🗺️ https://maps.app.goo.gl/GRRE6omOpJIR8ESLv\n\n` +
            `📸 *Instagram:* @pcsolidario\n\n` +
            `Aguardamos você! 🚀`
        );
    }
});

bot.initialize();
