# Integração com Supabase - CrimeDB

Este documento explica como a integração com o Supabase foi implementada no projeto CrimeDB.

## 📋 Visão Geral

A integração com o Supabase permite:

- Autenticação de usuários
- Persistência de dados do jogador
- Sincronização em tempo real
- Gerenciamento de inventário
- Histórico de ações

## 🏗️ Estrutura da Integração

### 1. Configuração do Cliente Supabase

**Arquivo:** `src/integrations/supabase/client.ts`

```typescript
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://bdxsqakwajhglrwcmhrt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### 2. Tipos TypeScript

**Arquivo:** `src/integrations/supabase/types.ts`

- Tipos gerados automaticamente pelo Supabase CLI
- Define a estrutura das tabelas do banco de dados
- Fornece tipagem forte para todas as operações

### 3. Mapeamento de Tipos

**Arquivo:** `src/lib/typeMappers.ts`

- Converte entre tipos do Supabase e tipos do jogo
- Garante compatibilidade entre diferentes estruturas de dados

### 4. Serviço Supabase

**Arquivo:** `src/services/supabaseService.ts`

- Classe estática com métodos para todas as operações do banco
- Inclui CRUD para players, inventário, negócios, etc.
- Gerencia subscriptions em tempo real

## 🔐 Autenticação

### Hook de Autenticação

```typescript
// src/hooks/useAuth.ts
const { user, signIn, signUp, signOut } = useAuth();
```

### Funcionalidades:

- Login/Registro com email e senha
- Gerenciamento de sessão
- Reset de senha
- Logout

## 👤 Gerenciamento de Dados do Jogador

### Hook de Dados do Jogador

```typescript
// src/hooks/usePlayerData.ts
const { player, inventory, businesses, updatePlayer, addWeaponToInventory } =
  usePlayerData();
```

### Funcionalidades:

- Carregamento automático de dados do jogador
- Criação de novo jogador se não existir
- Atualização de estatísticas
- Gerenciamento de inventário

## 🎮 Contexto do Jogador

### Provider de Contexto

```typescript
// src/contexts/PlayerContext.tsx
<PlayerProvider>
  <AppContent />
</PlayerProvider>
```

### Uso em Componentes

```typescript
const { player, updatePlayer } = usePlayerContext();
```

## 📊 Tabelas do Banco de Dados

### 1. `players`

- Dados básicos do jogador
- Nível, experiência, dinheiro
- Energia e vida máxima

### 2. `weapons`

- Armas disponíveis na loja
- Dano, preço, descrição

### 3. `inventory`

- Itens do jogador
- Relacionamento com weapons
- Quantidade e equipamento

### 4. `businesses`

- Negócios disponíveis
- Tipo, renda, preço

### 5. `crime_history`

- Histórico de crimes
- Recompensas e sucesso

## 🚀 Como Usar

### 1. Instalação

```bash
npm install @supabase/supabase-js
```

### 2. Configuração de Variáveis de Ambiente

Crie um arquivo `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 3. Uso em Componentes

```typescript
import { usePlayerContext } from "@/contexts/PlayerContext";

const MyComponent = () => {
  const { player, updatePlayer } = usePlayerContext();

  const handleUpdateMoney = async () => {
    await updatePlayer({
      ...player,
      stats: { ...player.stats, money: player.stats.money + 100 },
    });
  };

  return (
    <div>
      <p>Dinheiro: ${player?.stats.money}</p>
      <button onClick={handleUpdateMoney}>Adicionar $100</button>
    </div>
  );
};
```

## 🧪 Testando a Integração

### Script de Teste

```bash
node scripts/test-supabase.js
```

### Componente de Teste

```typescript
import { SupabaseTest } from "@/components/SupabaseTest";
```

## 🔄 Sincronização em Tempo Real

### Subscriptions

```typescript
// Inscrever-se em mudanças do jogador
SupabaseService.subscribeToPlayer(playerId, (payload) => {
  console.log("Player updated:", payload);
});

// Inscrever-se em mudanças do inventário
SupabaseService.subscribeToInventory(playerId, (payload) => {
  console.log("Inventory updated:", payload);
});
```

## 🛠️ Operações Disponíveis

### Players

- `createPlayer(name)`: Criar novo jogador
- `getPlayer(id)`: Buscar jogador
- `updatePlayer(id, updates)`: Atualizar jogador

### Inventory

- `getPlayerInventory(playerId)`: Buscar inventário
- `addWeaponToInventory(playerId, weaponId, quantity)`: Adicionar arma

### Businesses

- `getPlayerBusinesses()`: Buscar negócios
- `buyBusiness(business)`: Comprar negócio

### Shop

- `getShopWeapons()`: Buscar armas da loja

### Crime History

- `getCrimeHistory(playerId)`: Buscar histórico
- `addCrimeHistory(playerId, crimeId, reward, success)`: Adicionar crime

## 🔧 Troubleshooting

### Problemas Comuns

1. **Erro de Conexão**

   - Verifique as variáveis de ambiente
   - Teste com o script de teste

2. **Erro de Tipos**

   - Execute `supabase gen types typescript` para atualizar tipos
   - Verifique se os tipos estão sincronizados

3. **Erro de Autenticação**
   - Verifique se o usuário está logado
   - Confirme se as políticas RLS estão configuradas

### Logs de Debug

```typescript
// Ativar logs detalhados
const supabase = createClient(url, key, {
  auth: {
    debug: true,
  },
});
```

## 📈 Próximos Passos

1. **Implementar mais tabelas**

   - Sistema de missões
   - Histórico de transações
   - Relacionamentos entre jogadores

2. **Melhorar performance**

   - Cache local
   - Otimização de queries
   - Paginação

3. **Funcionalidades avançadas**
   - Chat em tempo real
   - Sistema de guildas
   - Rankings

## 📚 Recursos Adicionais

- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de TypeScript](https://supabase.com/docs/guides/api/typescript-support)
- [Exemplos de Integração](https://github.com/supabase/supabase-js)
