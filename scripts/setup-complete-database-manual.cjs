const fs = require("fs");
const path = require("path");

console.log("🚀 Configuração Manual do Banco de Dados - Urban Hustle\n");

console.log("📋 Como executar o schema completo:\n");

console.log("1️⃣ Acesse o Supabase Dashboard:");
console.log("   https://supabase.com/dashboard\n");

console.log('2️⃣ Vá para o seu projeto e clique em "SQL Editor"\n');

console.log("3️⃣ Execute o schema completo:");
const schemaPath = path.join(__dirname, "../supabase/complete-schema.sql");
const schemaSQL = fs.readFileSync(schemaPath, "utf8");
console.log("\n📄 Cole este SQL no editor:");
console.log("=".repeat(80));
console.log(schemaSQL);
console.log("=".repeat(80));

console.log('\n4️⃣ Execute o SQL clicando em "Run"\n');

console.log("5️⃣ Depois execute os dados iniciais:");
const seedPath = path.join(__dirname, "../supabase/seed-complete-data.sql");
const seedSQL = fs.readFileSync(seedPath, "utf8");
console.log("\n📄 Cole este SQL no editor:");
console.log("=".repeat(80));
console.log(seedSQL);
console.log("=".repeat(80));

console.log('\n6️⃣ Execute o SQL clicando em "Run"\n');

console.log("✅ Pronto! Seu banco de dados estará configurado com:");
console.log("   • 9 tipos de roubos (níveis 1-25)");
console.log("   • 9 tipos de negócios para compra");
console.log("   • 10 tratamentos hospitalares");
console.log("   • 9 jogos de casino");
console.log("   • 9 locais de nightlife");
console.log("   • 9 personagens da nightlife");
console.log("   • 9 prisioneiros para visitar");
console.log("   • Sistema bancário completo");
console.log("   • Sistema de inventário atualizado\n");

console.log("🧪 Para testar, execute:");
console.log("   node scripts/check-current-data.cjs\n");

console.log("📝 Arquivos criados:");
console.log("   • supabase/complete-schema.sql");
console.log("   • supabase/seed-complete-data.sql");
console.log("   • supabase/README.md");
console.log("   • scripts/setup-complete-database.cjs");
console.log("   • scripts/setup-complete-database-manual.cjs");
