const { text } = require('express');
const fs = require('fs');
const http = require('http');
const port = 8000;
const path = require('path');
const server = http.createServer();

server.on('request', (req, res) => {
    // console.log(req);
    if(req.url === '/'){
        res.statusCode = 200;
        res.setHeader = ('Content-Type', 'text/plain');
        res.write(`
        <html>
                <head>
                    <title>Send a message</title>
                </head>
                <body>
                    <h1>Hello Node!</h1>
                    <a href=/read-message>/read-message</a>
                    <a href=/write-message>/write-message</a>
                </body>
            </html>
        `);
        res.end();
    }

    // const filePath = path.join(__filename, 'message.txt', req.url === '/' ? 'index.html' : req.url);
    // const extName = path.extname(filePath);

    // fs.readFile(filePath, (err, content) => {
    //     res.writeHead(200, {'Content-Type': 'text/html'})
    //     res.end(content, 'utf-8')
    // })

    if(req.url === '/write-message' && req.method === 'GET'){
        res.write(`
            <html>
                <head>
                    <title>Send a message</title>
                </head>
                <body>
                    <form action='/write-message' method='POST'>
                        <input type='text' name='message' placeholder='Enter your message'>
                        <button type='submit'>Submit</button>
                    </form>
                </body>
            </html>
        `)
    }
    if(req.url === '/write-message' && req.method === 'POST'){
        const body = [];
        req.on('data', (chunk)=>{
            body.push(chunk);
        })
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            console.log(message);
            fs.writeFile('message.txt', message, (err)=>{
                if(err) throw err;
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            })
        })
    }

    if(req.url === '/read-message'){
        res.statusCode = 200;
        res.setHeader = ('Content-Type', 'text/plain');
        // fs.readFile(path.join(__filename, 'message.txt'))
        res.end(`<h1>${path.join(__filename, 'message.txt')}</h1>`);
    }

}).listen(8000, () => console.log(`Listening on port ${port}`));

// Respond to requests from “/read-message” by sending some html that displays the content of your text file.
