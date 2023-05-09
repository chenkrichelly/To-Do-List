const express = require("express");
const { render } = require("express/lib/response");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect('mongodb+srv://chenkrichelly:mongo120@cluster0.sfmpg8m.mongodb.net/todolistDB');

const itemsSchema = {
    name: String
};
const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const item4 = new Item({
    name: "Create more lists through the address bar /example"
});

const defaultItems = [item1, item2, item3, item4];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {

    Item.find({})
        .then(function (foundList) {
            console.log("yayyyy");
            if (foundList.length === 0) {
                Item.insertMany(defaultItems)
                    .then(function () {
                        console.log("Successfully saved defult items to DB");
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                res.redirect("/");
            } else {
                res.render("list", { listTitle: "Today", newListItems: foundList });
            }
        })
        .catch(function (err) {
            console.log(err);
        });

});

app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName })
        .then(foundList => {
            if (!foundList) {
                //Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                //Show an existing list
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
            }
        })
        .then(list => {
            res.render("list", { listTitle: list.name, newListItems: list.items });
        })
        .catch(err => console.log(err));
});




app.post("/", function (req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        
        List.findOne({ name: listName })
            .then(foundList => {
                foundList.items.push(item);
                return foundList.save();
            })
            .then(() => {
                res.redirect("/" + listName);
            })
            .catch(err => console.log(err));

    }
});


app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId)
            .then(function () {
                console.log("Successful");
                res.redirect("/");
            })
            .catch(function (err) {
                console.log(err);
            });
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } })
            .then(function () {
                res.redirect("/" + listName);
            })
            .catch(function (err) {
                console.log(err);
            });
    }


});

// app.get("/work", (req, res) => {
//     res.render("list", { listTitle: "Work List", newListItems: workItems })
// })

app.post("/work", (req, res) => {
    let item = req.body.newItem;
    workItems.push(item);

    res.redirect("/work");
})

app.listen(3000, () => {
    console.log("server started on port 3000");
});