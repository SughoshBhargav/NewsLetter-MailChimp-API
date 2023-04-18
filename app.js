const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { url } = require("inspector");
const { options } = require("request");
require("dotenv").config();

const app = express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
    
});

app.post("/",function(req,res){

    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {
        members : [
        {
            email_address : email,
            status : "subscribed",
            merge_fileds : {
                FNAME : firstName,
                LNAME : lastName
            }
        }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/6d577247e2";

    const options  = {

        method : "POST",
        auth : "sughosh:"+process.env.API_KEY
    
    }   
    console.log(options.auth)

    const request = https.request(url,options,function(response){

        if(response.statusCode == 200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }


        response.on("data",function(data){
            console.log(JSON.parse(data));

        })
    })
    request.write(jsonData);
    request.end();
    
});

app.post("/failure",function(req,res){
    res.redirect("/");  

});

app.listen(process.env.PORT || 3000,function(){
    console.log("server is Runnig on port 3000");
}) ;

//API KEY --> 6b6b31d4ace16da24c6459edbefdfce8-us21 

//LIST ID --> 6d577247e2
