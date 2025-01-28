const axios = require("axios");
require("dotenv").config();

// Busca as issues de um repositório específico com paginação
async function fetchIssues(repoOwner, repoName) {
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/issues`;
  const headers = {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  };

  let allIssues = [];
  let page = 1;

  try {
    // Enquanto tiver menos que 1000 issues, faz novas requisições
    while (allIssues.length < 1000) {
      const response = await axios.get(url, {
        headers,
        params: {
          state: 'closed',  // Pega somente as issues fechadas
          per_page: 100,   // Máximo de 100 issues por página
          page,           // Número da página
        },
      });

      const issuesPage = response.data;
      allIssues = [...allIssues, ...issuesPage];

      if (issuesPage.length < 100) {
        // Não há mais issues
        break;
      }

      page++; // Avança para a próxima página
    }

    return allIssues.slice(0, 1000); // Garante não pegar mais de 1000 issues
  } catch (error) {
    console.error("Erro ao buscar issues:", error.response?.status, error.response?.data);
    return [];
  }
}

module.exports = { fetchIssues };
