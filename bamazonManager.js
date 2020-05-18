var inquirer = require("inquirer")
var mysql = require("mysql")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db",
});


connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        main(res);
    });
});


function main(res) {
    inquirer
        .prompt([
            {
                type: "list",
                name: "option",
                message: "Please select one of the following options below.",
                choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product"]
            }
        ]).then(function (user) {
            switch (user.option) {
                case "View products for sale":
                    console.table(res)
                    restart();
                    break;
                case "View low inventory":
                    lowInventory();
                    break;
                case "Add to inventory":
                    addInventory();
                    break;
                case "Add new product":
                    addProduct();
                    break;
                default:
                    break;
            }
        })

}

function restart() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        main(res);
    })
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        console.table(res)
        main(res)
    })
}

function addInventory() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "add_inventory",
                message: "Please select the id of the item you want to update."
            },
            {
                type: "input",
                name: "inventory_val",
                message: "Please enter the quantity that you would like to add to this item."
            }
        ]).then(function (user) {
            var id = user.add_inventory
            var quantity = user.inventory_val

            connection.query(`UPDATE products SET stock_quantity=stock_quantity+${quantity} WHERE item_id=${id}`, function (err, res) {
                if (err) throw err;
            })
            connection.query("SELECT * FROM products", function (err, res) {
                if (err) throw err;
                console.table(res)
                main(res)
            })
        })
}

function addProduct(){
    inquirer
    .prompt([
        {
            type: "input",
            name: "product_name",
            message: "What is the name of the product you are adding?"
        },
        {
            type: "list",
            name: "department_name",
            message: "What is the name of the department?",
            choices: ["footwear", "plants", "clothing", "home decor", "video games", "other"]
        },
        {
            type: "input",
            name: "price",
            message: "How much does this product cost?"
        },
        {
            type: "input",
            name: "stock_quantity",
            message: "How many of these items would you like to add to the store?"
        }
    ]).then(function (user) {
        var name = user.product_name
        var department = user.department_name
        var price = user.price
        var quantity = user.stock_quantity
        connection.query(`INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES("${name}", "${department}", ${price}, ${quantity})`, function (err, res) {
            if (err) throw err;
        })
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            console.table(res)
            main(res)
        })
    })
}
