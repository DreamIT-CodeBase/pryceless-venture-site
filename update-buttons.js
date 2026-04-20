const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'app/admin/properties/page.tsx',
  'app/admin/loan-programs/page.tsx',
  'app/admin/investments/page.tsx',
  'app/admin/case-studies/page.tsx',
  'app/admin/blogs/page.tsx',
  'components/admin/singleton-page-form.tsx',
  'components/admin/property-form.tsx',
  'components/admin/loan-program-form.tsx',
  'components/admin/investment-form.tsx',
  'components/admin/home-page-form.tsx',
  'components/admin/form-definition-form.tsx',
  'components/admin/case-study-form.tsx',
  'components/admin/calculator-form.tsx',
  'components/admin/blog-post-form.tsx'
];

for (const file of filesToUpdate) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add import if not present
    if (!content.includes('SubmitButton')) {
      // Find the last import statement
      const importMatches = [...content.matchAll(/^import.*from.*;$/gm)];
      if (importMatches.length > 0) {
        const lastImport = importMatches[importMatches.length - 1];
        const index = lastImport.index + lastImport[0].length;
        content = content.slice(0, index) + '\nimport { SubmitButton } from "@/components/admin/submit-button";' + content.slice(index);
      } else {
        content = 'import { SubmitButton } from "@/components/admin/submit-button";\n' + content;
      }
    }

    // Replace button tags with SubmitButton, parsing type="submit"
    // Only replace buttons that have type="submit"
    
    content = content.replace(/<button([^>]*?)type=\"submit\"([^>]*?)>([\s\S]*?)<\/button>/g, '<SubmitButton$1$2>$3</SubmitButton>');
    content = content.replace(/<button([^>]*?)type={'submit'}([^>]*?)>([\s\S]*?)<\/button>/g, '<SubmitButton$1$2>$3</SubmitButton>');
    
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + file);
  }
}
