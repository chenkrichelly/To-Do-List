const express = require("express");
const { render } = require("express/lib/response");
const date = require(__dirname+"/date.js");
const app = express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [ "Going to the gym","Scheduling a doctor's appointment","Doing laundry"];
let workItems = ["Completing project report with Dan", "Sending Suzan follow-up mail","Finishing the new site's design"];


app.get("/", (req,res)=>{
    
    let day= date.getDate();
    res.render("list", {listTitle: day, newListItem: items});
});

app.post("/", (req,res)=>{
    let item= req.body.newItem;

    if (req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work");

        }
        else{
            items.push(item);
            res.redirect("/");
        }

    
});

app.get("/work", (req,res)=>{
    res.render("list", {listTitle: "Work List", newListItem: workItems})
})

app.post("/work", (req,res)=>{
    let item= req.body.newItem;
    workItems.push(item);

    res.redirect("/work");
})

app.listen(3000, ()=>{
    console.log("server started on port 3000");
});