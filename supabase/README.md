# 🗄️ Configuração do Banco de Dados - Urban Hustle

Este diretório contém todos os arquivos necessários para configurar o banco de dados completo do Urban Hustle.

## 📁 Arquivos

### `complete-schema.sql`

Schema completo do banco de dados com todas as tabelas necessárias:

- **Tabelas principais:** players, items, inventory
- **Sistema de roubos:** robberies, robbery_history
- **Sistema de negócios:** business_types, businesses, business_income_history
- **Sistema hospitalar:** treatments, treatment_history
- **Sistema de casino:** casino_games, casino_history
- **Sistema de nightlife:** nightlife_venues, nightlife_characters, nightlife_history
- **Sistema bancário:** bank_accounts, bank_transactions
- **Sistema prisional:** prisoners, prison_visits

### `seed-complete-data.sql`

Dados iniciais para popular todas as tabelas:

- 9 tipos de roubos (níveis 1-25)
- 9 tipos de negócios para compra
- 10 tratamentos hospitalares
- 9 jogos de casino
- 9 locais de nightlife
- 9 personagens da nightlife
- 9 prisioneiros para visitar

## 🚀 Como Configurar

### Opção 1: Script Automático (Recomendado)

```bash
node scripts/setup-complete-database.cjs
```

### Opção 2: Manual via Supabase Dashboard

1. Acesse o Supabase Dashboard
2. Vá para SQL Editor
3. Execute o conteúdo de `complete-schema.sql`
4. Execute o conteúdo de `seed-complete-data.sql`

### Opção 3: Via Supabase CLI

```bash
supabase db reset
supabase db push
```

## 📊 Estrutura das Tabelas

### 🎯 Sistema de Roubos

- **robberies:** Tipos de roubos disponíveis
- **robbery_history:** Histórico de roubos dos jogadores

### 🏢 Sistema de Negócios

- **business_types:** Tipos de negócios para compra
- **businesses:** Negócios dos jogadores
- **business_income_history:** Histórico de renda

### 🏥 Sistema Hospitalar

- **treatments:** Tipos de tratamentos disponíveis
- **treatment_history:** Histórico de tratamentos

### 🎰 Sistema de Casino

- **casino_games:** Jogos disponíveis
- **casino_history:** Histórico de apostas

### 🌃 Sistema de Nightlife

- **nightlife_venues:** Locais disponíveis
- **nightlife_characters:** Personagens
- **nightlife_history:** Histórico de atividades

### 🏦 Sistema Bancário

- **bank_accounts:** Contas dos jogadores
- **bank_transactions:** Histórico de transações

### 🔒 Sistema Prisional

- **prisoners:** Prisioneiros disponíveis
- **prison_visits:** Histórico de visitas

## 🔐 Segurança

Todas as tabelas têm Row Level Security (RLS) habilitado:

- **Tabelas de referência:** Leitura pública
- **Tabelas de dados do jogador:** Acesso restrito ao próprio usuário

## 📈 Performance

Índices criados para otimizar consultas:

- Índices por player_id em todas as tabelas de histórico
- Índices por data de criação
- Índices por tipo de negócio/roubo

## 🔄 Triggers

Triggers automáticos para:

- Atualização de `updated_at` em tabelas relevantes
- Geração de números de conta bancária únicos

## 🧪 Testando

Após a configuração, você pode testar com:

```bash
node scripts/check-current-data.cjs
```

## 📝 Próximos Passos

1. Execute o script de configuração
2. Teste a criação de um player
3. Teste as funcionalidades do jogo
4. Atualize os tipos do Supabase se necessário

## ⚠️ Importante

- Faça backup do banco antes de executar
- Execute em ambiente de desenvolvimento primeiro
- Verifique se todas as variáveis de ambiente estão configuradas
