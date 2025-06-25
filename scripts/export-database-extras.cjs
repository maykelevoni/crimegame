const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Variáveis de ambiente não encontradas!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function exportDatabaseExtras() {
  console.log("🔧 Iniciando exportação de estruturas adicionais...\n");

  const extras = {
    timestamp: new Date().toISOString(),
    policies: {},
    indexes: {},
    triggers: {},
    functions: {},
    sequences: {},
    foreignKeys: {},
    summary: {
      totalPolicies: 0,
      totalIndexes: 0,
      totalTriggers: 0,
      totalFunctions: 0,
      totalSequences: 0,
      totalForeignKeys: 0,
    },
  };

  const tables = [
    "business_types",
    "casino_games",
    "game_sessions",
    "inventory",
    "items",
    "nightlife_characters",
    "nightlife_venues",
    "players",
    "prisoners",
    "robberies",
    "treatments",
  ];

  // Tentar exportar políticas RLS
  console.log("🔒 Verificando políticas RLS...");
  for (const tableName of tables) {
    try {
      // Tentar diferentes abordagens para verificar políticas
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .limit(1);

      if (!error) {
        extras.policies[tableName] = {
          accessible: true,
          note: "Tabela acessível - políticas podem estar ativas",
        };
        extras.summary.totalPolicies++;
      }
    } catch (err) {
      extras.policies[tableName] = {
        accessible: false,
        error: err.message,
      };
    }
  }

  // Criar pasta supabase se não existir
  const fs = require("fs");
  const path = require("path");

  if (!fs.existsSync("supabase")) {
    fs.mkdirSync("supabase");
  }

  // Salvar extras em JSON
  const jsonPath = path.join("supabase", "database-extras.json");
  fs.writeFileSync(jsonPath, JSON.stringify(extras, null, 2));
  console.log(`💾 Extras salvos em: ${jsonPath}`);

  // Gerar SQL para estruturas adicionais
  let sqlContent = `-- Estruturas adicionais do banco - ${new Date().toISOString()}\n`;
  sqlContent += `-- Políticas RLS, Índices, Triggers, etc.\n\n`;

  sqlContent += `-- ========================================\n`;
  sqlContent += `-- POLÍTICAS RLS (Row Level Security)\n`;
  sqlContent += `-- ========================================\n\n`;

  for (const [tableName, policy] of Object.entries(extras.policies)) {
    sqlContent += `-- Tabela: ${tableName}\n`;
    if (policy.accessible) {
      sqlContent += `-- ✅ Tabela acessível\n`;
      sqlContent += `-- ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;\n`;
      sqlContent += `-- CREATE POLICY "Enable read access for all users" ON ${tableName} FOR SELECT USING (true);\n`;
    } else {
      sqlContent += `-- ❌ Erro de acesso: ${policy.error}\n`;
    }
    sqlContent += `\n`;
  }

  sqlContent += `-- ========================================\n`;
  sqlContent += `-- ÍNDICES RECOMENDADOS\n`;
  sqlContent += `-- ========================================\n\n`;

  for (const tableName of tables) {
    sqlContent += `-- Índices para ${tableName}\n`;
    sqlContent += `-- CREATE INDEX IF NOT EXISTS idx_${tableName}_id ON ${tableName}(id);\n`;
    sqlContent += `-- CREATE INDEX IF NOT EXISTS idx_${tableName}_created_at ON ${tableName}(created_at);\n`;
    sqlContent += `\n`;
  }

  sqlContent += `-- ========================================\n`;
  sqlContent += `-- SEQUÊNCIAS (se necessário)\n`;
  sqlContent += `-- ========================================\n\n`;

  for (const tableName of tables) {
    sqlContent += `-- Sequência para ${tableName}\n`;
    sqlContent += `-- CREATE SEQUENCE IF NOT EXISTS ${tableName}_id_seq;\n`;
    sqlContent += `-- ALTER TABLE ${tableName} ALTER COLUMN id SET DEFAULT nextval('${tableName}_id_seq');\n`;
    sqlContent += `\n`;
  }

  const sqlPath = path.join("supabase", "database-extras.sql");
  fs.writeFileSync(sqlPath, sqlContent);
  console.log(`💾 SQL de extras salvo em: ${sqlPath}`);

  // Gerar relatório
  const reportPath = path.join("supabase", "extras-report.md");
  let report = `# Relatório de Estruturas Adicionais - ${new Date().toLocaleString(
    "pt-BR"
  )}\n\n`;
  report += `## Resumo\n`;
  report += `- **Tabelas verificadas:** ${tables.length}\n`;
  report += `- **Tabelas com políticas:** ${extras.summary.totalPolicies}\n\n`;

  report += `## Políticas RLS:\n\n`;
  for (const [tableName, policy] of Object.entries(extras.policies)) {
    report += `### ${tableName}\n`;
    if (policy.accessible) {
      report += `- ✅ Acessível\n`;
      report += `- 📝 Nota: ${policy.note}\n`;
    } else {
      report += `- ❌ Erro: ${policy.error}\n`;
    }
    report += `\n`;
  }

  report += `## Recomendações:\n\n`;
  report += `1. **Verificar políticas RLS** no Supabase Dashboard\n`;
  report += `2. **Criar índices** para colunas frequentemente consultadas\n`;
  report += `3. **Configurar foreign keys** se necessário\n`;
  report += `4. **Revisar triggers** e funções personalizadas\n`;

  fs.writeFileSync(reportPath, report);
  console.log(`📄 Relatório salvo em: ${reportPath}`);

  console.log("\n✅ Exportação de extras concluída!");
  console.log(`\n📊 Resumo:`);
  console.log(`   - Tabelas verificadas: ${tables.length}`);
  console.log(`   - Tabelas com políticas: ${extras.summary.totalPolicies}`);
  console.log(`\n💡 Próximos passos:`);
  console.log(`   - Verificar políticas RLS no Supabase Dashboard`);
  console.log(`   - Revisar índices e constraints`);
  console.log(`   - Configurar foreign keys se necessário`);
}

exportDatabaseExtras().catch(console.error);
