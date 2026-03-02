const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',           // default XAMPP password is empty
    database: 'scholarseek_db',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        return;
    }
    console.log('✅ Connected to MySQL (scholarseek_db)');
});

module.exports = db;