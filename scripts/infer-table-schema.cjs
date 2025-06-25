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

function inferDataType(value) {
  if (value === null) return "unknown";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") {
    if (Number.isInteger(value)) return "integer";
    return "numeric";
  }
  if (typeof value === "string") {
    // Verificar se é UUID
    if (
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        value
      )
    ) {
      return "uuid";
    }
    // Verificar se é timestamp
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      return "timestamp";
    }
    // Verificar se é JSON
    try {
      JSON.parse(value);
      return "jsonb";
    } catch {
      return "text";
    }
  }
  if (typeof value === "object") {
    return "jsonb";
  }
  return "text";
}

function analyzeTableStructure(data) {
  if (!data || data.length === 0) {
    return { columns: [], sampleData: null };
  }

  const columns = {};
  const sampleData = data[0];

  // Analisar cada registro para inferir tipos
  for (const record of data) {
    for (const [columnName, value] of Object.entries(record)) {
      if (!columns[columnName]) {
        columns[columnName] = {
          name: columnName,
          types: new Set(),
          nullable: true,
          hasDefault: false,
        };
      }

      const dataType = inferDataType(value);
      columns[columnName].types.add(dataType);

      if (value !== null) {
        columns[columnName].nullable = false;
      }
    }
  }

  // Determinar o tipo mais apropriado para cada coluna
  const columnDefinitions = Object.values(columns).map((col) => {
    const types = Array.from(col.types);
    let finalType = "text"; // padrão

    if (types.includes("uuid")) {
      finalType = "uuid";
    } else if (types.includes("timestamp")) {
      finalType = "timestamp with time zone";
    } else if (types.includes("jsonb")) {
      finalType = "jsonb";
    } else if (types.includes("boolean")) {
      finalType = "boolean";
    } else if (types.includes("integer")) {
      finalType = "integer";
    } else if (types.includes("numeric")) {
      finalType = "numeric";
    }

    return {
      name: col.name,
      type: finalType,
      nullable: col.nullable,
      hasDefault: col.hasDefault,
    };
  });

  return { columns: columnDefinitions, sampleData };
}

async function getTableData(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .limit(10); // Limitar para análise mais rápida

    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

async function inferDatabaseSchema() {
  console.log("🔍 Inferindo estrutura do banco de dados...\n");

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

  for (const tableName of tables) {
    console.log(`🔍 Analisando tabela: ${tableName}`);

    const { data, error } = await getTableData(tableName);

    if (error) {
      console.log(`   ❌ Erro ao buscar dados: ${error}\n`);
      // Mesmo com erro, vamos criar uma estrutura básica
      schemaData.tables[tableName] = {
        columns: [
          { name: "id", type: "uuid", nullable: false },
          {
            name: "created_at",
            type: "timestamp with time zone",
            nullable: false,
          },
        ],
        sampleData: null,
        recordCount: 0,
        note: "Estrutura básica criada - tabela vazia ou inacessível",
      };
      schemaData.summary.totalTables++;
      schemaData.summary.tablesWithSchema++;
      console.log(`   ⚠️ Estrutura básica criada (tabela vazia/inacessível)\n`);
      continue;
    }

    if (data && data.length > 0) {
      const { columns, sampleData } = analyzeTableStructure(data);
      schemaData.tables[tableName] = {
        columns,
        sampleData,
        recordCount: data.length,
      };
      schemaData.summary.totalTables++;
      schemaData.summary.tablesWithSchema++;
      console.log(`   ✅ ${columns.length} colunas inferidas\n`);
    } else {
      // Tabela vazia - criar estrutura básica
      schemaData.tables[tableName] = {
        columns: [
          { name: "id", type: "uuid", nullable: false },
          {
            name: "created_at",
            type: "timestamp with time zone",
            nullable: false,
          },
        ],
        sampleData: null,
        recordCount: 0,
        note: "Estrutura básica criada - tabela vazia",
      };
      schemaData.summary.totalTables++;
      schemaData.summary.tablesWithSchema++;
      console.log(`   📭 Tabela vazia - estrutura básica criada\n`);
    }
  }

  // Criar pasta supabase se não existir
  const fs = require("fs");
  const path = require("path");

  if (!fs.existsSync("supabase")) {
    fs.mkdirSync("supabase");
  }

  // Salvar schema inferido em JSON
  const jsonPath = path.join("supabase", "inferred-schema.json");
  fs.writeFileSync(jsonPath, JSON.stringify(schemaData, null, 2));
  console.log(`\n💾 Schema inferido salvo em: ${jsonPath}`);

  // Gerar SQL CREATE TABLE statements
  let sqlContent = `-- Estrutura inferida do banco de dados - ${new Date().toISOString()}\n`;
  sqlContent += `-- Gerado automaticamente a partir dos dados\n\n`;

  for (const [tableName, tableData] of Object.entries(schemaData.tables)) {
    sqlContent += `-- Tabela: ${tableName}\n`;
    sqlContent += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;

    const columns = tableData.columns.map((col) => {
      let columnDef = `  ${col.name} ${col.type}`;

      if (!col.nullable) {
        columnDef += " NOT NULL";
      }

      return columnDef;
    });

    sqlContent += columns.join(",\n") + "\n);\n\n";
  }

  const sqlPath = path.join("supabase", "inferred-schema.sql");
  fs.writeFileSync(sqlPath, sqlContent);
  console.log(`💾 SQL salvo em: ${sqlPath}`);

  // Gerar relatório detalhado
  const reportPath = path.join("supabase", "inferred-schema-report.md");
  let report = `# Relatório de Estrutura Inferida - ${new Date().toLocaleString(
    "pt-BR"
  )}\n\n`;
  report += `## Resumo\n`;
  report += `- **Total de tabelas verificadas:** ${tables.length}\n`;
  report += `- **Tabelas com estrutura inferida:** ${schemaData.summary.tablesWithSchema}\n\n`;

  report += `## Estrutura das Tabelas:\n\n`;
  for (const [tableName, tableData] of Object.entries(schemaData.tables)) {
    report += `### ${tableName}\n\n`;
    report += `**Registros analisados:** ${tableData.recordCount}\n\n`;
    report += `| Coluna | Tipo Inferido | Nullable |\n`;
    report += `|--------|---------------|----------|\n`;

    for (const col of tableData.columns) {
      report += `| ${col.name} | ${col.type} | ${
        col.nullable ? "YES" : "NO"
      } |\n`;
    }
    report += `\n`;
  }

  fs.writeFileSync(reportPath, report);
  console.log(`📄 Relatório salvo em: ${reportPath}`);

  console.log("\n✅ Inferência da estrutura concluída!");
  console.log(`\n📊 Resumo:`);
  console.log(`   - Tabelas verificadas: ${tables.length}`);
  console.log(
    `   - Tabelas com estrutura: ${schemaData.summary.tablesWithSchema}`
  );
}

inferDatabaseSchema().catch(console.error);
