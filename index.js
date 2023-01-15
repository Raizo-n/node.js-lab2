const fs = require("fs");
const http = require("http");
const port = 8000;
const server = http.createServer();

server
  .on("request", (req, res) => {
    // console.log(req);
    if (req.url === "/") {
      res.statusCode = 200;
      res.setHeader = ("Content-Type", "text/plain");
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

    if (req.url === "/write-message" && req.method === "GET") {
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
        `);
    }
    if (req.url === "/write-message" && req.method === "POST") {
      const body = [];
      req.on("data", (chunk) => {
        body.push(chunk);
      });
      req.on("end", () => {
        const parsedBody = Buffer.concat(body).toString();
        const message = parsedBody.split("=")[1];
        console.log(message);
        fs.writeFile("message.txt", message, (err) => {
          if (err) throw err;
          res.statusCode = 302;
          res.setHeader("Location", "/");
          return res.end();
        });
      });
    }

    if (req.url === "/read-message") {
      res.statusCode = 200;
      res.setHeader = ("Content-Type", "text/plain");

      fs.readFile("./message.txt", "utf-8", (err, text) => {
        if (err) throw err;
        res.end(`<h1>${text}</h1>`);
      });
    }
  }).listen(8000, () => console.log(`Listening on port ${port}`));
