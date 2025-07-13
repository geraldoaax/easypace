# Sistema de Log de Tempo

## Funcionalidades

O sistema de log de tempo permite registrar o tempo gasto em tarefas do Azure DevOps de **qualquer projeto** da organização.

## Como usar

### 1. Buscar Tarefa

1. Abra a página de Cadastro de Tempo
2. Informe o **ID da tarefa** no campo correspondente
3. Clique no botão **Buscar**

O sistema irá buscar a tarefa em **todos os projetos** da organização configurada no Azure DevOps.

### 2. Visualizar Detalhes da Tarefa

Após buscar uma tarefa válida, você verá:

- **Título** da tarefa
- **Descrição** 
- **Estado** (Novo, Ativo, Resolvido, etc.)
- **Tipo** (Task, Bug, User Story, etc.)
- **Projeto** ao qual a tarefa pertence
- **Área** (Area Path)
- **Atribuído a** (pessoa responsável)
- **Data de Criação**
- **Última Modificação**
- **Prioridade**
- **Tags** (se houver)
- **Item Pai** (se for uma sub-tarefa)

### 3. Registrar Tempo

1. Após buscar e visualizar os detalhes da tarefa
2. Informe o **tempo gasto** em horas (ex: 2.5 para 2 horas e 30 minutos)
3. Clique em **Registrar Tempo**

## Configuração

### Variáveis de Ambiente

O sistema requer as seguintes variáveis no arquivo `.env`:

```env
# Azure DevOps
AZURE_DEVOPS_ORG=nome_da_organizacao
AZURE_DEVOPS_TOKEN=seu_token_pessoal

# Banco de Dados
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
```

### Permissões do Token

O token do Azure DevOps deve ter as seguintes permissões:
- **Work Items (read)**: Para buscar detalhes das tarefas
- **Project and Team (read)**: Para acessar informações dos projetos

## Banco de Dados

O sistema utiliza uma tabela `time_logs` com a seguinte estrutura:

```sql
CREATE TABLE time_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    task_id VARCHAR(50) NOT NULL,
    time_spent DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Limitações

- O sistema busca tarefas apenas na organização configurada
- É necessário ter permissões de leitura no Azure DevOps
- O token deve estar válido e com as permissões adequadas

## Troubleshooting

### Erro "Tarefa não encontrada"
- Verifique se o ID da tarefa está correto
- Confirme se você tem permissão para acessar o projeto onde a tarefa está localizada

### Erro "Token de acesso inválido"
- Verifique se o token está correto no arquivo `.env`
- Confirme se o token não expirou
- Verifique se o token tem as permissões necessárias

### Erro de conexão
- Verifique a conectividade com o Azure DevOps
- Confirme se as variáveis de ambiente estão configuradas corretamente 