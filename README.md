# 🚀 EasyPace - Sistema de Log de Tempo

**EasyPace** é uma aplicação web moderna para registro e controle de tempo gasto em tarefas, integrada com Azure DevOps. Desenvolvida com Next.js 15, oferece uma interface intuitiva para que desenvolvedores e equipes possam facilmente registrar o tempo dedicado aos seus work items.

## ✨ Características Principais

- 🔐 **Autenticação via Azure AD**: Login seguro integrado com Azure Active Directory
- 📋 **Integração Azure DevOps**: Busca automática de detalhes das tarefas/work items
- ⏱️ **Log de Tempo Intuitivo**: Interface simples para registrar horas trabalhadas
- 🎨 **UI Moderna**: Interface construída com Ant Design e suporte a tema escuro
- 🐳 **Containerização**: Ambiente de desenvolvimento com Docker
- 📊 **Armazenamento Persistente**: Dados salvos em PostgreSQL

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15**: Framework React com App Router
- **React 19**: Biblioteca para construção da interface
- **TypeScript**: Tipagem estática para maior robustez
- **Ant Design 5.22+**: Biblioteca de componentes UI
- **NextAuth.js**: Autenticação e gerenciamento de sessões

### Backend
- **Next.js API Routes**: APIs serverless integradas
- **PostgreSQL**: Banco de dados relacional
- **Express**: Servidor adicional para APIs específicas
- **Axios**: Cliente HTTP para integração com Azure DevOps

### Infraestrutura
- **Docker Compose**: Containerização do banco de dados
- **ESLint**: Linting e padronização de código

## ⚙️ Configuração do Ambiente

### 1. Configuração do Azure AD no Portal do Azure

Para configurar a autenticação via Azure AD, siga os passos abaixo:

