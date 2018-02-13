var express=require('express');
var app=express();
//const parseJson = require('parse-json');
var cors=require('cors');
var morgan=require('morgan');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('dev'));
global.f=0;
global.g=0;

app.use(cors());
app.use(bodyParser.json());
//app.use(express.static('public'))//angularjs file accesing by the node


//connecting node with database
const pg=require('pg')
const client = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'project',
  password: '1234',
  port: 5432,
})

//to check the conncn is suucessful or not
client.connect(function function_name(err)
{
	if(err) console.log(err)
    else{console.log("database connection successful!");}		
})



//sidebar name display
app.get('/listofnames',function(req,res)
{
	console.log("list called")
    var ver_token=req.headers.authorization;
    console.log(ver_token);

	jwt.verify(ver_token, 'rawdata', function(err, decoded) 
	{
		if(err)
		{
			console.log(err);
			//res.send("token verification failed");
			res.json({"message":"token expired"});
	     		//p=req.body.u_id;
	     		//check_name=req.body.u_name;
	     		
		}
		else
		{
			
				console.log("id matches");
				client.query('SELECT u_id,name FROM users order by name',function func(err,call)
				{
					if(err)
					{
						console.log(err)
					}
					else
					{
						res.send(call.rows);
					}
					
					
							
	            }) 	  
		   

		}
	})	
 // console.log(decoded.foo) 
	
})
app.get('/listofgroups',function(req,res)
{
	console.log("group list called")
    var ver_token=req.headers.authorization;
    console.log(ver_token);

	jwt.verify(ver_token, 'rawdata', function(err, decoded) 
	{
		if(err)
		{
			console.log(err);
			//res.send("token verification failed");
			res.json({"message":"token expired"});
	     		//p=req.body.u_id;
	     		//check_name=req.body.u_name;
	     		
		}
		else
		{
			
				console.log("id matches");
				client.query('SELECT g_id,grp_name FROM groups order by grp_name',function func(err,call)
				{
					if(err)
					{
						console.log(err)
					}
					else
					{
						res.send(call.rows);
					}
					
					
							
	            }) 	  
		   

		}
	})	
 // console.log(decoded.foo) 
	
})


//registration
app.post('/registration',function(req,res){

	if(!req.body.name || !req.body.username || !req.body.password || !req.body.email)
	{
		res.send("parameters not provided");
	}
	else
	{


	var assign_name=req.body.name;
	var assign_uname=req.body.username;
	var assign_email=req.body.email;
	                  var pwd1=req.body.password;
	                  var hashedPwd = md5(pwd1);//pwd is hashed


	var  text='INSERT INTO users(name,user_name,user_pwd,e_mail) VALUES($1,$2,$3,$4) RETURNING *'
	var values=[assign_name,assign_uname,hashedPwd,assign_email];
	client.query(text,values,function fun1(err,re){
		if(err) console.log(err)
			else{
				 console.log(re)
				 res.send("Registered successfully!")
			}
	})
    } 
})
app.post('/login',function(req,res)
{ console.log(req);
	if(!req.body.name || !req.body.password)
    {
    	res.send("authentication failed,no parameters");
    }
	else
    { 
    	console.log("logged in");
    	var check_name=req.body.name;
        var pwd2=req.body.password;
	    var hashedPwd1 = md5(pwd2);//pwd is hashed
        var  text='SELECT u_id FROM users WHERE user_name=$1 AND user_pwd=$2'
		var values=[check_name,hashedPwd1];

		client.query(text,values,function fun1(err,results)
		{
			
			
			if(err)
			{
				console.log(err);
			}
			else
			{
				if(results.rowCount>0)
			 	{
			 		var p=results.rows[0].u_id;
			 		//console.log(results.rows.u_id);
					var token = jwt.sign({ u_id:p,u_name:check_name},'rawdata',{ expiresIn: 86400});//token gen for each login
					var obj={"success":true,"token":token,"id":p}
					var myJSON = JSON.stringify(obj);
					res.send(myJSON);
				}
				else
				{
            		var obj={"success":false,"message":"user_name and password does not match"}
					var myJSON = JSON.stringify(obj);
					res.send(myJSON);
				}
			}	
		})
    }
    
   
})
	
    
	
	


