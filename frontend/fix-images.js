const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.tsx') || dirFile.endsWith('.jsx')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync('./src');
let count = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/<Image([^>]*?)\bfill\b([^>]*?)>/g, (match, p1, p2) => {
    if (match.includes('sizes=')) return match;
    return `<Image${p1}fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"${p2}>`;
  });
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
    count++;
  }
});
console.log(`Updated ${count} files.`);
