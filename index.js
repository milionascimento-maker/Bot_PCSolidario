const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');

// 1. Servidor de Monitoramento (Essencial para o Render)
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot PC Solidário Ativo!'));
app.listen(port, () => console.log(`✅ Servidor Web na porta ${port}`));

// 2. Configuração do Bot (Isolamento Total)
const bot = new Client({
    // LocalAuth desativado temporariamente para limpar erros de sessão anteriores
    // authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }), 
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
    console.log('⚠️ Página do WhatsApp carregada!');
    try {
        // Número formatado conforme sua informação
        const meuNumero = '5591985796419'; 
        const code = await bot.requestPairingCode(meuNumero); 
        console.log('------------------------------------------');
        console.log('👉 SEU CÓDIGO DE CONEXÃO É:', code);
        console.log('------------------------------------------');
        console.log('No celular: Aparelhos Conectados > Conectar com número de telefone');
    } catch (err) {
        console.log('Aguardando carregamento para gerar código...');
    }
});

bot.on('ready', () => {
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
