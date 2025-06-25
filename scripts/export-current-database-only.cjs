const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Variáveis de ambiente não encontradas!");
  console.error("VITE_SUPABASE_URL:", supabaseUrl ? "✅" : "❌");
  console.error("VITE_SUPABASE_ANON_KEY:", supabaseServiceKey ? "✅" : "❌");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTableExists(tableName) {
  try {
    const { data, error } = await supabase.from(tableName).select("*").limit(1);

    if (error) {
      if (error.code === "PGRST116") {
        return { exists: false, error: "Tabela não existe" };
      }
      return { exists: false, error: error.message };
    }
    return { exists: true, error: null };
  } catch (err) {
    return { exists: false, error: err.message };
  }
}

async function getTableData(tableName) {
  try {
    console.log(`   🔍 Buscando dados de ${tableName}...`);

    // Primeiro, tentar contar os registros
    const { count, error: countError } = await supabase
      .from(tableName)
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.log(`   ❌ Erro ao contar: ${countError.message}`);
    } else {
      console.log(`   📊 Total de registros na tabela: ${count}`);
    }

    // Buscar todos os dados sem limite
    const { data, error } = await supabase.from(tableName).select("*");

    if (error) {
      return { data: null, error: error.message };
    }

    console.log(`   ✅ Dados encontrados: ${data ? data.length : 0} registros`);
    if (data && data.length > 0) {
      console.log(`   📝 Primeiro registro:`, JSON.stringify(data[0], null, 2));
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

async function exportCurrentDatabase() {
  console.log("🚀 Iniciando exportação do banco de dados atual...\n");

  // Lista exata das tabelas do banco
  const allTables = [
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

  const exportData = {
    timestamp: new Date().toISOString(),
    tables: {},
    summary: {
      totalTables: 0,
      tablesWithData: 0,
      totalRecords: 0,
    },
  };

  console.log("📋 Verificando tabelas existentes...\n");

  for (const tableName of allTables) {
    console.log(`🔍 Verificando tabela: ${tableName}`);

    const { data, error } = await getTableData(tableName);
    if (error) {
      console.log(`   ❌ Erro ao buscar dados: ${error}\n`);
      continue;
    }

    exportData.summary.totalTables++;

    if (data && data.length > 0) {
      exportData.tables[tableName] = data;
      exportData.summary.tablesWithData++;
      exportData.summary.totalRecords += data.length;
      console.log(`   📊 ${data.length} registros encontrados\n`);
    } else {
      console.log(`   📭 Tabela vazia\n`);
    }
  }

  // Criar pasta supabase se não existir
  const fs = require("fs");
  const path = require("path");

  if (!fs.existsSync("supabase")) {
    fs.mkdirSync("supabase");
    console.log("📁 Pasta supabase criada");
  }

  // Salvar dados em JSON
  const jsonPath = path.join("supabase", "current-database-export.json");
  fs.writeFileSync(jsonPath, JSON.stringify(exportData, null, 2));
  console.log(`\n💾 Dados salvos em: ${jsonPath}`);

  // Gerar SQL INSERT statements
  let sqlContent = `-- Exportação do banco de dados atual - ${new Date().toISOString()}\n`;
  sqlContent += `-- Gerado automaticamente - APENAS dados existentes\n\n`;

  for (const [tableName, records] of Object.entries(exportData.tables)) {
    if (records.length > 0) {
      sqlContent += `-- Tabela: ${tableName} (${records.length} registros)\n`;

      for (const record of records) {
        const columns = Object.keys(record);
        const values = Object.values(record).map((value) => {
          if (value === null) return "NULL";
          if (typeof value === "string")
            return `'${value.replace(/'/g, "''")}'`;
          if (typeof value === "boolean") return value ? "true" : "false";
          if (typeof value === "object") {
            // Tratar objetos JSON corretamente
            return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
          }
          return value;
        });

        sqlContent += `INSERT INTO ${tableName} (${columns.join(
          ", "
        )}) VALUES (${values.join(", ")});\n`;
      }
      sqlContent += "\n";
    }
  }

  const sqlPath = path.join("supabase", "current-database-export.sql");
  fs.writeFileSync(sqlPath, sqlContent);
  console.log(`💾 SQL salvo em: ${sqlPath}`);

  // Gerar relatório
  const reportPath = path.join("supabase", "export-report.md");
  let report = `# Relatório de Exportação - ${new Date().toLocaleString(
    "pt-BR"
  )}\n\n`;
  report += `## Resumo\n`;
  report += `- **Total de tabelas verificadas:** ${allTables.length}\n`;
  report += `- **Tabelas existentes:** ${exportData.summary.totalTables}\n`;
  report += `- **Tabelas com dados:** ${exportData.summary.tablesWithData}\n`;
  report += `- **Total de registros:** ${exportData.summary.totalRecords}\n\n`;

  report += `## Tabelas com dados:\n`;
  for (const [tableName, records] of Object.entries(exportData.tables)) {
    report += `- **${tableName}:** ${records.length} registros\n`;
  }

  report += `\n## Tabelas vazias ou inexistentes:\n`;
  for (const tableName of allTables) {
    if (!exportData.tables[tableName]) {
      report += `- ${tableName}\n`;
    }
  }

  fs.writeFileSync(reportPath, report);
  console.log(`📄 Relatório salvo em: ${reportPath}`);

  console.log("\n✅ Exportação concluída!");
  console.log(`\n📊 Resumo:`);
  console.log(`   - Tabelas verificadas: ${allTables.length}`);
  console.log(`   - Tabelas existentes: ${exportData.summary.totalTables}`);
  console.log(`   - Tabelas com dados: ${exportData.summary.tablesWithData}`);
  console.log(`   - Total de registros: ${exportData.summary.totalRecords}`);
}

exportCurrentDatabase().catch(console.error);
