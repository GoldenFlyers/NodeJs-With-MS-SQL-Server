var express = require("express");
const sql = require('mssql')
var bodyParser = require("body-parser");

console.log('hello start');
var app = express();
app.use(bodyParser.json()); 



const config = {
    user: 'sa',
    password: 'sa123',
    server: 'RONY-PC', // You can use 'localhost\\instance' to connect to named instance
    database: 'testDB',
 }

 //CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});
 
 //Function to connect to database and execute query
var  executeQuery = function(res, query){ 
              
    sql.connect(config, function (err) {
        if (err) {   
                    console.log("Error while connecting database :- " + err);
                    res.send(err);
                 }
                 else {
                        // create Request object
                        var request = new sql.Request();
                        // query to the database
                        request.query(query, function (err, data) {
                          if (err) {
                                     console.log("Error while querying database :- " + err);
                                     res.send(err);
                                     sql.close();
                                    }
                                    else {
                                      res.send(data);
                                      sql.close();
                                           }
                              });
                      }
     });           
}

//GET API
app.get("/api/user", function(req , res){
               var query = "select * from emp";
               executeQuery (res, query);
});
 
sql.on('error', err => {
    console.dir(err)
})


//POST API
app.post("/api/user", function(req , res){
    console.log(req.body.Age);
   // var query = "INSERT INTO [user] (Name,Email,Password) VALUES (req.body.Name,req.body.Email,req.body.Password");
   var query = "INSERT INTO emp (Name,Age,Nationality) VALUES ('"+req.body.Name+"','"+req.body.Age+"','"+req.body.Nationality+"')";

   executeQuery (res, query);
});

//PUT API
app.put("/api/user/:id", function(req , res){
    
    var query = "UPDATE emp SET Name= '" + req.body.Name  +  "' , Age=  '" + req.body.Age + "', Nationality=  '" + req.body.Nationality + "'  WHERE Id= " + req.params.id;
    console.log(query);
    executeQuery (res, query);
});

// DELETE API
app.delete("/api/user/:id", function(req , res){
    var query = "DELETE FROM emp WHERE Id=" + req.params.id;
    executeQuery (res, query);
});

// get Single user API
app.get("/api/user/:id", function(req , res){
    var query = "select * FROM emp WHERE Id=" + req.params.id;
    executeQuery (res, query);
});
//Setting up server
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
 });