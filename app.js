const express = require('express');
const xlsx = require('xlsx'); // Import modul xlsx untuk membaca file Excel
const app = express();
const port = 3005;

// Set public folder untuk file CSS dan statis lainnya
app.use(express.static('public'));

// Set view engine ke EJS
app.set('view engine', 'ejs');

// Parsing form input
app.use(express.urlencoded({ extended: true }));

function readExcelData() {
    const workbook = xlsx.readFile('./data/data_nilai.xlsx'); // Baca file Excel
    const data = [];

    // Loop melalui semua sheet di workbook
    workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const sheetData = xlsx.utils.sheet_to_json(worksheet, { header: 1 }); // Konversi sheet menjadi array objek
        data.push(...sheetData); // Gabungkan data dari setiap sheet ke dalam array data
    });

    return data;
}

// Rute untuk halaman utama (form input NISN)
app.get('/', (req, res) => {
    res.render('index');
});

// Rute untuk menampilkan nilai siswa berdasarkan NISN
app.post('/nilai', (req, res) => {
    const nisn = req.body.nisn;
    const dataSiswa = readExcelData(); // Fungsi membaca file Excel
    console.log(dataSiswa); // Lihat seluruh data Excel yang terbaca

    const siswa = dataSiswa.find(row => row[0] && row[0].toString() === nisn);
    
    if (siswa) {
        console.log(siswa); // Lihat data siswa yang ditemukan
        
        const siswaData = {
            NISN: siswa[0],
            Nama: siswa[1],
            Kelas: siswa[2],
            DasarDKV: siswa[3] !== undefined && !isNaN(siswa[3]) ? Math.floor(siswa[3]) : '-', // Membulatkan ke bawah
            Kedisiplinan: siswa[4] !== undefined && siswa[4] !== null ? siswa[4] : '-',
            NilaiPTS: siswa[5] !== undefined && !isNaN(siswa[5]) ? Math.floor(siswa[5]) : '-', // Membulatkan ke bawah
            NilaiUAS: siswa[6] !== undefined && !isNaN(siswa[6]) ? Math.floor(siswa[6]) : '-', // Membulatkan ke bawah
            NilaiAkhir: siswa[7] !== undefined && !isNaN(siswa[7]) ? Math.floor(siswa[7]) : '-' // Membulatkan ke bawah
        };
        console.log(siswaData); // Lihat data siswa yang akan dikirim ke EJS
        res.render('nilai', { siswa: siswaData });
    } else {
        res.render('notfound');
    }
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
