const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');

// 1. Configuração do Servidor Web (Necessário para o Render não desligar o bot)
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot PC Solidário está ativo!'));
app.listen(port, () => console.log(`Monitoramento ativo na porta ${port}`));

// 2. Configuração do Bot
// ... (mantenha o express no topo)

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
            '--single-process',
            '--disable-gpu',
            '--disable-extensions' // Deixa mais leve
        ]
    }
});

// Forçando a conexão por código logo após o carregamento
bot.on('ready', () => {
    console.log('🚀 PC Solidário Online em Belém!');
});

// O segredo: esperar o estado "loading" para pedir o código
bot.on('qr', async (qr) => {
    console.log('⚠️ Página carregada. Gerando código de emparelhamento...');
    try {
        // MUITO IMPORTANTE: Verifique se este número está no seu código agora!
        // Formato: 55 + DDD + Numero (ex: 5591988887777)
        const code = await bot.requestPairingCode('55919XXXXXXXX'); 
        console.log('----------------------------');
        console.log('✅ SEU CÓDIGO DE CONEXÃO É:', code);
        console.log('----------------------------');
    } catch (err) {
        console.log('Tentando gerar código novamente em 5 segundos...');
    }
});

bot.initialize();
bot.on('ready', () => {
    console.log('🚀 PC Solidário Online em Belém!');
});

// 4. Lógica de Mensagens
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
