const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');
let changed = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Standardize borders
    content = content.replace(/rounded-lg/g, 'rounded-xl');

    // Standardize shadows on boxes that already have shadow (downgrade harsh shadows, upgrade missing ones if border-zinc-800 is there)
    content = content.replace(/shadow-md/g, 'shadow-sm');
    content = content.replace(/shadow-2xl/g, 'shadow-sm');
    content = content.replace(/shadow-lg/g, 'shadow-sm');

    // Table rows hover states: <tr className="border-b border-zinc-800"> into <tr ... hover:bg-zinc-800/40 transition-colors>
    content = content.replace(/<tr\s+className=\"([^\"]*)\"/g, function (match, classes) {
        if (classes.indexOf('hover:bg-zinc-800/40') === -1) {
            return '<tr className="' + classes + ' hover:bg-zinc-800/40 transition-colors"';
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changed++;
    }
}
console.log('Swept and upgraded ' + changed + ' TSX files for border-radius and shadows.');
