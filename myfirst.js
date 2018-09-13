var http = require('http');
var dt = require('./myfirstdate');
/*var db = require('./myfirstdb');*/

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('Enter name : <input type="text" name="co"><br>');
    res.write('Enter number: <input type="text" name="number"><br>');
    res.write('Enter price : <input type="text" name="price"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
}).listen(8080); 

