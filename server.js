const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const chatServer = require('./lib/chat_server');

const cache = {};

const send404 = res => {
  res.writeHead(404, {
    'Content-Type': 'text/plain'
  });
  // res.write('Error 404: resourse not found')
  res.end('Error 404: resourse not found');
};

const sendFile = (res, filePath, fileContents) => {
  res.writeHead(200, {
    'content-type': mime.getType(path.basename(filePath))
  });
  res.end(fileContents);
};

const serveStatic = (res, cache, absPath) => {
  if (cache[absPath]) {
    sendFile(res, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, exists => {
      if (exists) {
        fs.readFile(absPath, (err, data) => {
          if (err) {
            send404(res);
          } else {
            cache[absPath] = data;
            sendFile(res, absPath, data);
          }
        });
      } else {
        send404(res);
      }
    });
  }
};

const server = http.createServer((req, res) => {
  let filePath = false;
  if (req.url === '/') {
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + req.url;
  }
  const absPath = './' + filePath;
  serveStatic(res, cache, absPath);
});

server.listen(3000, () => {
  console.log('server is listening on port 3000');
});

chatServer.listen(server);
