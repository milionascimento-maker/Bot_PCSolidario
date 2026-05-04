const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');

// 1. Servidor de Monitoramento e Visualização de Código
const app = express();
const port = process.env.PORT || 3000;
let pinConexao = "Aguardando o WhatsApp carregar... Atualize a página em 1 minuto.";

app.get('/', (req, res) => {
    res.send('<h1>Bot PC Solidário Ativo!</h1><p>Acesse <b>/codigo</b> para ver o PIN de emparelhamento.</p>');
});

app.get('/codigo', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1>Código de Conexão WhatsApp</h1>
            <div style="background: #f0f0f0; padding: 20px; display: inline-block; border-radius: 10px;">
                <h2 style="color: #25D366; font-size: 40px; margin: 0;">${pinConexao}</h2>
            </div>
            <p>Número alvo: <b>5591985796419</b></p>
            <p><i>Atualize a página (F5) se o código ainda não apareceu.</i></p>
        </div>
    `);
});

app.listen(port, () => console.log(`✅ Servidor Web na porta ${port}`));

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
            '--disable-gpu',
            '--remote-debugging-port=9222',
            '--user-data-dir=/tmp/session-' + Date.now()
        ]
    }
});

// 3. Geração do Código de Emparelhamento
bot.on('qr', async (qr) => {
    console.log('⚠️ Página do WhatsApp carregada! Tentando gerar código...');
    try {
        const meuNumero = '559185796419'; 
        const code = await bot.requestPairingCode(meuNumero); 
        pinConexao = code; // Salva o código para exibir na rota /codigo
        console.log('------------------------------------------');
        console.log('👉 SEU CÓDIGO DE CONEXÃO É:', code);
        console.log('------------------------------------------');
    } catch (err) {
        pinConexao = "Erro ao gerar código. Tentando novamente...";
        console.log('Erro ao pedir código:', err);
    }
});

bot.on('ready', () => {
    pinConexao = "CONECTADO! ✅";
    console.log('🚀 PC Solidário ONLINE em Belém!');
});

// 4. Lógica de Atendimento
bot.on('message', async (msg) => {
    if (msg.from.endsWith('@g.us')) return;
    const texto = msg.body.toLowerCase().trim();

    if (['oi', 'olá', 'ola', 'menu'].some(p => texto.includes(p))) {
        await bot.sendMessage(msg.from, `Olá! 👋 Bem-vindo ao **PC Solidário**.\n\n1 - Doar equipamento\n2 - Sobre o projeto\n3 - Contato`);
    } else if (texto === '1') {
        await bot.sendMessage(msg.from, `📝 **FICHA DE DOAÇÃO**\nNome:\nEquipamento:\nDefeito (se houver):\nEndereço para busca:`);
    } else if (texto === '2') {
        await bot.sendMessage(msg.from, `O **PC Solidário** recondiciona computadores para inclusão digital em comunidades de Belém. ♻️`);
    } else if (texto === '3') {
        await bot.sendMessage(msg.from, `📍 Endereço: Senac Aristides Lobo.\n📸 Instagram: @pcsolidario`);
    }
});

// 5. Inicialização
bot.initialize();
