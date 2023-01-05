const connection = require('../model/connection');
connection.connected()
class CategoryService {
    findAll() {
        let sql = 'select * from category';
        let connect = connection.getConnection()
        return new Promise((resolve, reject) => {
            connect.query(sql, (err, categories) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(categories);
                }
            })
        })
    }
}

module.exports = new CategoryService();