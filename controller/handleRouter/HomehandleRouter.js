const fs = require('fs');
const HomeService = require('../../service/homeService');
const categoryService = require('../../service/categoryService');
const qs = require('qs')

class HomeHandleRouter {


    static getHomeHtml(homes, homeHtml) {
        let tbody = '';
        homes.map((home, index) => {
            tbody += `
                <tr style="margin: auto">
                    <td>${index + 1}</td>
                    <td>${home.name}</td>
                    <td>${home.city}</td>
                    <td>${home.price}</td>
                    <td>${home.description}</td>
                    <td>${home.nameCategory}</td>
                    <td><a href="/edit/${home.id}"><button class="btn btn-outline-success">Sửa</button></a></td>
                    
                </tr>`
        })
        homeHtml = homeHtml.replace('{list}', tbody);
        return homeHtml;
    }


    showHome(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/home.html', 'utf-8', async (err, homeHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    let a = await HomeService.findAll();
                    homeHtml = HomeHandleRouter.getHomeHtml(a, homeHtml)
                    res.writeHead(200, 'text/html');
                    res.write(homeHtml);
                    res.end();
                }
            })
        } else {                          // Search bằng tên gần đúng
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err)
                } else {
                    let search = qs.parse(data);
                    fs.readFile('./views/home.html', "utf-8", async (err, indexHtml) => {
                        if (err) {
                            console.log(err)
                        } else {
                            let list = await HomeService.findByName(search.search);
                            console.log(list)
                            indexHtml = HomeHandleRouter.getHomeHtml(list, indexHtml)
                            res.writeHead(200, {'location': '/home'});
                            res.write(indexHtml);
                            res.end();
                        }
                    })

                }
            })
        }
    }

    createHome(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/create.html', 'utf-8', async (err, createHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    res.writeHead(200, 'text/html');
                    let categories = await categoryService.findAll();
                    let options = '';
                    categories.map(category => {
                        options += `
                                   <option value='${category.idCategory}'>${category.nameCategory}</option>
                                   `
                    })
                    createHtml = createHtml.replace('{categories}', options);
                    res.write(createHtml);
                    res.end();
                }
            })
        } else {
            let data = ''
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', err => {
                if (err) {
                    console.log(err)
                } else {
                    const home = qs.parse(data);
                    HomeService.save(home);
                    res.writeHead(301, {'location': '/home'});
                    res.end();
                }
            })
        }
    }


    async editHome(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/edit.html', 'utf-8', async (err, editHtml) => {
                if (err) {
                    console.log(err.message)
                } else {
                    let home = await HomeService.findByID(id);
                    let categories = await categoryService.findAll()
                    let options = '';
                    categories.map(category => {
                        options += `
                                   <option value='${category.idCategory}'>${category.nameCategory}</option>
                                   `
                    })
                    editHtml = editHtml.replace('{categories}', options);
                    editHtml = editHtml.replace('{name}', home[0].name);
                    editHtml = editHtml.replace('{city}', home[0].city);
                    editHtml = editHtml.replace('{price}', home[0].price);
                    editHtml = editHtml.replace('{description}', home[0].description);
                    editHtml = editHtml.replace('{nameCategory}', home[0].nameCategory);
                    editHtml = editHtml.replace('{id}', id)
                    res.writeHead(200, 'text/html');
                    res.write(editHtml);
                    res.end();
                }
            })
        } else {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err)
                } else {
                    const home = qs.parse(data);
                    const category = home.idCategory
                    await HomeService.edit(home,category, id);
                    res.writeHead(301, {'location': '/home'});
                    res.end();
                }
            })
        }
    }
}

module.exports = new HomeHandleRouter();