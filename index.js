require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { getMatchScore, getNextMatches, getBrazilianLeagueRanking, getLastMatches } = require('./services/footballService');

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent // Necessário para ler o conteúdo das mensagens
    ]
});  

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

client.once('ready', () => {
  console.log(`Logado como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    console.log('Mensagem recebida:', message.content);  // Adiciona log para ver o conteúdo das mensagens

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

client.login(DISCORD_TOKEN);
