const { Client, LocalAuth } = require('whatsapp-web.js');

const bot = new Client({
    authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth'
    }),
    puppeteer: {
        headless: true,
        executablePath: './chrome-linux/chrome',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--no-zygote',
            '--single-process'
        ]
    }
});

// ALTERAÇÃO AQUI: Em vez de QR Code, gera o código de 8 dígitos
bot.on('qr', async (qr) => {
    console.log('⚠️ O QR Code foi gerado, mas vamos usar o Código de Emparelhamento...');
    try {
        // COLOQUE SEU NÚMERO ABAIXO (Ex: 5591988887777)
        const code = await bot.requestPairingCode('55919XXXXXXXX'); 
        console.log('✅ SEU CÓDIGO DE CONEXÃO É:', code);
        console.log('No celular: Aparelhos Conectados > Conectar com número de telefone.');
    } catch (err) {
        console.error('Erro ao gerar código:', err);
    }
});

bot.on('ready', () => {
    console.log('🚀 PC Solidário Online em Belém!');
});

bot.on('message', async (msg) => {
    if (msg.from.endsWith('@g.us')) return;

    const chat = await msg.getChat();
    const texto = msg.body.toLowerCase().trim();

    const digitar = async () => {
        await chat.sendStateTyping();
        await new Promise(res => setTimeout(res, 2000));
    };

    if (['oi', 'olá', 'ola', 'menu', 'bom dia', 'boa tarde', 'boa noite'].includes(texto)) {
        await digitar();
        await bot.sendMessage(msg.from, 
            `Olá! 👋 Bem-vindo ao **PC Solidário**.\n\n` +
            `Como podemos te ajudar hoje?\n\n` +
            `1 - Quero doar um equipamento\n` +
            `2 - Conhecer o projeto\n` +
            `3 - Local de entrega e contatos\n\n` +
            `*Digite apenas o número da opção.*`);
    } 
    
    else if (texto === '1' || texto.includes('doar') || texto.includes('doação')) {
        await digitar();
        await bot.sendMessage(msg.from, 
            `📝 **FICHA DE DOAÇÃO**\n\n` +
            `Por favor, **copie e preencha** os dados abaixo:\n\n` +
            `• Nome:\n` +
            `• O que quer doar?:\n` +
            `• Funciona?:\n` +
            `• Qual o defeito?:\n` +
            `• Onde podemos buscar?:`);
    }

    else if (texto === '2' || texto.includes('projeto') || texto.includes('quem somos')) {
        await digitar();
        await bot.sendMessage(msg.from, 
            `O **PC Solidário** transforma hardware em desuso em oportunidade! ♻️\n\n` +
            `Nossos alunos recondicionam os equipamentos que depois são doados para quem mais precisa em Belém.`);
    }

    else if (texto === '3' || texto.includes('local') || texto.includes('endereço')) {
        await digitar();
        await bot.sendMessage(msg.from, 
            `📍 **Endereço:** Senac Aristides Lobo, Belém.\n` +
            `📧 **E-mail:** projetopcsolidario@gmail.com\n` +
            `📸 **Instagram:** @pcsolidario`);
    }
});

bot.initialize();
