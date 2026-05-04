const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const QRCode = require('qrcode');

const app = express();
const port = process.env.PORT || 3000;
let qrCodeImage = ""; // Onde salvaremos o QR Code

// Rota para ver o QR Code
app.get('/', (req, res) => {
    if (qrCodeImage) {
        res.send(`
            <div style="text-align: center; font-family: sans-serif; margin-top: 50px;">
                <h1>Escaneie o QR Code - PC Solidário</h1>
                <img src="${qrCodeImage}" style="border: 10px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <p>Abra o WhatsApp > Aparelhos Conectados > Conectar um aparelho</p>
                <p><i>Atualize a página se o código expirar.</i></p>
            </div>
        `);
    } else {
        res.send('<h1>Aguardando geração do QR Code...</h1><p>Atualize em 30 segundos.</p>');
    }
});

app.listen(port, () => console.log(`✅ Servidor na porta ${port}`));

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
            '--disable-gpu',
            '--user-data-dir=/tmp/session-' + Date.now()
        ]
    }
});

// Transforma o QR Code em imagem (Base64)
bot.on('qr', (qr) => {
    QRCode.toDataURL(qr, (err, url) => {
        qrCodeImage = url;
        console.log('✅ Novo QR Code gerado!');
    });
});

bot.on('ready', () => {
    qrCodeImage = "<h1>CONECTADO! ✅</h1>";
    console.log('🚀 PC Solidário ONLINE!');
});

bot.on('message', async (msg) => {
    if (msg.body.toLowerCase() === 'oi') {
        await bot.sendMessage(msg.from, 'Olá! O bot do PC Solidário está funcionando via QR Code! ♻️');
    }
});

bot.initialize();
