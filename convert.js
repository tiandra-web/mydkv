const xlsx = require('xlsx');
const fs = require('fs');

// Baca file Excel
const workbook = xlsx.readFile('data_nilai.xlsx');
const sheetName = workbook.SheetNames[0];
const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Tulis ke file JSON
fs.writeFileSync('data_nilai.json', JSON.stringify(jsonData, null, 2));
console.log('Data Excel telah dikonversi menjadi JSON!');