app.post('/emotions',function(req,res){

	var data=new Date();
	console.log(data);
	var from1=req.body.from;
	var to1=req.body.to;
	var descr1=req.body.desc;
	var emot1=req.body.emotion;
	console.log("emotions called")
    var ver_token=req.headers.authorization;
   
	

	jwt.verify(ver_token, 'rawdata', function(err, decoded) 
	{
		if(err)
		{
			console.log(err)
			res.json({"message":"token expired"});
	     		//p=req.body.u_id;
	     		//check_name=req.body.u_name;
	     		
		}
		else
		{
				console.log("id matches");
				var  text='INSERT INTO emotions(fr_om,t_o,descr,date_now,emotion) VALUES($1,$2,$3,$4,$5) RETURNING *'
				var values=[from1,to1,descr1,data,emot1]
				client.query(text,values,function fun1(err,re)
				{
				if(err)
				{
					console.log(err);

				}
			    else
			    {
			    	console.log(re)
				 	res.send("success")
				}
				})
		}
			
		
	})	
	
})



app.get('/displaythanku',function(req,res)
{
	console.log("display called")
    var ver_token=req.headers.authorization;

	jwt.verify(ver_token, 'rawdata', function(err, decoded) 
	{
		if(err)
		{
			console.log(err);
			res.json({"message":"token expired"});
	     		//p=req.body.u_id;
	     		//check_name=req.body.u_name;
	     		/*p=7;
	     		check_name='har1';
				var token = jwt.sign({ u_id:p,u_name:check_name},'rawdata',{ expiresIn: 900});//token gen for each login
				res.send(token);*/
		}
		else
		{
			
				console.log("thanks display");
				console.log(decoded);
				//var p=decoded.u_id;
				var p=decoded.u_id;
				var a='thanku'
				text='SELECT users.name,emotions.descr,emotions.emotion,emotions.date_now FROM users JOIN emotions ON users.u_id=emotions.fr_om WHERE emotions.t_o=$1 AND emotions.emotion=$2'
				values=[p,a]
				client.query(text,values,function func(err,call)
				{
					if(err)
					{
						console.log(err)
					}
					else
					{
						console.log("hello");
						res.json(call);
					}
					
				}) 	  
		    
	    }
	})	
 // console.log(decoded.foo) 
	
})
app.get('/grpthanku',function(req,res)
{
	console.log("group display called")
    var ver_token=req.headers.authorization;
  

	jwt.verify(ver_token, 'rawdata', function(err, decoded) 
	{
		if(err)
		{
			console.log(err);
			res.json({"message":"token expired"});
	     		//p=req.body.u_id;
	     		//check_name=req.body.u_name;
	     		/*p=7;
	     		check_name='har1';
				var token = jwt.sign({ u_id:p,u_name:check_name},'rawdata',{ expiresIn: 900});//token gen for each login
				res.send(token);*/
		}
		else
		{
			
				console.log("thanks display");
				console.log(decoded);
				//var p=decoded.u_id;
				var p=decoded.u_id;
				var a='thanku'
				text='SELECT users.name,emotions.descr,emotions.emotion,emotions.date_now FROM users JOIN emotions ON users.u_id=emotions.fr_om WHERE emotions.t_o=$1 AND emotions.emotion=$2'
				values=[p,a]
				client.query(text,values,function func(err,call)
				{
					if(err)
					{
						console.log(err)
					}
					else
					{
						console.log("hello");
						//res.json(call);
						var obj={"userthanku":call}
						//var myJSON = JSON.stringify(obj);
						text='select users.name,grp_emotions.des,grp_emotions.dat,grp_emotions.emot FROM grp_emotions JOIN chat_grp ON grp_emotions.gr_id=chat_grp.grp_id JOIN users ON grp_emotions.fr=users.u_id where chat_grp.us_id=$1'
						values=[p]
						client.query(text,values,function func(err,ress)
						{
							if(err)
							{
								console.log(err)
							}
							else
							{
								console.log("hello");
								//res.json(call);

								var obj1={"grpthanku":res}
								//var myJSON1 = JSON.stringify(obj);
								var result=obj.merge(obj1);
								console.log(result);
								res.send("success");
								// using jQuery extend
								
							}
					
						}) 	  
					}
					
				}) 	  
		    
	    }
	})	
 // console.log(decoded.foo) 
	
})

