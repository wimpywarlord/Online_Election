var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://wimpywarlord:wimpycool123@online-election-udrqr.mongodb.net/test?retryWrites=true&w=majority",{dbName : 'viit_online_election'},function(err,res)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			console.log("CONNECTED");
		}
	});

var userSchema = new mongoose.Schema(
	{
		username : String,
		password : String,
		email: String,
	});

var pollSchema = new mongoose.Schema({
		title : String,
		motive : String,
		contender1: String,
		contender2: String,
		contender3: String,
		contender4: String,
});

var user = mongoose.model("user",userSchema);
var poll_post = mongoose.model("post",pollSchema);

app.get("/",function(req,res)
	{
		res.render("login.ejs");
	}
	);
app.post("/login",function(req,res)
	{
		user.find(function(err,users)
			{
				if(err)
				{
					console.log("users not fetched");
					console.log(err);
				}
				else
				{	
					console.log("THE USERS IN THE DB ARE :");
					console.log(req.body);
					console.log(users);
					var flag =  false ; 
					for(x in users)
					{
						console.log(users[x].username);
						console.log(users[x].password);
						if(req.body.username===users[x].username && req.body.password===users[x].password)
						{
							flag=true;
							console.log("FOUND REG USER.");
							res.redirect("feed");
						}
					}
					if(flag===false)
					{
						console.log("USER NOT FOUND");
					}
				}
			});
	});

app.get("/signup",function(req,res)
	{
		res.render("signup.ejs",{
			"backgroundImg" : "/yolo.jpg"
			// somthing : "value",
			// PUT MULTIPLE PEICES OF DATA TO PASS TO PAGE SIGNUP
			// GOES HERE
		});
	});
app.get("/feed",function(req,res){

		poll_post.find({},function(err,posts){
			if(err)
			{
				console.log("POSTS NOT FETCHED");
			}
			else
			{
				console.log("POSTS ARE FETCHED");
				console.log(posts);
				res.render("feed.ejs",{
					"posts" : posts,
					"bootstrap" : "/bootstrap.css",
				});
			}
		});
	});
app.post("/newuser",function(req,res){
	// console.log(newuserdetail);
	res.send("sadasdasda");;
	// console.log(req.body);
	user.create({username : req.body.userName,password : req.body.password,},function(err,res){
		if(err)
		{
			console.log("DATA IS NOT PUSHED");
		}
		else
		{
			console.log("DATA HAS BEEN PUSHED");
			console.log(res);
		}
	});
});
app.get("/host",function(req,res)
	{
		res.render("host.ejs",{
			bg : "/bg.jpg"
		});
	});
app.post("/newpost",function(req,res){
	console.log(req.body);
	poll_post.create({title : req.body.title,motive : req.body.motive,contender1: req.body.contender1,contender2: req.body.contender2,contender3: req.body.contender3,contender4: req.body.contender4,},function(err,mypost){
		if(err)
		{
			console.log("POST NOT PUSHED");
			console.log(err);
		}
		else
		{
			console.log("POST PUSHED TO DB");
			console.log(mypost);
			res.redirect("feed");
		}
	});
});
app.listen(3000,function()
	{
		console.log("PORT HAS STARTED.");
	});


