const sql = require('mssql');

const config = {
    user: 'sa',            // hoặc user bạn mới tạo
    password: '123456',    // mật khẩu vừa đặt cho tài khoản sa hoặc user mới
    server: 'KENWAY\\KENWAY',
    database: 'QLKhamBenh',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ Kết nối thành công với SQL Server bằng SQL Server Authentication!');
        return pool;
    })
    .catch(err => {
        console.error('❌ Không thể kết nối SQL Server:', err);
        process.exit(1);
    });

module.exports = { sql, poolPromise };
