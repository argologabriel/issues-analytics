# Relatório do Projeto (Extrair issues do repositório do Bootstrap)

## **Introdução**
Projeto realizado como parte da disciplina de Engenharia de Software II. Nele, fizemos a coleta e classificação de issues do repositório do Bootstrap no GitHub. Para isso, usamos ferramentas que permitem automatizar a coleta dos dados, especificar certas particularidades da issue, como:

* Data de abertura
* Data de conclusão
* Tempo de resolução da issue em dias
* Prioridade da issue
* Milestone (release associada)
* Usuário autor
* Usuário atribuído
* Classificação da relação entre o tema da issue e **arquitetura**, **padrões arquiteturais** e **padrões de projeto**.

Além de armazenar todas as informações em um banco de dados.

---
## **Etapas do Projeto**
Inicialmente, definimos as metas principais do projeto:
1. Buscar issues de um repositório GitHub de maneira automatizada.
2. Armazenar as issues em um banco de dados relacional, retirando as características determinadas como atributos.
3. Utilizar um modelo de linguagem (LLM) para classificar as issues em categorias predefinidas.

---

## **Arquitetura da Solução**

<img src="https://cdn-icons-png.flaticon.com/512/4248/4248446.png" alt="Arquitetura" width="200">

A solução foi desenvolvida utilizando uma combinação de ferramentas e tecnologias para criação, coleta, armazenamento e processamento de dados. O fluxo geral do projeto pode ser descrito como:

1. **Banco de dados**: Criação da tabela com todos os atributos especificados.
3. **Busca de Issues**: Uso da API do GitHub para obter os dados das issues.
4. **Classificação com LLM**: Processamento dos títulos das issues por meio da API da OpenAI para categorização automática.
5. **Armazenamento de Dados**: Inserção das issues com cada atributo destacado em um banco de dados PostgreSQL usando Javascript.
6. **Relatório**: Geração de relatórios e visualização dos resultados.

---

## **Ferramentas Utilizadas**

### **1. Node.js**
<img src="https://nodejs.org/static/images/logo.svg" alt="Node.js Logo" width="100">

Linguagem de programação utilizada para desenvolver o backend da aplicação. Ela oferece suporte à manipulação de APIs, integrações e conexão com bancos de dados.

### **2. PostgreSQL**
<img src="https://www.postgresql.org/media/img/about/press/elephant.png" alt="PostgreSQL Logo" width="80">

Banco de dados relacional usado para armazenar as issues coletadas. 

### **3. API do GitHub**
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

---

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
