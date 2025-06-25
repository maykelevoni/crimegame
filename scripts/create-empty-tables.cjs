const fs = require("fs");
const path = require("path");

function createEmptyTables() {
  console.log("📋 Gerando estrutura para tabelas vazias...\n");

  const emptyTables = ["game_sessions", "inventory", "players"];

  // Estruturas básicas para cada tabela vazia
  const tableSchemas = {
    game_sessions: [
      { name: "id", type: "uuid", nullable: false },
      { name: "player_id", type: "uuid", nullable: false },
      { name: "game_type", type: "text", nullable: false },
      { name: "start_time", type: "timestamp with time zone", nullable: false },
      { name: "end_time", type: "timestamp with time zone", nullable: true },
      { name: "result", type: "jsonb", nullable: true },
      { name: "created_at", type: "timestamp with time zone", nullable: false },
    ],
    inventory: [
      { name: "id", type: "uuid", nullable: false },
      { name: "player_id", type: "uuid", nullable: false },
      { name: "item_id", type: "uuid", nullable: false },
      { name: "quantity", type: "integer", nullable: false },
      { name: "equipped", type: "boolean", nullable: false },
      { name: "created_at", type: "timestamp with time zone", nullable: false },
    ],
    players: [
      { name: "id", type: "uuid", nullable: false },
      { name: "user_id", type: "uuid", nullable: false },
      { name: "username", type: "text", nullable: false },
      { name: "level", type: "integer", nullable: false },
      { name: "experience", type: "integer", nullable: false },
      { name: "money", type: "integer", nullable: false },
      { name: "health", type: "integer", nullable: false },
      { name: "energy", type: "integer", nullable: false },
      { name: "reputation", type: "integer", nullable: false },
      { name: "wanted_level", type: "integer", nullable: false },
      { name: "addiction", type: "integer", nullable: false },
      { name: "created_at", type: "timestamp with time zone", nullable: false },
    ],
  };

  // Criar pasta supabase se não existir
  if (!fs.existsSync("supabase")) {
    fs.mkdirSync("supabase");
  }

  // Gerar SQL CREATE TABLE statements
  let sqlContent = `-- Estrutura das tabelas vazias - ${new Date().toISOString()}\n`;
  sqlContent += `-- Gerado automaticamente\n\n`;

  for (const tableName of emptyTables) {
    const columns = tableSchemas[tableName];

    sqlContent += `-- Tabela: ${tableName}\n`;
    sqlContent += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;

    const columnDefinitions = columns.map((col) => {
      let columnDef = `  ${col.name} ${col.type}`;

      if (!col.nullable) {
        columnDef += " NOT NULL";
      }

      return columnDef;
    });

    sqlContent += columnDefinitions.join(",\n") + "\n);\n\n";
  }

  const sqlPath = path.join("supabase", "empty-tables.sql");
  fs.writeFileSync(sqlPath, sqlContent);
  console.log(`💾 SQL salvo em: ${sqlPath}`);

  // Gerar relatório
  const reportPath = path.join("supabase", "empty-tables-report.md");
  let report = `# Estrutura das Tabelas Vazias - ${new Date().toLocaleString(
    "pt-BR"
  )}\n\n`;
  report += `## Tabelas criadas:\n\n`;

  for (const tableName of emptyTables) {
    const columns = tableSchemas[tableName];
    report += `### ${tableName}\n\n`;
    report += `| Coluna | Tipo | Nullable |\n`;
    report += `|--------|------|----------|\n`;

    for (const col of columns) {
      report += `| ${col.name} | ${col.type} | ${
        col.nullable ? "YES" : "NO"
      } |\n`;
    }
    report += `\n`;
  }

  fs.writeFileSync(reportPath, report);
  console.log(`📄 Relatório salvo em: ${reportPath}`);

  console.log("\n✅ Estrutura das tabelas vazias gerada!");
  console.log(`\n📊 Resumo:`);
  console.log(`   - Tabelas vazias: ${emptyTables.length}`);
  console.log(
    `   - game_sessions: ${tableSchemas.game_sessions.length} colunas`
  );
  console.log(`   - inventory: ${tableSchemas.inventory.length} colunas`);
  console.log(`   - players: ${tableSchemas.players.length} colunas`);
}

createEmptyTables();
