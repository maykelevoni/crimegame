# Estrutura das Tabelas Vazias - 25/06/2025, 18:40:51

## Tabelas criadas:

### game_sessions

| Coluna | Tipo | Nullable |
|--------|------|----------|
| id | uuid | NO |
| player_id | uuid | NO |
| game_type | text | NO |
| start_time | timestamp with time zone | NO |
| end_time | timestamp with time zone | YES |
| result | jsonb | YES |
| created_at | timestamp with time zone | NO |

### inventory

| Coluna | Tipo | Nullable |
|--------|------|----------|
| id | uuid | NO |
| player_id | uuid | NO |
| item_id | uuid | NO |
| quantity | integer | NO |
| equipped | boolean | NO |
| created_at | timestamp with time zone | NO |

### players

| Coluna | Tipo | Nullable |
|--------|------|----------|
| id | uuid | NO |
| user_id | uuid | NO |
| username | text | NO |
| level | integer | NO |
| experience | integer | NO |
| money | integer | NO |
| health | integer | NO |
| energy | integer | NO |
| reputation | integer | NO |
| wanted_level | integer | NO |
| addiction | integer | NO |
| created_at | timestamp with time zone | NO |

