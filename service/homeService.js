const connection = require('../model/connection');
connection.connected()
class HomeService {
    findAll() {
        let sql = `select * from home p join category c on p.idCategory = c.idCategory`;
        let connect = connection.getConnection()
        return new Promise((resolve, reject) => {
            connect.query(sql, (err, home)=> {
                if (err){
                    reject ( err);
                }else {
                    resolve(home) ;
                }
            })
        })
    }

    findByID(id) {
        let connect = connection.getConnection();
        let sql = `select *
                   from home
                            join category c on home.idCategory = c.idCategory
                   where id = ${id}`;
        return new Promise((resolve, reject) => {
            connect.query(sql, (err, list) => {
                if (err) {
                    reject(err)
                } else {
                    console.log('Success');
                    resolve(list);
                }
            })
        })
    }

    findByName(name) {
        let connect = connection.getConnection();
        let sql = `select *
                   from home p
                            join category c on c.idCategory = p.idCategory
                   where name like '%${name}%'`;
        return new Promise((resolve, reject) => {
            connect.query(sql, (err, list) => {
                if (err) {
                    reject(err)
                } else {
                    console.log('Success');
                    resolve(list);
                }
            })
        })
    }

    save(home) {
        let connect = connection.getConnection()
        connect.query(`insert into home (name, city, price, description, idCategory)
                       values ('${home.name}', '${home.city}', ${home.price}, '${home.description}',
                               ${home.idCategory})`, (err) => {
            if (err) {
                console.log(err);
            }
        })
    }

    edit(home, category, id) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`update home
                               join category
                           on home.idCategory = category.idCategory
                               set home.name = '${home.name}', home.city = '${home.city}', home.price = ${home.price}, home.description ='${home.description}', home.idCategory = ${category}
                           where id = ${id}`, (err, home) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Success');
                    resolve(home);
                }
            })
        })
    }
}
module.exports = new HomeService();
