const { filtrarTemaRelacionado } = require("./utils");

require('dotenv').config();

const { Client } = require('pg');
const axios = require('axios');

// Configuração da API da OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Função para obter tema relacionado usando OpenAI
async function obterTemaRelacionado(titulo) {
  const contexto = `Segue um contexto dos temas relacionados para que você use como base na hora de classificar uma issue pelo seu titulo:

		Arquitetura de software: Refere-se à estrutura fundamental de um sistema, incluindo os componentes principais, suas interações e os padrões utilizados para projetar e organizar o sistema.

		Padrões e Estilos Arquiteturais: Refere-se aos estilos ou padrões gerais que são usados para organizar e estruturar sistemas de software, como arquitetura em camadas, microservices, MVC, etc.

		Padrões de Projeto: Refere-se às soluções reutilizáveis para problemas comuns de design em sistemas de software. Exemplos incluem padrões como Singleton, Factory, Observer, Strategy, entre outros.`;

  const prompt = `Com base no seguinte titulo e no contexto passado, atribua um tema relacionado: ${titulo}. ${contexto}
	
		Analise o título a seguir e insira (1) se refere à Arquitetura de Software, (2) se se refere à Padrões e Estilos Arquiteturais, (3) se se refere à Padrões de Projeto e (4) se não se refere às uma das opções anteriores. Escreva apenas os números.
		`;
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions', 
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente que ajuda o GitHub a classificar issues e em um dos 3 principais temas: Arquitetura de software, Padrões e Estilos Arquiteturais ou Padrões de Projeto. e seu conhecimento é ${contexto}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 100
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content.trim();  
  } catch (error) {
    console.error('Erro ao chamar a API da OpenAI:', error);
    return null;
  }
}

// Configuração do PostgreSQL
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Função para conectar ao banco de dados e atualizar os temas relacionados
async function atualizarTemaRelacionado() {
  try {
    await client.connect();
    
    // Buscar os títulos das issues
    const res = await client.query('SELECT id, titulo FROM issues');
    
    for (const row of res.rows) {
      const resTema = await obterTemaRelacionado(row.titulo);
			const temaRelacionado = filtrarTemaRelacionado(resTema);
			
      if (temaRelacionado) {
				
        // Atualizar o campo 'tema_relacionado'
        await client.query('UPDATE issues SET tema_relacionado = $1 WHERE id = $2', [temaRelacionado, row.id]);
        console.log(`Tema relacionado atualizado para o ID: ${row.id}`);
      }
    }
    
  } catch (err) {
    console.error('Erro ao atualizar o banco de dados:', err);
  } finally {
    await client.end();
  }
}

// Chamar a função para atualizar
atualizarTemaRelacionado();
