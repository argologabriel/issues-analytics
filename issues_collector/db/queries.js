const pool = require("./config");

// Cria a tabela de issues, caso não exista
async function createTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        id_issue INT NOT NULL UNIQUE,
        titulo TEXT,
        data_abertura TIMESTAMP NOT NULL,
        data_conclusao TIMESTAMP,
        tempo_de_resolucao_em_dias INT,
        prioridade TEXT,
        milestone TEXT,
        usuario_autor TEXT,
        usuario_atribuido_para_resolver TEXT,
        tema_relacionado TEXT
    );
  `;

  const client = await pool.connect();
  try {
    await client.query(query);
    console.log("Tabela 'issues' criada ou já existe.");
  } finally {
    client.release();
  }
}

// Salva as issues no banco de dados
async function saveIssuesToDb(issues) {
  const query = `
    INSERT INTO issues (
      id_issue,
      titulo,
      data_abertura,
      data_conclusao,
      tempo_de_resolucao_em_dias,
      prioridade,
      milestone,
      usuario_autor,
      usuario_atribuido_para_resolver
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (id_issue) DO NOTHING;
  `;

  const client = await pool.connect();
  try {
    for (const issue of issues) {
      const tempoResolucao = issue.closed_at
        ? Math.floor((new Date(issue.closed_at) - new Date(issue.created_at)) / (1000 * 60 * 60 * 24))
        : null;

      await client.query(query, [
        issue.number,
        issue.title,
        issue.created_at,
        issue.closed_at || null,
        tempoResolucao,
        issue.label || null,
        issue.milestone?.title || null,
        issue.user?.login || null,
        issue.assignee?.login || null,
      ]);
    }
    console.log("Issues salvas no banco de dados com sucesso!");
  } finally {
    client.release();
  }
}

module.exports = { createTable, saveIssuesToDb };
