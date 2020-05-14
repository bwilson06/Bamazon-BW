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
        console.log(res);
        main(res);
    });
});

function main(res){
    console.log("\n| ID | | Name | | Department | | Price | | Qunatity |\n\n-----------------------------------------------------")
    res.forEach(function(element){
        console.log(`\n|${element.item_id}|   | ${element.product_name} |   | ${element.department_name} |   | ${element.stock_quantity} |`)
    })
}