#### Passo 1: Criar uma App Registration
1. Acesse o [Portal do Azure](https://portal.azure.com)
2. Vá para **Azure Active Directory** > **App registrations**
3. Clique em **New registration**
4. Preencha as informações:
   - **Name**: `EasyPace`
   - **Supported account types**: `Accounts in this organizational directory only`
   - **Redirect URI**: `Web` -> `http://localhost:3000/api/auth/callback/azure-ad`
5. Clique em **Register**

#### Passo 2: Configurar a Aplicação
1. Na página da aplicação criada, anote o **Application (client) ID**
2. Vá para **Certificates & secrets**
3. Clique em **New client secret**
4. Adicione uma descrição e escolha a expiração
5. Clique em **Add** e anote o **Value** do secret criado
6. Vá para **Overview** e anote o **Directory (tenant) ID**

#### Passo 3: Configurar Permissões
1. Vá para **API permissions**
2. Clique em **Add a permission**
3. Selecione **Microsoft Graph**
4. Selecione **Delegated permissions**
5. Adicione as permissões:
   - `User.Read` (para ler informações básicas do usuário)
   - `openid` (para autenticação OpenID Connect)
   - `profile` (para acessar informações do perfil)
   - `email` (para acessar email do usuário)
6. Clique em **Add permissions**
7. Clique em **Grant admin consent** para conceder as permissões

### 2. Configuração do Azure DevOps

#### Criar Personal Access Token
1. Acesse o [Azure DevOps](https://dev.azure.com)
2. Vá para **User settings** > **Personal access tokens**
3. Clique em **New Token**
4. Configure:
   - **Name**: `EasyPace API Token`
   - **Organization**: Selecione sua organização
   - **Expiration**: Defina um período apropriado
   - **Scopes**: Selecione `Work Items (Read)`
5. Clique em **Create** e anote o token gerado

### 3. Configuração do Arquivo .env

1. Copie o arquivo `env.template` para `.env`:
```bash
cp env.template .env
```

2. Edite o arquivo `.env` com suas configurações:

```env
# CONFIGURAÇÕES DO AZURE AD
AZURE_AD_CLIENT_ID=cole_aqui_o_client_id_da_app_registration
AZURE_AD_CLIENT_SECRET=cole_aqui_o_client_secret_gerado
AZURE_AD_TENANT_ID=cole_aqui_o_tenant_id_do_diretorio

# CONFIGURAÇÕES DO AZURE DEVOPS
AZURE_DEVOPS_ORG=nome_da_sua_organizacao
AZURE_DEVOPS_PROJECT=nome_do_seu_projeto
AZURE_DEVOPS_TOKEN=cole_aqui_o_personal_access_token

# CONFIGURAÇÕES DO NEXTAUTH
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=gere_uma_string_aleatoria_aqui

# CONFIGURAÇÕES DO BANCO DE DADOS (já configurado)
DATABASE_URL=postgresql://postgres:easypace@localhost:5432/easypace
```

#### Gerando o NEXTAUTH_SECRET
Para gerar uma chave secreta segura, execute:

```bash
# Usando OpenSSL
openssl rand -base64 32

# Ou usando Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- Docker e Docker Compose instalados
- Git instalado

### Passo a Passo

1. **Clone o repositório**:
```bash
git clone <repository-url>
cd easypace
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Configure as variáveis de ambiente**:
```bash
cp env.template .env
# Edite o arquivo .env com suas configurações
```

4. **Inicie o banco de dados PostgreSQL**:
```bash
docker-compose up -d
```

5. **Execute a aplicação em modo de desenvolvimento**:
```bash
npm run dev
```

6. **Acesse a aplicação**:
   - Abra seu navegador em `http://localhost:3000`
   - Clique em "Entrar com Azure DevOps" para fazer login

### Comandos Úteis

```bash
# Parar o banco de dados
docker-compose down

# Ver logs do banco de dados
docker-compose logs db

# Executar em modo de produção
npm run build
npm start

# Verificar linting
npm run lint
```

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro de Autenticação Azure AD
**Erro**: `Error: AZURE_AD_CLIENT_ID is not defined`
**Solução**: Verifique se todas as variáveis do Azure AD estão configuradas no arquivo `.env`

#### 2. Redirect URI não autorizado
**Erro**: `AADSTS50011: The reply URL specified in the request does not match the reply URLs configured for the application`
**Solução**: 
- Verifique se o Redirect URI no Azure AD está configurado como `http://localhost:3000/api/auth/callback/azure-ad`
- Para produção, altere para `https://seudominio.com/api/auth/callback/azure-ad`

#### 3. Erro ao conectar com PostgreSQL
**Erro**: `Error: connect ECONNREFUSED 127.0.0.1:5432`
**Solução**: 
- Verifique se o Docker está executando: `docker ps`
- Reinicie o container: `docker-compose restart db`

#### 4. Token do Azure DevOps inválido
**Erro**: `Error fetching task details`
**Solução**: 
- Verifique se o Personal Access Token não expirou
- Confirme se o token tem permissões de `Work Items (Read)`
- Verifique se o nome da organização e projeto estão corretos

#### 5. NextAuth Secret não configurado
**Erro**: `Error: Please define a NEXTAUTH_SECRET environment variable`
**Solução**: Gere um novo secret usando o comando mostrado acima

### Logs e Debugging

Para habilitar logs detalhados do NextAuth, adicione ao seu `.env`:

```env
# Para debugging (apenas em desenvolvimento)
NEXTAUTH_DEBUG=true
```

## 🌐 Deploy para Produção

### Configurações Adicionais para Produção

#### 1. Atualizar Azure AD App Registration
1. No Portal do Azure, vá para sua App Registration
2. Em **Authentication**, adicione um novo Redirect URI:
   - `https://seudominio.com/api/auth/callback/azure-ad`
3. Mantenha também o URI de desenvolvimento se necessário

#### 2. Variáveis de Ambiente para Produção
```env
# Altere para o domínio de produção
NEXTAUTH_URL=https://seudominio.com

# Use um secret mais forte para produção
NEXTAUTH_SECRET=seu_secret_super_seguro_aqui

# Configure o banco de dados de produção
DATABASE_URL=postgresql://user:password@host:port/database
```

#### 3. Considerações de Segurança
- Use HTTPS em produção
- Configure um banco de dados dedicado
- Rotate periodicamente o NEXTAUTH_SECRET
- Monitore os logs de acesso
- Configure rate limiting se necessário

### Plataformas de Deploy Recomendadas

#### Vercel (Recomendado para Next.js)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Docker
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 📁 Estrutura do Projeto

```
easypace/
├── src/
│   └── app/
│       ├── api/                    # APIs do Next.js
│       │   ├── auth/               # Configuração NextAuth
│       │   ├── get-task-details.ts # API busca tarefas Azure DevOps
│       │   └── server.ts           # Servidor Express adicional
│       ├── ClientProvider.tsx      # Provider de sessão
│       ├── TimeLog.tsx            # Componente principal de log
│       ├── globals.css            # Estilos globais
│       ├── layout.tsx             # Layout da aplicação
│       └── page.tsx               # Página inicial
├── public/                        # Assets estáticos
├── docker-compose.yml            # Configuração PostgreSQL
├── package.json                  # Dependências do projeto
└── tsconfig.json                # Configuração TypeScript
```

## 🚦 Pré-requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**
- **Docker** e **Docker Compose**
- **Conta Azure DevOps** com acesso à API

## ⚙️ Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd easypace
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Azure AD Configuration
AZURE_AD_CLIENT_ID=seu_client_id_azure_ad
AZURE_AD_CLIENT_SECRET=seu_client_secret_azure_ad
AZURE_AD_TENANT_ID=seu_tenant_id_azure_ad

# Azure DevOps Configuration
AZURE_DEVOPS_ORG=sua_organizacao_azure_devops
AZURE_DEVOPS_PROJECT=seu_projeto_azure_devops
AZURE_DEVOPS_TOKEN=seu_personal_access_token

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta_nextauth

# Database Configuration
DATABASE_URL=postgresql://postgres:instale502@localhost:5432/easypace
```

### 4. Inicie o banco de dados
```bash
docker-compose up -d
```

### 5. Configure o banco de dados
Execute o seguinte SQL para criar a tabela necessária:

```sql
CREATE TABLE time_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    task_id VARCHAR(255) NOT NULL,
    time_spent DECIMAL(4,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🏃‍♂️ Executando a Aplicação

### Modo Desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)

### Modo Produção
```bash
npm run build
npm start
# ou
yarn build
yarn start
```

## 🎯 Como Usar

1. **Acesse a aplicação** no navegador
2. **Faça login** com sua conta Azure AD
3. **Digite o ID da tarefa** do Azure DevOps
4. **Clique em "Buscar"** para ver os detalhes da tarefa
5. **Informe as horas trabalhadas** no campo "Time Spent"
6. **Clique em "Log Time"** para salvar o registro

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa verificação de código

## 🏗️ Arquitetura

### Fluxo de Autenticação
1. Usuário clica em "Entrar com Azure DevOps"
2. NextAuth redireciona para Azure AD
3. Após autenticação, retorna com token de acesso
4. Token é armazenado na sessão para uso nas APIs

### Fluxo de Log de Tempo
1. Usuário digita ID da tarefa
2. Sistema consulta Azure DevOps API para detalhes
3. Usuário confirma tarefa e informa tempo gasto
4. Dados são salvos no PostgreSQL via API

### APIs Disponíveis
- `GET /api/get-task-details?id={taskId}` - Busca detalhes da tarefa
- `POST /api/log-time` - Registra tempo gasto
- `GET /api/tasks` - Lista tarefas (servidor Express)

## 🐳 Docker

O projeto inclui configuração Docker para o banco PostgreSQL:

```yaml
services:
  db:
    image: postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: instale502
      POSTGRES_DB: easypace
    ports:
      - "5432:5432"
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob licença privada. Todos os direitos reservados.

## 🆘 Suporte

Para suporte e dúvidas:
- Abra uma issue no repositório
- Consulte a documentação do Azure DevOps API
- Verifique a documentação do Next.js

## 🚀 Próximas Funcionalidades

- [ ] Dashboard com relatórios de tempo
- [ ] Exportação de dados para Excel/CSV
- [ ] Notificações automáticas
- [ ] Mobile responsivo aprimorado
- [ ] Integração com outros sistemas de gerenciamento

---

**Desenvolvido com ❤️ usando Next.js e TypeScript**
