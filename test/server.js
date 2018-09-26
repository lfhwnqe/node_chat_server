const http = require('http')
const fs = require('fs')

http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile('./test/titles.json', (err, data) => {
            if (err) {
                console.log(err)
                res.end('error')
            } else {
                const titles = JSON.parse(data.toString())
                fs.readFile('./test/template.html', (err, data) => {
                    if (err) {
                        console.log(err)
                        res.end('error')
                    } else {
                        const tmpl = data.toString()
                        const html = tmpl.replace('%', titles.join(`<li></li>`))
                        res.writeHead(200, {
                            'Content-Type': 'text/html'
                        })
                        res.end(html)
                    }
                })
            }

        })
    }
}).listen(3000)

req.on('data', id, () => {
    // callback
})

req.off('data', id)
