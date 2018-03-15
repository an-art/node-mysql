const http = require('http');
const fs = require('fs');
const searchInDB = require('./src/search');

    http.createServer(function(req, res) {
        let result;

        if (req.url == '/') {
            sendFile('index.html', res);
        } else if (req.url == '/sendRequest') {           
            let search = '';
            req
                .on('readable', function() {
                    search += req.read();
                    if (search.length > 100) {
                        res.statusCode = 413;
                        res.end("You entered too long name");
                    }
                })
                .on('end', function() {
                    try {
                        search = JSON.parse(search.slice(0, -4));
                    } catch (e) {
                        res.statusCode = 400;
                        res.end("Bad Request");
                        return;
                    }
                    result = searchInDB(search.firstName);    
                    res.end(JSON.stringify({done: result}));
                });
        } else {
            res.statusCode = 404;
            res.end("Not Found");
        }
    }).listen(3000);
    console.log('Server is running on port 3000');



function sendFile(fileName, res) {
    var fileStream = fs.createReadStream(fileName);
    fileStream
        .on('error', function() {
            res.statusCode = 500;
            res.end("Server error");
        })
        .pipe(res)
        .on('close', function() {
            fileStream.destroy();
        });
}