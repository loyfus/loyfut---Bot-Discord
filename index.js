require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { getMatchScore, getNextMatches, getBrazilianLeagueRanking, getLastMatches } = require('../services/footballService');

// Inicializa o cliente do Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent // Necessário para ler o conteúdo das mensagens
  ]
});

// Token do bot
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// Evento "ready" do bot
client.once('ready', () => {
  console.log(`Bot logado como ${client.user.tag}`);
});

// Evento para ouvir mensagens
client.on('messageCreate', async (message) => {
  console.log('Mensagem recebida:', message.content); // Log para mensagens

  if (message.content === '!ping') {
    message.channel.send('Pong!');
  }

  if (message.content === '!placar ao vivo') {
    const placar = await getMatchScore();
    message.channel.send(placar);
  }

  if (message.content.startsWith('!próximos jogos')) {
    const teamName = message.content.slice(17).trim();
    const nextMatches = await getNextMatches(teamName);
    message.channel.send(nextMatches);
  }

  if (message.content === '!ranking brasileirão') {
    const ranking = await getBrazilianLeagueRanking();
    message.channel.send(ranking);
  }

  if (message.content.startsWith('!últimos jogos')) {
    const teamName = message.content.slice(15).trim();
    const lastMatches = await getLastMatches(teamName);
    message.channel.send(lastMatches);
  }

  if (message.content.startsWith('!estatísticas jogador')) {
    const playerName = message.content.slice(22).trim();
    const stats = await getPlayerStats(playerName);
    message.channel.send(stats);
  }

  if (message.content === '!artilheiros') {
    const topScorers = await getTopScorers();
    message.channel.send(topScorers);
  }

  if (message.content.startsWith('!resultados')) {
    const date = message.content.slice(12).trim();
    const results = await getMatchesByDate(date);
    message.channel.send(results);
  }
});

// Login no Discord
client.login(DISCORD_TOKEN);

// Função serverless para a Vercel
module.exports = async (req, res) => {
  // Inicia o bot
  if (!client.isReady()) {
    client.login(DISCORD_TOKEN);
  }
  
  // Retorna resposta HTTP para a Vercel
  res.status(200).json({ message: 'Bot rodando no servidor Vercel' });
};
