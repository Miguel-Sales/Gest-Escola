👨‍💻 Feito por:
MIguel Sales 
Victor Koba

# 📘 Gestão Escolar - Módulo de Turmas

Aplicativo desenvolvido em **React Native com Expo**, integrado ao serviço **AWS DynamoDB**.  
O sistema foi criado para **gerenciar turmas escolares**, permitindo **cadastrar, listar, editar e excluir turmas** com armazenamento seguro e escalável na nuvem da **AWS**.

---

## 🚀 Funcionalidades

- 📋 Listar todas as turmas cadastradas.  
- ➕ Adicionar novas turmas com nome e data automática.  
- ✏️ Editar o nome de turmas existentes.  
- ❌ Excluir turmas diretamente da lista.  
- ☁️ Integração direta com **AWS DynamoDB**.  
- 💾 Armazenamento em nuvem com **chaves únicas (pk-turma, sk-turma)**.    

---

## 🧠 Estrutura da Tabela DynamoDB

A tabela deve ser criada manualmente na **AWS DynamoDB** com o nome:

Turmas


### Campos obrigatórios:

| Campo        | Tipo   | Descrição                                  |
|---------------|--------|--------------------------------------------|
| pk-turma      | String | Chave primária única da turma              |
| sk-turma      | String | Chave de ordenação (data de criação)       |
| nome          | String | Nome da turma                              |
| criadoEm      | String | Data e hora ISO de criação do registro     |

📍 **Região AWS:** `us-east-1`

---

## 🛠️ Tecnologias Utilizadas

- ⚛️ **React Native (Expo)**
- ☁️ **AWS SDK v3**
- 💬 **Ionicons**
- 📜 **JavaScript (ES6)**
- 🧩 **DynamoDB DocumentClient**

---

## ⚙️ Como Executar o Projeto

1. **Clonar o repositório:**
   
Instalar as dependências:

npm install
Configurar as credenciais AWS:

Abra o arquivo Turmas.js

Substitua os valores de:

AWS_ACCESS_KEY_ID

AWS_SECRET_ACCESS_KEY

AWS_SESSION_TOKEN

REGION (use "us-east-1")

⚠️ Importante: as credenciais da AWS expiram após algum tempo, então será necessário atualizá-las periodicamente.

Iniciar o aplicativo:


npx expo start
🧭 Fluxo do Aplicativo
Ao abrir o app, o usuário vê uma tela com logotipo e fundo azul arredondado.

As turmas existentes são listadas automaticamente.

O botão “+” abre um modal para cadastrar nova turma.

O ícone de olho permite editar o nome da turma.

O ícone de lixeira exclui a turma do banco DynamoDB.


🧩 Estrutura do Projeto

📁 ProjetoGestaoEscolar
│
├── 📁 assets
│   └── turma-logo.png
│
├── 📁 components
│   └── Turmas.js
│
├── App.js
├── package.json
└── README.md
📚 Objetivo
Este projeto foi desenvolvido com foco em aprendizado e integração entre React Native e AWS.
Ele serve como base para sistemas escolares, administrativos ou de gestão que precisem armazenar dados de forma confiável na nuvem.

💡 Sobre o Projeto
O design é responsivo, mantendo a identidade visual azul e branca com elementos arredondados e ícones intuitivos.
O projeto é parte do portfólio da Code Produces, empresa que oferece soluções tecnológicas inteligentes para educação e agronegócio, promovendo eficiência, automação e modernização de processos.


