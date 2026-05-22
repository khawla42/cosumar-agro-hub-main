import fs from 'fs';
import path from 'path';

const dir = 'src/routes/admin';
const files = ['deliveries.tsx', 'employees.tsx', 'logs.tsx', 'payments.tsx', 'production.tsx', 'security.tsx', 'users.tsx'];

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Remove import
  content = content.replace(/import \{ DashboardSidebar \} from "@\/components\/DashboardSidebar";\r?\n/, '');

  // Replace wrapper start
  content = content.replace(
    /return \(\s*<div className="flex min-h-screen bg-background">\s*<DashboardSidebar \/>\s*<main className="flex-1 p-6 lg:p-8 overflow-auto">/,
    'return (\n    <>'
  );

  // Replace wrapper end
  content = content.replace(
    /<\/main>\s*<\/div>\s*\);\s*\}\s*$/,
    '</>\n  );\n}'
  );

  fs.writeFileSync(filePath, content);
  console.log('Fixed', file);
});
