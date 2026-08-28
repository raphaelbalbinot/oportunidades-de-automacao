import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve('docs/Guia_Engenharia_Financeira_ROI_FCAIA.html');
const pdfPath = path.resolve('docs/Guia_Engenharia_Financeira_ROI_FCAIA.pdf');

const chromeCandidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

let browserPath = chromeCandidates.find((p) => fs.existsSync(p));

if (!browserPath) {
  console.error('Nenhum executável de navegador encontrado para gerar o PDF.');
  process.exit(1);
}

console.log(`Utilizando navegador: ${browserPath}`);
console.log(`Convertendo: ${htmlPath}`);
console.log(`Destino: ${pdfPath}`);

const cmd = `"${browserPath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${htmlPath}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  if (fs.existsSync(pdfPath)) {
    const stats = fs.statSync(pdfPath);
    console.log(`✅ PDF gerado com sucesso! Tamanho: ${stats.size} bytes.`);
  } else {
    console.error('❌ Falha: Arquivo PDF não foi gerado.');
  }
} catch (err) {
  console.error('Erro ao executar conversão:', err);
  process.exit(1);
}
