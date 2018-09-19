const http = require('http')
const fs = require('fs')

http.createServer((req, res) => {
    let body = []
    const data = fs.createWriteStream('hello.text')
    req.pipe(data)
    console.log(data)
    // fs.writeFileSync('hello.txt', data)
    res.end(1)
    // res.end(`method==>>${method} url===>>${url}`)
}).listen(3000)




// const http = require('http');

// http.createServer((request, response) => {
//   request.on('error', (err) => {
//     console.error(err);
//     response.statusCode = 400;
//     response.end();
//   });
//   response.on('error', (err) => {
//     console.error(err);
//   });
//   if (request.method === 'POST' && request.url === '/echo') {
//     request.pipe(response);
//   } else {
//     response.statusCode = 404;
//     response.end();
//   }
// }).listen(3000);