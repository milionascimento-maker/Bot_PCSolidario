const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const QRCode = require('qrcode');

const app = express();
const port = process.env.PORT || 3000;
let qrCodeImage = "";

app.get('/', (req, res) => {
    if (qrCodeImage) {
        res.send(`
            <div style="text-align: center; font-family: sans-serif; margin-top: 50px;">
                <h1>Escaneie para o PC Solidário</h1>
                <img src="${qrCodeImage}">
                <p>Abra o WhatsApp > Aparelhos Conectados</p>
            </div>
        `);
    } else {
        res.send('<h1>Bot PC Solidário Conectado com Sucesso! ✅</h1>');
    }
});

app.listen(port, () => console.log(`✅ Servidor na porta ${port}`));

const bot = new Client({
    puppeteer: {
        headless: true,
        executablePath: './chrome-linux/chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--no-zygote', '--single-process', '--disable-gpu']
    }
});

bot.on('qr', (qr) => {
    QRCode.toDataURL(qr, (err, url) => { qrCodeImage = url; });
});

bot.on('ready', () => {
    qrCodeImage = ""; // Limpa o QR após conectar
    console.log('🚀 PC Solidário ONLINE!');
});

// --- LÓGICA DE ATENDIMENTO ATUALIZADA ---
bot.on('message', async (msg) => {
    // Ignorar mensagens de grupos
    if (msg.from.endsWith('@g.us')) return;

    const texto = msg.body.toLowerCase().trim();

    // 1. Saudações (Oi, Olá, Bom dia, Boa tarde, Boa noite)
    const saudações = ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'menu'];
    
    if (saudações.includes(texto)) {
        await bot.sendMessage(msg.from, 
            `Olá! 👋 Bem-vindo ao **PC Solidário**.\n\n` +
            `Como podemos te ajudar hoje?\n\n` +
            `1 - Quero doar um equipamento\n` +
            `2 - Conhecer o projeto\n` +
            `3 - Local de entrega e contatos\n\n` +
            `*Digite apenas o número da opção.*`
        );
    } 
    
    // 2. Opção 1 - Doação
    else if (texto === '1') {
        await bot.sendMessage(msg.from, 
            `📝 **FICHA DE DOAÇÃO**\n\n` +
            `Por favor, preencha os dados abaixo:\n\n` +
            `• O que quer doar?:\n` +
            `• Funciona?:\n` +
            `• Onde podemos buscar?:`
        );
    }

    // 3. Opção 2 - Sobre o Projeto
    else if (texto === '2') {
        await bot.sendMessage(msg.from, 
            `O **PC Solidário** recondiciona computadores em desuso para doação em comunidades de Belém! ♻️`
        );
    }

    // 4. Opção 3 - Contato e Local
    else if (texto === '3') {
        await bot.sendMessage(msg.from, 
            `📍 **Endereço:** Senac Aristides Lobo, Belém.\n` +
            `📸 **Instagram:** @pcsolidario`
        );
    }
});

bot.initialize();
