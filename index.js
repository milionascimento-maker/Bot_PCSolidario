const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Configuração do cliente preparada para o Render
const bot = new Client({
    authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth'
    }),
 puppeteer: {
        headless: true,
        // Novo caminho apontando para dentro da pasta do seu projeto
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

// 1. Geração do QR Code nos Logs
bot.on('qr', (qr) => {
    console.log('✅ ESCANEIE O QR CODE ABAIXO:');
    qrcode.generate(qr, { small: true });
});

// 2. Confirmação de que está online
bot.on('ready', () => {
    console.log('🚀 PC Solidário Online em Belém!');
});

// 3. Lógica de Mensagens
bot.on('message', async (msg) => {
    if (msg.from.endsWith('@g.us')) return; // Ignora grupos

    const chat = await msg.getChat();
    const texto = msg.body.toLowerCase().trim();

    // Função para simular "digitando..."
    const digitar = async () => {
        await chat.sendStateTyping();
        await new Promise(res => setTimeout(res, 2000));
    };

    // Menu Inicial e Saudações
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
    
    // Opção 1 - Doação
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

    // Opção 2 - Sobre o projeto
    else if (texto === '2' || texto.includes('projeto') || texto.includes('quem somos')) {
        await digitar();
        await bot.sendMessage(msg.from, 
            `O **PC Solidário** transforma hardware em desuso em oportunidade! ♻️\n\n` +
            `Nossos alunos recondicionam os equipamentos que depois são doados para quem mais precisa em Belém.`);
    }

    // Opção 3 - Endereço e Contatos
    else if (texto === '3' || texto.includes('local') || texto.includes('endereço')) {
        await digitar();
        await bot.sendMessage(msg.from, 
            `📍 **Endereço:** Senac Aristides Lobo, Belém.\n` +
            `📧 **E-mail:** projetopcsolidario@gmail.com\n` +
            `📸 **Instagram:** @pcsolidario`);
    }
});

// Inicialização única
bot.initialize();
