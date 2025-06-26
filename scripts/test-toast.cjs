const { createClient } = require("@supabase/supabase-js");

// Teste simples para verificar se o toast está funcionando
console.log("🧪 Testando configuração do toast...");

// Verificar se o sonner está instalado
try {
  require("sonner");
  console.log("✅ Sonner está instalado");
} catch (error) {
  console.log("❌ Sonner não está instalado");
}

// Verificar se o Toaster está sendo renderizado
console.log("📋 Para testar o toast:");
console.log("1. Abra o console do navegador");
console.log('2. Digite: toast.success("Teste")');
console.log("3. Verifique se a notificação aparece");
console.log("4. Verifique se ela desaparece após 4 segundos");

console.log("\n🔧 Configurações atuais do Toaster:");
console.log("- Position: top-right");
console.log("- Duration: 4000ms");
console.log("- CloseButton: true");
console.log("- RichColors: true");
