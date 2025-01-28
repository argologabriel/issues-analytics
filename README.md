# **Issues Analytics**

## **Introdução**

Projeto realizado como parte da disciplina de Engenharia de Software II. Nele, fizemos a coleta e classificação de issues do repositório do Bootstrap no GitHub. Para isso, usamos ferramentas que permitem automatizar a coleta dos dados, especificar certas particularidades da issue, como:

- Data de abertura
- Data de conclusão
- Tempo de resolução da issue em dias
- Prioridade da issue
- Milestone (release associada)
- Usuário autor
- Usuário atribuído
- Classificação da relação entre o tema da issue e **arquitetura**, **padrões arquiteturais** e **padrões de projeto**.

Além de armazenar todas as informações em um banco de dados.

---

## **Como Rodar o Projeto**

1. Crie um arquivo `.env` na raiz do projeto backend com as seguintes variáveis:

   ```bash
    # Chave do Token do GitHub
    GITHUB_TOKEN=seu_token_do_github

    # Dono e Nome do Repositório (Neste caso: Bootstrap)
    REPO_OWNER=twbs
    REPO_NAME=bootstrap

    # Chave da API da OpenAI
    OPENAI_API_KEY=sua_chave_da_openai

    # Credenciais do banco de dados PostgreSQL
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=seu_banco_de_dados
    DB_USER=seu_user_do_postgress
    DB_PASSWORD=sua_senha_do_postgree
   ```

2. Na raiz do projeto execute o comando a seguir e instale as dependências necessárias:

   ```bash
   npm install
   ```

3. Para rodar a coleta das issues, execute o comando a seguir:

   ```bash
   npm collector
   ```

4. Para rodar a classificação das issues, execute o comando a seguir:

   ```bash
   npm classifier
   ```

## **Etapas do Projeto**

Inicialmente, definimos as metas principais do projeto:

1. Buscar issues de um repositório GitHub de maneira automatizada.
2. Armazenar as issues em um banco de dados relacional, retirando as características determinadas como atributos.
3. Utilizar um modelo de linguagem (LLM) para classificar as issues em categorias predefinidas.

## **Arquitetura da Solução**

<img src="https://cdn-icons-png.flaticon.com/512/4248/4248446.png" alt="Arquitetura" width="200">

A solução foi desenvolvida utilizando uma combinação de ferramentas e tecnologias para criação, coleta, armazenamento e processamento de dados. O fluxo geral do projeto pode ser descrito como:

1. **Banco de dados**: Criação da tabela com todos os atributos especificados.
2. **Busca de Issues**: Uso da API do GitHub para obter os dados das issues.
3. **Classificação com LLM**: Processamento dos títulos das issues por meio da API da OpenAI para categorização automática.
4. **Armazenamento de Dados**: Inserção das issues com cada atributo destacado em um banco de dados PostgreSQL usando Javascript.
5. **Relatório**: Geração de relatórios e visualização dos resultados.

## **Ferramentas Utilizadas**

### **1. Node.js**

<img src="https://nodejs.org/static/images/logo.svg" alt="Node.js Logo" width="100">

Linguagem de programação utilizada para desenvolver o backend da aplicação. Ela oferece suporte à manipulação de APIs, integrações e conexão com bancos de dados.

### **2. PostgreSQL**

<img src="https://www.postgresql.org/media/img/about/press/elephant.png" alt="PostgreSQL Logo" width="80">

Banco de dados relacional usado para armazenar as issues coletadas.

### **3. API do GitHub**

<img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo" width="80">

A API foi utilizada para buscar as issues de repositórios específicos. As chamadas são paginadas para lidar com grandes volumes de dados (100 issues por requisição).

### **4. OpenAI API**

<img src="https://upload.wikimedia.org/wikipedia/commons/c/c9/OpenAI_Logo_%282%29.svg" alt="OpenAI Logo" width="100">

Foi usada para classificar os títulos das issues.

### **5. Biblioteca Axios**

<img src="https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fwi656wrs8i3grr3tb1wo.png" alt="Axios logo" width="100">

Responsável por realizar requisições HTTP tanto à API do GitHub quanto à API da OpenAI.

### **6. Dotenv**

<img src="https://miro.medium.com/v2/resize:fit:4800/format:webp/1*ZEIqwQ3CIpjDiQsURlREjQ.jpeg" alt="dotenv logo" width="100">

Gerenciador de variáveis de ambiente para armazenar chaves sensíveis, como:

- Token do GitHub.
- Chave da API da OpenAI.
- Informações de conexão com o Postgress.

## **Lógica Implementada**

### **1. Coleta de Dados (API do GitHub)**

No arquivo `github/api.js`, implementamos a função `fetchIssues`, que:

- Faz requisições à API do GitHub para buscar issues de um repositório.
- Limita o número de issues a 1000 e coleta apenas issues fechadas (`state: 'closed'`).
- Realiza paginação para garantir a coleta de todas as issues disponíveis.

### **2. Armazenamento de Dados (PostgreSQL)**

No arquivo `db/queries.js`:

- A função `createTable` cria a tabela `issues` se ela ainda não existir no banco.
- A função `saveIssuesToDb` insere as issues e todos os atributos coletados no banco de dados, evitando duplicatas por meio da clausula `ON CONFLICT`.

### **3. Classificação de Issues (OpenAI)**

No arquivo `issues_classifier/main.js`:

- Implementamos a função `obterTemaRelacionado` e `atualizarTemaRelacionado`, que utiliza a API da OpenAI através de um prompt para classificar os temas relacionados usando o título como base e salvar estes temas no banco de dados.
