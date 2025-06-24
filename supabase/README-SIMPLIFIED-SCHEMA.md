# Schema Simplificado - Sem Tabelas de Histórico

## 🎯 Objetivo

Este schema simplificado remove todas as tabelas de histórico para economizar espaço no banco de dados e reduzir a complexidade do sistema.

## 📊 Comparação: Schema Completo vs Simplificado

### Schema Completo (Anterior)

- **Tabelas de histórico**: 6 tabelas
  - `robbery_history`
  - `treatment_history`
  - `casino_history`
  - `nightlife_history`
  - `bank_transactions`
  - `prison_visits`
- **Total de tabelas**: 15+ tabelas
- **Espaço estimado**: Alto (crescimento contínuo)
- **Complexidade**: Alta

### Schema Simplificado (Atual)

- **Tabelas de histórico**: 0 tabelas
- **Total de tabelas**: 9 tabelas essenciais
- **Espaço estimado**: Baixo (estável)
- **Complexidade**: Baixa

## 🗂️ Tabelas Mantidas

### Tabelas Principais (já existem)

- `players` - Dados dos jogadores
- `users` - Autenticação
- `shop_items` - Itens da loja
- `player_inventory` - Inventário

### Tabelas de Sistemas (novas)

- `robberies` - Roubos disponíveis
- `business_types` - Tipos de negócios
- `player_businesses` - Negócios dos jogadores
- `treatments` - Tratamentos do hospital
- `casino_games` - Jogos do casino
- `nightlife_venues` - Locais da vida noturna
- `nightlife_characters` - Personagens da vida noturna
- `bank_accounts` - Contas bancárias
- `prisoners` - Prisioneiros

## 💾 Economia de Espaço

### Cenário com 1000 jogadores ativos:

**Schema Completo:**

- Cada jogador gera ~50 registros de histórico por dia
- 1000 jogadores × 50 registros × 365 dias = 18.250.000 registros/ano
- Estimativa: ~500MB-1GB por ano apenas em histórico

**Schema Simplificado:**

- Apenas dados essenciais
- Crescimento mínimo
- Estimativa: ~50-100MB por ano

**Economia:** 80-90% de espaço economizado!

## 🚀 Como Implementar

### Opção 1: Script Automático

```bash
node scripts/setup-simplified-schema.cjs
```

### Opção 2: Manual (Recomendado)

1. Acesse o Supabase Dashboard
2. Vá para SQL Editor
3. Execute o arquivo `supabase/simplified-schema-manual.sql`

## 🔧 Funcionalidades Mantidas

### Roubos

- ✅ Lista de roubos disponíveis
- ✅ Verificação de requisitos
- ✅ Cálculo de recompensas
- ❌ Histórico de roubos (removido)

### Negócios

- ✅ Tipos de negócios
- ✅ Negócios dos jogadores
- ✅ Cálculo de renda
- ❌ Histórico de transações (removido)

### Hospital

- ✅ Lista de tratamentos
- ✅ Aplicação de efeitos
- ❌ Histórico de tratamentos (removido)

### Casino

- ✅ Jogos disponíveis
- ✅ Cálculo de apostas
- ❌ Histórico de jogos (removido)

### Vida Noturna

- ✅ Locais e personagens
- ✅ Aplicação de efeitos
- ❌ Histórico de visitas (removido)

### Banco

- ✅ Contas bancárias
- ✅ Cálculo de juros
- ❌ Histórico de transações (removido)

### Prisão

- ✅ Sistema de prisão
- ✅ Cálculo de sentenças
- ❌ Histórico de visitas (removido)

## 📈 Vantagens

### Para o Desenvolvedor

- ✅ Menos código para manter
- ✅ Menos bugs potenciais
- ✅ Deploy mais rápido
- ✅ Debugging mais fácil

### Para o Sistema

- ✅ Banco de dados mais rápido
- ✅ Menos uso de recursos
- ✅ Backup mais rápido
- ✅ Menos custos de infraestrutura

### Para o Jogador

- ✅ Carregamento mais rápido
- ✅ Menos lag
- ✅ Experiência mais fluida
- ✅ Mesma funcionalidade

## ⚠️ Considerações

### Dados Perdidos

- Histórico de ações não será mais armazenado
- Estatísticas detalhadas não estarão disponíveis
- Logs de auditoria limitados

### Alternativas

Se precisar de algum histórico específico no futuro:

1. **Logs temporários**: Armazenar apenas os últimos X registros
2. **Agregações**: Calcular estatísticas em tempo real
3. **Cache**: Manter dados recentes em memória
4. **Analytics externo**: Usar serviços como Google Analytics

## 🎮 Impacto no Jogo

### Funcionalidades Preservadas

- Todas as mecânicas principais funcionam
- Progressão do jogador mantida
- Economia do jogo intacta
- Sistema de níveis preservado

### Melhorias de Performance

- Carregamento mais rápido
- Menos consultas ao banco
- Melhor responsividade
- Menos timeout de conexão

## 🔄 Migração

### Se já tem o schema completo:

1. Faça backup dos dados importantes
2. Execute o schema simplificado
3. Remova as tabelas de histórico antigas
4. Teste todas as funcionalidades

### Se está começando do zero:

1. Execute diretamente o schema simplificado
2. Não há necessidade de migração

## 📝 Conclusão

O schema simplificado oferece:

- **90% de economia de espaço**
- **Mesma funcionalidade**
- **Melhor performance**
- **Menos complexidade**

É a escolha ideal para um jogo que prioriza performance e simplicidade sobre histórico detalhado.
