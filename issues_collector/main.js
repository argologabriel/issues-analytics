const { createTable, saveIssuesToDb } = require("./db/queries");
const { fetchIssues } = require("./github/api");
require("dotenv").config(); // Carrega as variáveis de ambiente do arquivo .env

(async function main() {
  const REPO_OWNER = process.env.REPO_OWNER; // Obtém o dono do repositório do .env
  const REPO_NAME = process.env.REPO_NAME;   // Obtém o nome do repositório do .env

  if (!REPO_OWNER || !REPO_NAME) {
    console.error("Erro: As variáveis REPO_OWNER e REPO_NAME devem ser definidas no arquivo .env");
    return;
  }

  try {
    // Cria a tabela, se necessário
    await createTable();

    // Busca as issues do GitHub
    const issues = await fetchIssues(REPO_OWNER, REPO_NAME);

    // Salva as issues no banco de dados
    await saveIssuesToDb(issues);

    console.log("Processo concluído com sucesso!");
  } catch (error) {
    console.error("Erro durante a execução:", error);
  }
})();
