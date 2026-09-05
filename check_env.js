const dotenv = require('dotenv');
const result = dotenv.config({ path: './server/.env' });

if (result.error) {
  console.log('ENV_ERROR:', result.error.message);
  process.exit(1);
}

const env = process.env;
console.log('SUPABASE_URL present:', !!env.SUPABASE_URL && !env.SUPABASE_URL.includes('placeholder'));
console.log('SUPABASE_SERVICE_ROLE_KEY present:', !!env.SUPABASE_SERVICE_ROLE_KEY && !env.SUPABASE_SERVICE_ROLE_KEY.includes('placeholder'));
console.log('GEMINI_API_KEY present:', !!env.GEMINI_API_KEY && !env.GEMINI_API_KEY.includes('your-gemini'));
