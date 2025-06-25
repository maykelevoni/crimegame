const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variáveis de ambiente necessárias");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportFullDatabase() {
  console.log("📤 Exportando banco de dados completo...");
  console.log("🔗 URL:", supabaseUrl);

  const exportData = {
    timestamp: new Date().toISOString(),
    project_url: supabaseUrl,
    tables: {},
    summary: {},
  };

  // Lista completa de tabelas para exportar
  const tables = [
    "players",
    "player_stats",
    "items",
    "inventory",
    "businesses",
    "treatment_history",
    "game_sessions",
  ];

  let totalRecords = 0;

  for (const table of tables) {
    console.log(`\n📋 Exportando tabela: ${table}`);

    try {
      const { data, error } = await supabase.from(table).select("*");

      if (error) {
        console.log(`⚠️  Tabela ${table} não existe ou erro: ${error.message}`);
        exportData.tables[table] = [];
        exportData.summary[table] = {
          count: 0,
          status: "error",
          message: error.message,
        };
        continue;
      }

      if (data && data.length > 0) {
        exportData.tables[table] = data;
        exportData.summary[table] = { count: data.length, status: "success" };
        totalRecords += data.length;
        console.log(`✅ ${table}: ${data.length} registros exportados`);

        // Mostrar alguns exemplos dos dados
        if (data.length > 0) {
          const sample = data[0];
          const sampleKeys = Object.keys(sample).slice(0, 3);
          console.log(`   📝 Exemplo: ${sampleKeys.join(", ")}`);
        }
      } else {
        exportData.tables[table] = [];
        exportData.summary[table] = { count: 0, status: "empty" };
        console.log(`ℹ️  ${table}: 0 registros (tabela vazia)`);
      }
    } catch (err) {
      console.log(`❌ Erro ao exportar ${table}: ${err.message}`);
      exportData.tables[table] = [];
      exportData.summary[table] = {
        count: 0,
        status: "error",
        message: err.message,
      };
    }
  }

  // Gerar arquivo JSON completo
  const jsonPath = path.join(
    __dirname,
    "../supabase/full-database-export.json"
  );
  fs.writeFileSync(jsonPath, JSON.stringify(exportData, null, 2));

  // Gerar SQL de inserção
  generateSQLFile(exportData);

  // Gerar relatório
  generateReport(exportData, totalRecords);

  console.log(`\n✅ Exportação completa finalizada!`);
  console.log(`📊 Total de registros exportados: ${totalRecords}`);
  console.log(`📁 Arquivos gerados:`);
  console.log(`   - JSON: supabase/full-database-export.json`);
  console.log(`   - SQL: supabase/full-database-export.sql`);
  console.log(`   - Relatório: supabase/export-report.md`);
}

function generateSQLFile(exportData) {
  console.log("\n🔧 Gerando arquivo SQL...");

  let sqlContent = "-- =====================================================\n";
  sqlContent += "-- CRIMEDB - EXPORTAÇÃO COMPLETA DO BANCO\n";
  sqlContent += "-- =====================================================\n";
  sqlContent += `-- Exportado em: ${exportData.timestamp}\n`;
  sqlContent += `-- Projeto: ${exportData.project_url}\n\n`;

  Object.keys(exportData.tables).forEach((tableName) => {
    const records = exportData.tables[tableName];
    const summary = exportData.summary[tableName];

    if (summary.status === "success" && records.length > 0) {
      sqlContent += `-- Tabela: ${tableName} (${records.length} registros)\n`;

      records.forEach((record) => {
        const columns = Object.keys(record).filter(
          (key) => record[key] !== null
        );
        const values = columns.map((key) => {
          const value = record[key];
          if (typeof value === "string") {
            return `'${value.replace(/'/g, "''")}'`;
          } else if (typeof value === "object") {
            return `'${JSON.stringify(value)}'`;
          } else {
            return value;
          }
        });

        sqlContent += `INSERT INTO public.${tableName} (${columns.join(
          ", "
        )}) VALUES (${values.join(", ")});\n`;
      });

      sqlContent += "\n";
    }
  });

  const sqlPath = path.join(__dirname, "../supabase/full-database-export.sql");
  fs.writeFileSync(sqlPath, sqlContent);

  console.log(`✅ SQL gerado: ${sqlPath}`);
}

function generateReport(exportData, totalRecords) {
  console.log("\n📋 Gerando relatório...");

  let reportContent = `# 📊 Relatório de Exportação - CRIMEDB

## 📅 Informações Gerais
- **Data/Hora**: ${exportData.timestamp}
- **Projeto**: ${exportData.project_url}
- **Total de Registros**: ${totalRecords}

## 📋 Resumo por Tabela

`;

  Object.keys(exportData.summary).forEach((tableName) => {
    const summary = exportData.summary[tableName];
    const status =
      summary.status === "success"
        ? "✅"
        : summary.status === "empty"
        ? "ℹ️"
        : "❌";

    reportContent += `### ${status} ${tableName}
- **Status**: ${summary.status}
- **Registros**: ${summary.count}
`;

    if (summary.message) {
      reportContent += `- **Erro**: ${summary.message}\n`;
    }
    reportContent += "\n";
  });

  reportContent += `## 📁 Arquivos Gerados
- \`full-database-export.json\` - Dados completos em JSON
- \`full-database-export.sql\` - Scripts SQL para importação
- \`export-report.md\` - Este relatório

## 🎯 Próximos Passos
1. Use o arquivo SQL para importar dados em um novo projeto
2. Verifique se todos os dados foram exportados corretamente
3. Teste a importação em um ambiente de desenvolvimento
`;

  const reportPath = path.join(__dirname, "../supabase/export-report.md");
  fs.writeFileSync(reportPath, reportContent);

  console.log(`✅ Relatório gerado: ${reportPath}`);
}

exportFullDatabase()
  .then(() => {
    console.log("\n✅ Script concluído com sucesso!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erro fatal:", error);
    process.exit(1);
  });
