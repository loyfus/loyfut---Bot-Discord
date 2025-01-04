const axios = require('axios');
const API_KEY = process.env.API_KEY;

async function getMatchScore() {
  try {
    const response = await axios.get('https://api.football-data.org/v4/matches', {
      headers: {
        'X-Auth-Token': API_KEY,
      },
    });

    const matches = response.data.matches;
    const brazilMatches = matches.filter(match => match.competition.area.name === 'Brazil');

    let message = 'Jogos ao vivo no Brasil:\n';

    brazilMatches.forEach(match => {
      message += `${match.homeTeam.name} ${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam} ${match.awayTeam.name}\n`;
    });

    return message;
  } catch (error) {
    console.error('Erro ao buscar placares:', error);
    return 'Erro ao obter placares.';
  }
}

async function getNextMatches(teamName) {
  try {
    const response = await axios.get('https://api.football-data.org/v4/matches', {
      headers: {
        'X-Auth-Token': API_KEY,
      },
    });

    const matches = response.data.matches;
    const nextMatches = matches.filter(match =>
      (match.homeTeam.name === teamName || match.awayTeam.name === teamName) &&
      new Date(match.utcDate) > new Date()
    );

    if (nextMatches.length === 0) {
      return `Não há próximos jogos para o time ${teamName}.`;
    }

    let message = `Próximos jogos de ${teamName}:\n`;
    nextMatches.forEach(match => {
      const opponent = match.homeTeam.name === teamName ? match.awayTeam.name : match.homeTeam.name;
      const date = new Date(match.utcDate).toLocaleString();
      message += `${date} - ${teamName} vs ${opponent}\n`;
    });

    return message;
  } catch (error) {
    console.error('Erro ao buscar próximos jogos:', error);
    return 'Erro ao obter próximos jogos.';
  }
}

async function getBrazilianLeagueRanking() {
    try {
      const response = await axios.get('https://api.football-data.org/v4/competitions/BSA/standings', {
        headers: {
          'X-Auth-Token': API_KEY,
        },
      });
  
      const standings = response.data.standings[0].table;
      let message = 'Classificação do Campeonato Brasileiro:\n';
  
      standings.forEach((team, index) => {
        message += `${index + 1}. ${team.team.name} - ${team.points} pontos\n`;
      });
  
      return message;
    } catch (error) {
      console.error('Erro ao buscar classificação:', error);
      return 'Erro ao obter classificação.';
    }
  }
  

async function getLastMatches(teamName) {
  try {
    const response = await axios.get('https://api.football-data.org/v4/matches', {
      headers: {
        'X-Auth-Token': API_KEY,
      },
    });

    const matches = response.data.matches;
    const lastMatches = matches.filter(match =>
      (match.homeTeam.name === teamName || match.awayTeam.name === teamName) &&
      new Date(match.utcDate) < new Date()
    );

    if (lastMatches.length === 0) {
      return `Não há jogos passados para o time ${teamName}.`;
    }

    let message = `Últimos jogos de ${teamName}:\n`;
    lastMatches.forEach(match => {
      const opponent = match.homeTeam.name === teamName ? match.awayTeam.name : match.homeTeam.name;
      const score = `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`;
      message += `${teamName} ${score} ${opponent}\n`;
    });

    return message;
  } catch (error) {
    console.error('Erro ao buscar últimos jogos:', error);
    return 'Erro ao obter últimos jogos.';
  }
}

async function getPlayerStats(playerName) {
    try {

      const player = response.data.response[0];
  
      if (!player) return `Jogador não encontrado: ${playerName}`;
  
      const stats = player.statistics[0];
      const playerStats = `
        **${player.player.name}** - Estatísticas:
        - Gols: ${stats.goals.total}
        - Assistências: ${stats.assists.total}
        - Cartões Amarelos: ${stats.cards.yellow}
        - Cartões Vermelhos: ${stats.cards.red}
      `;
  
      return playerStats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas do jogador:', error);
      return 'Erro ao obter estatísticas do jogador.';
    }
}

async function getTopScorers() {
    try {  
      const topScorers = response.data.response;

      let message = '**Tabela de Artilheiros - Campeonato Brasileiro**\n';
  
      topScorers.forEach((player, index) => {
        message += `${index + 1}. ${player.player.name} - ${player.statistics[0].goals.total} gols\n`;
      });
  
      return message;
    } catch (error) {
      console.error('Erro ao buscar artilheiros:', error);
      return 'Erro ao obter tabela de artilheiros.';
    }
}

async function getMatchesByDate(date) {
    try {  
      const matches = response.data.response;

      if (matches.length === 0) {
        return `Não há jogos para a data ${date}.`;
      }
  
      let message = `**Resultados dos Jogos - ${date}**\n`;
  
      matches.forEach((match) => {
        message += `${match.teams.home.name} ${match.goals.home} x ${match.goals.away} ${match.teams.away.name}\n`;
      });
  
      return message;
    } catch (error) {
      console.error('Erro ao buscar resultados de jogos:', error);
      return 'Erro ao obter resultados de jogos.';
    }
}

module.exports = { getMatchScore, getNextMatches, getBrazilianLeagueRanking, getLastMatches, getPlayerStats, getTopScorers, getMatchesByDate };