app.get('/displaysorry',function(req,res)
{
	console.log("display called")
    var ver_token=req.headers.authorization;

	jwt.verify(ver_token, 'rawdata', function(err, decoded) 
	{
		if(err)
		{
			console.log(err);
			res.json({"message":"token expired"});
	     		//p=req.body.u_id;
	     		//check_name=req.body.u_name;
	     		/*p=7;
	     		check_name='har1';
				var token = jwt.sign({ u_id:p,u_name:check_name},'rawdata',{ expiresIn: 900});//token gen for each login
				res.send(token);*/
		}
		else
		{
			
				console.log("sorry display");
				console.log(decoded);
				//var p=decoded.u_id;
				var p=decoded.u_id;
				var b='sorry'
				text='SELECT users.name,emotions.descr,emotions.emotion,emotions.date_now FROM users JOIN emotions ON users.u_id=emotions.fr_om WHERE emotions.t_o=$1 AND emotions.emotion=$2'
				values=[p,b]
				client.query(text,values,function func(err,call)
				{
					if(err)
					{
						console.log(err)
					}
					else
					{
						console.log("hello");
						res.json(call);
					}
					
				}) 	  
		    
	    }
	})	
 // console.log(decoded.foo) 
	
})


/*{
	
    var ver_token=req.get(Authorization);

	jwt.verify(ver_token, 'rawdata', function(err, decoded) 
	{
		if(err)
		{
			console.log(err);
			//res.send("token verification failed");
			res.json({"message":"token expired"});
	     		//p=req.body.u_id;
	     		//check_name=req.body.u_name;
	     		
		}
		else
		{
			    console.log("count called")
				var p=decoded.u_id;
				var a='thanku'
				var b='sorry'
				
				text='SELECT users.user_name,emotions.descr,emotions.emotion,emotions.date_now FROM users JOIN emotions ON users.u_id=emotions.fr_om WHERE emotions.t_o=$1 AND emotions.emotion=$2'
				values=[p,a]
				client.query(text,values,function func(err,call)
				{
					if(err)
					{
						console.log(err)
					}
					else
					{
						console.log(call.rowCount);
						f=call.rowCount;
						//res.json({result:f});
					}
					
				}) 
				text='SELECT users.user_name,emotions.descr,emotions.emotion,emotions.date_now FROM users JOIN emotions ON users.u_id=emotions.fr_om WHERE emotions.t_o=$1 AND emotions.emotion=$2'
				values=[p,b]
				client.query(text,values,function func(err,calls)
				{
					if(err)
					{
						console.log(err)
					}
					else
					{
						
						g=calls.rowCount;
						//console.log(g);
						//res.json({sorry:g});
						res.json({thankscount:f,sorrycount:g});
					}
					
				}) 
				
				//res.json({thankscount:f,sorrycount:g}); 
				//res.json({sorrycount:g}); 	  
		   

		}
	})	
 // console.log(decoded.foo) 
	
})*/
app.post('/grp',function(req,res){

	
	var gpname=req.body.grpname
	console.log("grp called")
    var ver_token=req.headers.authorization;
   
	

	jwt.verify(ver_token,'rawdata', function(err, decoded) 
	{
		if(err)
		{
			console.log(err)
			res.json({"message":"token expired"});
	     		//p=req.body.u_id;
	     		//check_name=req.body.u_name;
	     		
		}
		else
		{
				console.log("id matches");
				var  text='INSERT INTO groups(grp_name) VALUES($1)'
				var values=[gpname]
				client.query(text,values,function fun1(err,re)
				{
				if(err)
				{
					console.log(err);

				}
			    else
			    {
			    	console.log(re)
				 	
				var  text='SELECT g_id FROM groups where grp_name=$1'
				var values=[gpname]
				client.query(text,values,function fun1(err,result)
				{
				if(err)
				{
					console.log(err);

				}
			    else
			    {
			    	console.log(result)
				 	res.json(result)
				}
				})
				}
				})
		}
			
		
	})	
	
})
app.post('/addmember',function(req,res){

	
	var gp_id=req.body.gpid;
	var u_id=req.body.usid;
	console.log("add member called")
    var ver_token=req.headers.authorization;
   
	

	jwt.verify(ver_token, 'rawdata', function(err, decoded) 
	{
		if(err)
		{
			console.log(err)
			res.json({"message":"token expired"});
	     		//p=req.body.u_id;
	     		//check_name=req.body.u_name;
	     		
		}
		else
		{
				console.log("id matches");
				var  text='INSERT INTO chat_grp(grp_id,us_id) VALUES($1,$2) RETURNING *'
				var values=[gp_id,u_id]
				client.query(text,values,function fun1(err,re)
				{
				if(err)
				{
					console.log(err);

				}
			    else
			    {
			    	console.log(re)
				 	res.send("success")
				}
				})
		}
			
		
	})	
	
})
app.post('/grpemotions',function(req,res){

	var data1=new Date();
	
	var from11=req.body.us;
	var to11=req.body.gp;
	var descr11=req.body.descri;
	var emot11=req.body.emoti;
	console.log("emotions called")
    var ver_token=req.headers.authorization;
   
	

	jwt.verify(ver_token, 'rawdata', function(err, decoded) 
	{
		if(err)
		{
			console.log(err)
			res.json({"message":"token expired"});
	     		//p=req.body.u_id;
	     		//check_name=req.body.u_name;
	     		
		}
		else
		{
				console.log("id matches");
				var  text='INSERT INTO grp_emotions(fr,gr_id,des,dat,emot) VALUES($1,$2,$3,$4,$5) RETURNING *'
				var values=[from11,to11,descr11,data1,emot11]
				client.query(text,values,function fun1(err,re)
				{
				if(err)
				{
					console.log(err);

				}
			    else
			    {
			    	console.log(re)
				 	res.send("success")
				}
				})
		}
			
		
	})	
	
})
app.get('/display',function(req,res)
{
	console.log("display called")
    var ver_token=req.headers.authorization;

	jwt.verify(ver_token, 'rawdata', function(err, decoded) 
	{
		if(err)
		{
			console.log(err);
			res.json({"message":"token expired"});
	     		//p=req.body.u_id;
	     		//check_name=req.body.u_name;
	     		/*p=7;
	     		check_name='har1';
				var token = jwt.sign({ u_id:p,u_name:check_name},'rawdata',{ expiresIn: 900});//token gen for each login
				res.send(token);*/
		}
		else
		{
//select users.name,grp_emotions.des,grp_emotions.dat,grp_emotions.emot FROM grp_emotions JOIN users ON grp_emotions.fr=users.u_id;			
				console.log("thanks display");
				console.log(decoded);
				//var p=decoded.u_id;
				var p=decoded.u_id;
				
				text='SELECT users.name,grp_emotions.des,grp_emotions.dat,grp_emotions.emot,emotions.descr,emotions.emotion,emotions.date_now FROM users JOIN emotions ON users.u_id=emotions.fr_om JOIN grp_emotions ON grp_emotions.fr=users.u_id WHERE emotions.t_o=$1 '
				values=[p]
				client.query(text,values,function func(err,call)
				{
					if(err)
					{
						console.log(err)
					}
					else
					{
						console.log("hello");
						res.json(call);
					}
					
				}) 	  
		    
	    }
	})	
 // console.log(decoded.foo) 
	
})




app.listen(8080);