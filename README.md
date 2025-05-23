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
    DB_USER=seu_user_do_postgresql
    DB_PASSWORD=sua_senha_postgresql
   ```

2. Na raiz do projeto execute o comando a seguir e instale as dependências necessárias:

   ```bash
   npm install
   ```

3. Para rodar a coleta das issues, execute o comando a seguir:

   ```bash
   npm run collector
   ```

4. Para rodar a classificação das issues, execute o comando a seguir:

   ```bash
   npm run classifier
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

<ul>
   <li><b>Modelo:</b> gpt-3.5-turbo</li>

   <br>

   <li><b>Contexto:</b> Segue um contexto dos temas relacionados para que você use como base na hora de classificar uma issue pelo seu titulo:
   
   Arquitetura de software: Refere-se à estrutura fundamental de um sistema, incluindo os componentes principais, suas interações e os padrões utilizados para projetar e organizar o sistema.
   
   Padrões e Estilos Arquiteturais: Refere-se aos estilos ou padrões gerais que são usados para organizar e estruturar sistemas de software, como arquitetura em camadas, microservices, MVC, etc.
   
   Padrões de Projeto: Refere-se às soluções reutilizáveis para problemas comuns de design em sistemas de software. Exemplos incluem padrões como Singleton, Factory, Observer, Strategy, entre outros.</li>

   <li><b>Prompt:</b> Com base no seguinte titulo e no contexto passado, atribua um tema relacionado:
	
   Analise o título a seguir e insira (1) se refere à Arquitetura de Software, (2) se se refere à Padrões e Estilos Arquiteturais, (3) se se refere à Padrões de Projeto e (4) se não se refere às uma das opções anteriores. Escreva apenas os números</li>
</ul>

### **5. Biblioteca Axios**

<img src="https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fwi656wrs8i3grr3tb1wo.png" alt="Axios logo" width="100">

Responsável por realizar requisições HTTP tanto à API do GitHub quanto à API da OpenAI.

### **6. Dotenv**

<img src="https://miro.medium.com/v2/resize:fit:4800/format:webp/1*ZEIqwQ3CIpjDiQsURlREjQ.jpeg" alt="dotenv logo" width="100">

Gerenciador de variáveis de ambiente para armazenar chaves sensíveis, como:

- Token do GitHub.
- Chave da API da OpenAI.
- Informações de conexão com o PostgreSQL.

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

## **Resultados do Projeto Bootstrap**

### **Principais Conclusões**

Durante a análise das issues dos repositórios do Bootstrap, buscamos compreender como esses registros se relacionam com os temas de **Arquitetura de Software, Padrões e Estilos Arquiteturais e Padrões de Projeto**. A partir da observação das **labels, milestones e atribuições**, identificamos alguns pontos que indicam aspectos da organização do projeto, tanto em suas forças quanto em suas limitações.

#### **Fatores que indicam uma menor organização em comparação a outros projetos open source:**

1.  **Pouco aproveitamento das labels cadastradas**
    
    *   As labels são ferramentas fundamentais para categorizar e organizar issues, permitindo uma melhor triagem e priorização. No entanto, no repositório analisado, percebe-se que as labels cadastradas não são utilizadas de forma consistente. Isso dificulta a identificação rápida do tipo de problema abordado em cada issue e pode impactar a eficiência na gestão do projeto.
        
2.  **Pouca utilização das atribuições de um usuário a determinada issue**
    
    *   A atribuição de issues a colaboradores é uma prática comum em projetos open source bem estruturados, pois facilita a gestão de responsabilidades e melhora a previsibilidade da resolução das tarefas. No Bootstrap, observamos que esse recurso não é amplamente utilizado, o que pode levar a uma menor clareza sobre quem está encarregado de resolver cada issue, impactando potencialmente o tempo de resposta e resolução.
        
3.  **Nenhum uso de milestones**
    
    *   O uso de milestones é uma prática recomendada para acompanhar o progresso de grandes entregas e manter a organização do roadmap do projeto. No repositório analisado, notamos que não há milestones associadas às issues, o que pode indicar uma falta de planejamento explícito em termos de entregáveis ou um fluxo de trabalho menos estruturado.
        
4.  **Bodies das issues pouco descritivas**
    
    *   Uma descrição detalhada das issues é essencial para facilitar a colaboração entre desenvolvedores, garantindo que todos compreendam claramente o problema ou a sugestão apresentada. No Bootstrap, notamos que muitas issues contêm bodies pouco descritivas, tornando mais difícil entender o contexto sem uma análise mais aprofundada dos comentários ou do código relacionado. Isso pode afetar negativamente a eficiência na resolução de problemas.
        

#### **Pontos positivos identificados:**

1.  **Títulos bem intuitivos**
    
    *   Apesar das limitações apontadas, um ponto positivo observado é que os títulos das issues são geralmente bem intuitivos e informativos. Isso facilita a identificação rápida do assunto abordado, permitindo que os colaboradores entendam de forma resumida o que cada issue trata antes de precisar aprofundar-se no seu conteúdo.
        

#### **Implicações dessa análise**

A partir dessa avaliação, percebemos que, embora o projeto Bootstrap seja amplamente utilizado e possua um grande número de contribuidores, ele não segue algumas das melhores práticas de organização encontradas em outros projetos open source. Isso pode impactar a eficiência na gestão das issues, dificultando a colaboração e possivelmente aumentando o tempo necessário para resolver problemas ou implementar melhorias.

A falta de um uso consistente de labels, milestones e atribuições pode indicar que o fluxo de trabalho das issues é menos estruturado e mais dependente da comunicação informal entre os mantenedores e contribuidores do projeto. Por outro lado, a clareza dos títulos pode compensar parcialmente essa falta de organização, tornando a identificação inicial das issues mais acessível.

Com base nesses achados, projetos que desejam melhorar sua organização podem se beneficiar de práticas como:

*   Uso consistente de labels para classificar as issues.
    
*   Atribuição de responsáveis para melhorar a rastreabilidade.
    
*   Implementação de milestones para estruturar entregas futuras.
    
*   Melhor elaboração das descrições das issues para facilitar a colaboração.

### **Tabela das Issues**

<img src="./docs/bootstrap_issues_table.png" alt="Tabela das Issues" width="1000">

### **Gráficos de Classificação das Issues**

<img src="./docs/bootstrap_issues_pizza.png" alt="Tabela das Issues" width="1000">

<hr>

<img src="./docs/bootstrap_issues_bar.png" alt="Tabela das Issues" width="1000">
