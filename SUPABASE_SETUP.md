# 🚀 Configuração do Supabase

Este guia te ajudará a configurar o Supabase para o Urban Hustle Game.

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Node.js e npm instalados
3. Git configurado

## 🔧 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha sua organização
5. Digite um nome para o projeto (ex: "urban-hustle-game")
6. Escolha uma senha forte para o banco
7. Escolha uma região próxima
8. Clique em "Create new project"

### 2. Obter Credenciais

1. No dashboard do projeto, vá em **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL** (ex: `https://your-project-id.supabase.co`)
   - **anon public** key (começa com `eyJ...`)

### 3. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env` na raiz do projeto:

```bash
cp env.example .env
```

2. Edite o arquivo `.env` e adicione suas credenciais:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Configurar Banco de Dados

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Copie e cole o conteúdo do arquivo `supabase/schema.sql`
4. Clique em **Run** para executar o script

### 5. Configurar Autenticação

1. No dashboard, vá em **Authentication** > **Settings**
2. Em **Site URL**, adicione: `http://localhost:5173`
3. Em **Redirect URLs**, adicione: `http://localhost:5173/**`
4. Salve as configurações

### 6. Testar a Configuração

1. Execute o projeto:

```bash
npm run dev
```

2. Abra o navegador em `http://localhost:5173`
3. Verifique se não há erros no console

## 🗄️ Estrutura do Banco

O banco de dados inclui as seguintes tabelas:

- **players**: Dados básicos do jogador
- **player_stats**: Estatísticas do jogador (vida, energia, etc.)
- **items**: Itens disponíveis na loja
- **inventory**: Inventário do jogador
- **businesses**: Negócios do jogador
- **treatment_history**: Histórico de tratamentos
- **game_sessions**: Sessões de jogo

## 🔒 Segurança

- Row Level Security (RLS) está habilitado
- Cada usuário só pode acessar seus próprios dados
- Políticas de segurança configuradas automaticamente

## 🚨 Troubleshooting

### Erro: "Missing Supabase environment variables"

- Verifique se o arquivo `.env` existe
- Confirme se as variáveis estão corretas
- Reinicie o servidor de desenvolvimento

### Erro: "Invalid API key"

- Verifique se a chave anon está correta
- Confirme se o projeto está ativo
- Verifique se a URL do projeto está correta

### Erro: "Table does not exist"

- Execute o script SQL novamente
- Verifique se todas as tabelas foram criadas
- Confirme se as políticas RLS estão ativas

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no console do navegador
2. Consulte a [documentação do Supabase](https://supabase.com/docs)
3. Abra uma issue no GitHub do projeto

## 🎯 Próximos Passos

Após a configuração:

1. Teste o login/registro
2. Verifique se os dados estão sendo salvos
3. Teste a sincronização em tempo real
4. Configure backups automáticos (opcional)

---

**🎮 Divirta-se jogando Urban Hustle!**
