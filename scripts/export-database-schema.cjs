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

async function getTableSchema(tableName) {
  try {
    // Buscar informações da estrutura da tabela
    const { data, error } = await supabase
      .from("information_schema.columns")
      .select("*")
      .eq("table_schema", "public")
      .eq("table_name", tableName)
      .order("ordinal_position");

    if (error) {
      return { schema: null, error: error.message };
    }
    return { schema: data, error: null };
  } catch (err) {
    return { schema: null, error: err.message };
  }
}

async function getTableConstraints(tableName) {
  try {
    // Buscar constraints da tabela
    const { data, error } = await supabase
      .from("information_schema.table_constraints")
      .select("*")
      .eq("table_schema", "public")
      .eq("table_name", tableName);

    if (error) {
      return { constraints: null, error: error.message };
    }
    return { constraints: data, error: null };
  } catch (err) {
    return { constraints: null, error: err.message };
  }
}

async function getColumnConstraints(tableName) {
  try {
    // Buscar constraints de colunas
    const { data, error } = await supabase
      .from("information_schema.key_column_usage")
      .select("*")
      .eq("table_schema", "public")
      .eq("table_name", tableName);

    if (error) {
      return { columnConstraints: null, error: error.message };
    }
    return { columnConstraints: data, error: null };
  } catch (err) {
    return { columnConstraints: null, error: err.message };
  }
}

async function exportDatabaseSchema() {
  console.log("🏗️ Iniciando exportação da estrutura do banco de dados...\n");

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

  const schemaData = {
    timestamp: new Date().toISOString(),
    tables: {},
    summary: {
      totalTables: 0,
      tablesWithSchema: 0,
    },
  };

  console.log("📋 Verificando estrutura das tabelas...\n");

  for (const tableName of tables) {
    console.log(`🔍 Verificando estrutura: ${tableName}`);

    const { schema, error: schemaError } = await getTableSchema(tableName);
    const { constraints, error: constraintsError } = await getTableConstraints(
      tableName
    );
    const { columnConstraints, error: columnConstraintsError } =
      await getColumnConstraints(tableName);

    if (schemaError) {
      console.log(`   ❌ Erro ao buscar schema: ${schemaError}\n`);
      continue;
    }

    if (schema && schema.length > 0) {
      schemaData.tables[tableName] = {
        columns: schema,
        constraints: constraints || [],
        columnConstraints: columnConstraints || [],
      };
      schemaData.summary.totalTables++;
      schemaData.summary.tablesWithSchema++;
      console.log(`   ✅ ${schema.length} colunas encontradas\n`);
    } else {
      console.log(`   📭 Nenhuma coluna encontrada\n`);
    }
  }

  // Criar pasta supabase se não existir
  const fs = require("fs");
  const path = require("path");

  if (!fs.existsSync("supabase")) {
    fs.mkdirSync("supabase");
    console.log("📁 Pasta supabase criada");
  }

  // Salvar schema em JSON
  const jsonPath = path.join("supabase", "database-schema.json");
  fs.writeFileSync(jsonPath, JSON.stringify(schemaData, null, 2));
  console.log(`\n💾 Schema salvo em: ${jsonPath}`);

  // Gerar SQL CREATE TABLE statements
  let sqlContent = `-- Estrutura do banco de dados - ${new Date().toISOString()}\n`;
  sqlContent += `-- Gerado automaticamente\n\n`;

  for (const [tableName, tableData] of Object.entries(schemaData.tables)) {
    sqlContent += `-- Tabela: ${tableName}\n`;
    sqlContent += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;

    const columns = tableData.columns.map((col) => {
      let columnDef = `  ${col.column_name} ${col.data_type}`;

      if (col.character_maximum_length) {
        columnDef += `(${col.character_maximum_length})`;
      }

      if (col.is_nullable === "NO") {
        columnDef += " NOT NULL";
      }

      if (col.column_default) {
        columnDef += ` DEFAULT ${col.column_default}`;
      }

      return columnDef;
    });

    sqlContent += columns.join(",\n") + "\n);\n\n";
  }

  const sqlPath = path.join("supabase", "database-schema.sql");
  fs.writeFileSync(sqlPath, sqlContent);
  console.log(`💾 SQL salvo em: ${sqlPath}`);

  // Gerar relatório detalhado
  const reportPath = path.join("supabase", "schema-report.md");
  let report = `# Relatório de Estrutura - ${new Date().toLocaleString(
    "pt-BR"
  )}\n\n`;
  report += `## Resumo\n`;
  report += `- **Total de tabelas verificadas:** ${tables.length}\n`;
  report += `- **Tabelas com estrutura encontrada:** ${schemaData.summary.tablesWithSchema}\n\n`;

  report += `## Estrutura das Tabelas:\n\n`;
  for (const [tableName, tableData] of Object.entries(schemaData.tables)) {
    report += `### ${tableName}\n\n`;
    report += `| Coluna | Tipo | Nullable | Default |\n`;
    report += `|--------|------|----------|--------|\n`;

    for (const col of tableData.columns) {
      let type = col.data_type;
      if (col.character_maximum_length) {
        type += `(${col.character_maximum_length})`;
      }

      report += `| ${col.column_name} | ${type} | ${col.is_nullable} | ${
        col.column_default || "-"
      } |\n`;
    }
    report += `\n`;
  }

  fs.writeFileSync(reportPath, report);
  console.log(`📄 Relatório salvo em: ${reportPath}`);

  console.log("\n✅ Exportação da estrutura concluída!");
  console.log(`\n📊 Resumo:`);
  console.log(`   - Tabelas verificadas: ${tables.length}`);
  console.log(
    `   - Tabelas com estrutura: ${schemaData.summary.tablesWithSchema}`
  );
}

exportDatabaseSchema().catch(console.error);
