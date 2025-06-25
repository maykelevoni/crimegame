# Relatório de Estrutura Inferida - 25/06/2025, 18:28:12

## Resumo
- **Total de tabelas verificadas:** 11
- **Tabelas com estrutura inferida:** 8

## Estrutura das Tabelas:

### business_types

**Registros analisados:** 10

| Coluna | Tipo Inferido | Nullable |
|--------|---------------|----------|
| id | uuid | NO |
| name | text | NO |
| type | text | NO |
| description | text | NO |
| base_price | integer | NO |
| base_income | integer | NO |
| max_level | integer | NO |
| upgrade_cost_multiplier | integer | NO |
| income_multiplier | numeric | NO |
| risk_level | integer | NO |
| available | boolean | NO |
| created_at | timestamp with time zone | NO |

### casino_games

**Registros analisados:** 10

| Coluna | Tipo Inferido | Nullable |
|--------|---------------|----------|
| id | uuid | NO |
| name | text | NO |
| description | text | NO |
| type | text | NO |
| min_bet | integer | NO |
| max_bet | integer | NO |
| house_edge | numeric | NO |
| payout_multiplier | integer | NO |
| available | boolean | NO |
| created_at | timestamp with time zone | NO |

### items

**Registros analisados:** 10

| Coluna | Tipo Inferido | Nullable |
|--------|---------------|----------|
| id | uuid | NO |
| name | text | NO |
| image | text | NO |
| type | text | NO |
| description | text | NO |
| bonus | jsonb | NO |
| rarity | text | NO |
| price | integer | NO |
| stackable | boolean | NO |
| category | text | NO |
| available | boolean | NO |
| created_at | timestamp with time zone | NO |

### nightlife_characters

**Registros analisados:** 10

| Coluna | Tipo Inferido | Nullable |
|--------|---------------|----------|
| id | uuid | NO |
| venue_id | uuid | NO |
| name | text | NO |
| description | text | NO |
| image_url | text | NO |
| price | integer | NO |
| energy_cost | integer | NO |
| effects | jsonb | NO |
| available | boolean | NO |
| created_at | timestamp with time zone | NO |

### nightlife_venues

**Registros analisados:** 10

| Coluna | Tipo Inferido | Nullable |
|--------|---------------|----------|
| id | uuid | NO |
| name | text | NO |
| type | text | NO |
| description | text | NO |
| energy_cost | integer | NO |
| money_cost | integer | NO |
| health_effect | integer | NO |
| energy_effect | integer | NO |
| addiction_effect | integer | NO |
| reputation_effect | integer | NO |
| min_level | integer | NO |
| available | boolean | NO |
| created_at | timestamp with time zone | NO |

### prisoners

**Registros analisados:** 9

| Coluna | Tipo Inferido | Nullable |
|--------|---------------|----------|
| id | uuid | NO |
| name | text | NO |
| description | text | NO |
| image_url | text | NO |
| crime_type | text | NO |
| sentence_days | integer | NO |
| release_date | timestamp with time zone | NO |
| bribe_cost | integer | NO |
| escape_difficulty | integer | NO |
| available | boolean | NO |
| created_at | timestamp with time zone | NO |

### robberies

**Registros analisados:** 10

| Coluna | Tipo Inferido | Nullable |
|--------|---------------|----------|
| id | uuid | NO |
| name | text | NO |
| description | text | NO |
| type | text | NO |
| min_level | integer | NO |
| energy_cost | integer | NO |
| success_rate | integer | NO |
| base_reward | integer | NO |
| max_reward | integer | NO |
| risk_level | integer | NO |
| required_equipment | jsonb | NO |
| location | text | NO |
| available | boolean | NO |
| cooldown_minutes | integer | NO |
| created_at | timestamp with time zone | NO |

### treatments

**Registros analisados:** 10

| Coluna | Tipo Inferido | Nullable |
|--------|---------------|----------|
| id | uuid | NO |
| name | text | NO |
| description | text | NO |
| type | text | NO |
| cost | integer | NO |
| health_restore | integer | NO |
| energy_restore | integer | NO |
| addiction_reduction | integer | NO |
| wanted_level_reduction | integer | NO |
| duration_minutes | integer | NO |
| cooldown_minutes | integer | NO |
| min_level | integer | NO |
| available | boolean | NO |
| created_at | timestamp with time zone | NO |

