var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({extended : true}));
express.static("public");

app.get("/",function(req,res)
	{
		res.send("HI THERE");
	}
	);
app.get("/signup",function(req,res)
	{
		res.render("signup.ejs",{
			"backgroundImg" : "/yolo.jpg"
			// somthing : "value",
			// PUT MULTIPLE PEICES OF DATA TO PASS TO PAGE SIGNUP
			// GOES HERE
		});
	});
app.post("/newuser",function(req,res){
	console.log(req.body);
	res.send("sadasdasda");
});
app.get("/feed",function(req,res){
		res.render("feed.ejs");
	});
app.get("/feed/:post",function(req,res)
	{

	});
app.get("/profile",function(req,res)
	{
		res.send("asdaskd asd");
	});
app.listen(3000,function()
	{
		console.log("PORT HAS STARTED.");
	});