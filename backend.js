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
		score_c1: Number,
		score_c2: Number,
		score_c3: Number,
		score_c4: Number,
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
							res.redirect("/feed");
						}
					}
					if(flag===false)
					{
						console.log("USER NOT FOUND");
						res.render("login.ejs");
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
					poopoo : posts,
					"bootstrap" : "/bootstrap.css",
				});
			}
		});
	});

app.post("/feed/:vote",function(req,res){
	console.log(req.params.vote);
	console.log(req.body.contender); //THIS IS THE VOTE TO THE CONTENDER
	let query = {};
	let ccc ;
	if(req.body.contender==="contender1")
	{
		ccc="score_c1"
	}	
	if(req.body.contender==="contender2")
	{
		ccc="score_c2"
	}	
	if(req.body.contender==="contender3")
	{
		ccc="score_c3"
	}	
	if(req.body.contender==="contender4")
	{
		ccc="score_c4"
	}	
	query[ccc] = 1 ;
	console.log(query);
	poll_post.findOneAndUpdate({title : req.params.vote},{ $inc : query },function(err,updated_post)
		{
			if(err)
			{
				console.log(err);
				console.log("THE VOTE HAS NOT BEEN UPDATED");
			}
			else
			{
				console.log(updated_post.score_c1);
				console.log("THE VOTE HAS BEEN CASTED");
				poll_post.find({title : req.params.vote},function(err,fetched_post)				{
					if(err)
					{
						console.log(err);
						console.log("THIS MEANS THAT WHILE SHOWING STATS THE DATA WAS NOT FETCHED");
					}
					else
					{
						console.log(fetched_post);
						console.log("THIS MEANS THAT WHILE SHWOING STATS THE DATA WAS FETCHED");
						res.render("post_stats.ejs",{
							yumyum : fetched_post,
							"bootstrap" : "/bootstrap.css",
						});
					}
				});
			}
		});
});


app.post("/newuser",function(req,res){
	// console.log(newuserdetail);
	// console.log(req.body);
	user.create({username : req.body.userName,password : req.body.password,},function(err,yolo){
		if(err)
		{
			console.log("DATA IS NOT PUSHED");
		}
		else
		{
			console.log("DATA HAS BEEN PUSHED");
			console.log(yolo);
			res.redirect("/");
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
	poll_post.create({title : req.body.title,motive : req.body.motive,contender1: req.body.contender1,contender2: req.body.contender2,contender3: req.body.contender3,contender4: req.body.contender4,score_c1: 0 , score_c2 : 0 , score_c3 : 0 , score_c4 : 0},function(err,mypost){
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


app.get("*",function(req,res)
{
	res.send("THIS IS THE LAST PAGE IF NONE GET CAUGHT");
});
app.listen( process.env.PORT || 3000 , function(){
	console.log("SERVER 3000 HAS STARTED");
});
