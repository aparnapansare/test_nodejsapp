var http = require("http");
var express = require("express");
var app=express();
const bodyParser = require("body-parser");
var path = require('path')
var dateTime = require('node-datetime')
const pug = require('pug');
var request = require('request');

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "aparna",
  password: "AP123456!",
  database: "pf1"
});


app.set('views', __dirname + '/views'); // general config
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//basic routes
app.get("/",function(req,res){
  //res.send("message from GET");
  res.sendFile(__dirname + "/index.html");
});


app.get('/getList', function(req, res) {
        //response.expires=-1
        //sql="SELECT * FROM CUSTOMERS WHERE CUSTOMERID="
        //sql=sql & "'" & request.querystring("q") & "'"

        console.log("insite getList");
                con.query('SELECT distinct(sharename) FROM mytransaction order by sharename', function(err, rows, fields) {
                if (err) {
                        res.status(500).json({"status_code": 500,"status_message": "internal server error"});
                } else {

                    console.log("got the data !");
                    var optionlist="";
                    res.write("<label for='email'>Bonus Stock</label>")

                    res.write("<select class='input' id='bonusStock' name='bonusStock'>")

                    for (var i = 0; i < rows.length; i++) {

                         optionlist = optionlist+"<option value='"+rows[i].sharename+"'>"+rows[i].sharename+"</option>"

                    }
                    optionlist = optionlist + "</select>"
                    res.write(optionlist)
                    //res.write("</select>")
                }

        });
});



app.get("/portfolioform",function(req,res){
  res.sendFile(__dirname + "/portfolioform.html");
});


app.get("/selectuser",function(req,resp){
  console.log("Select a user")
  
  resp.sendFile(__dirname + "/selectuser.html");
});


app.post("/portfolioform",function(req,res){
  console.log("Entered post!!");
  console.log(req.body.user);
  console.log(req.body.stockname);
  console.log(req.body.numshares);
  console.log(req.body.trxn);
  console.log(req.body.price);
  console.log(req.body.trxndate);
  //var dt = dateTime.create();
  var dt = req.body.trxndate;
  //dt = '2010-08-16 10:00:23';
  //var formatted = dt.format('Y-m-d');
	  //console.log(formatted);
  qty=req.body.numshares;
  if (req.body.trxn === "SELL")
  {
        console.log("Selling!");
        qty =qty*-1;
        console.log(qty);
  }
  if (req.body.trxn === "BONUS")
  {
        stockname = req.body.bonusStock;
        console.log("Bonus share transaction",stockname);
        console.log("Quantity=",req.body.numshares);
  }
  else 
        stockname =  req.body.stockname;

  var sqlquery = "insert into  mytransaction ( accid , sharename , shareqty , trxnname , price,trxndate,currentprice,markdeleted ) values ("+ req.body.user + ",'" + stockname+"',"+qty+",'"+req.body.trxn+"',"+req.body.price+", '"+dt + "', "+req.body.currentprice+",0)";
  console.log(sqlquery);

  con.query(sqlquery,  function (err2, result) {

  if (err2) throw err2;
    console.log("Data inserted ");
    res.send('Saved data for "' + req.body.stockname + '".');
  });

});



con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  http.createServer(app).listen(8080);
});


var config = {
    server: 'localhost',
    database: 'Company',
    user: 'sa',
    password: 'sa',
    port: 1433
};
