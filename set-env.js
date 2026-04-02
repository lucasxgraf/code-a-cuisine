const fs = require('fs');
const path = require('path');

const dir = './src/environments';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const targetPath = path.join(dir, 'environment.ts');

const envConfigFile = `
export const environment = {
  production: true,
  spoonacularApiKey: '${process.env.SPOONACULAR_API_KEY || ""}',
  spoonacularApiUrl: '${process.env.SPOONACULAR_API_URL || ""}',
  supabaseUrl: '${process.env.SUPABASE_URL || ""}',
  supabaseKey: '${process.env.SUPABASE_KEY || ""}',
  n8nWebhook: '${process.env.N8N_WEBHOOK || ""}'
};
`;

fs.writeFileSync(targetPath, envConfigFile);
console.log(`✅ Environment file generated at ${targetPath}`);