import findImports from 'find-imports';
import fs from 'fs';

const analyzeSourceCode = (filePath) => {
    const sourceCode = fs.readFileSync(filePath, 'utf8');
    console.log(filePath);
    const imports = findImports([filePath], { flatten: true, packageImports: true });
    console.log(imports);
    const packages = imports.map(pkg => ({ name: pkg, version: 'latest' })); // Default to 'latest' version
    return packages;
};

// Example usage
const packages = analyzeSourceCode('/Users/utkarshshukla/ArrowAgents/cloudflareworker/inputs/234342345/input.js');
console.log(packages);
