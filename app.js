var inquirer = require("inquirer")
var mysql = require("mysql")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db",
});

function restart() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        main(res);
    })
}

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
    console.log("\n| ID | | Name | | Department | | Price | | Qunatity |\n\n-----------------------------------------------------")
    res.forEach(function (element) {
        console.log(`\n|${element.item_id}|    | ${element.product_name}|    | ${element.department_name} |    | ${element.stock_quantity} |\n\n`)
    })
    inquirer
        .prompt([
            {
                type: "input",
                name: "item_id",
                message: "Please enter the id of the item that you would like to buy",
            },
            {
                type: "input",
                name: "item_quantity",
                message: "Please enter the desired quantity"
            }
        ])
        .then(function (user) {
            var item_id = user.item_id
            var item_quantity = parseInt(user.item_quantity)
            connection.query(
                `SELECT * FROM products WHERE item_id=${item_id}`,
                function (err, res) {
                    if (err) throw err;
                    var lastChar = res[0].product_name.slice(-1)[0]
                    if (item_quantity < res[0].stock_quantity) {
                        if (item_quantity > 1 && lastChar != 's') {
                            console.log(`\n\nYou purchased ${item_quantity} ${res[0].product_name}s!`);
                        } else {
                            console.log(`\n\nYou purchased ${item_quantity} ${res[0].product_name}!`);
                        }

                        connection.query(
                            `UPDATE products SET stock_quantity=stock_quantity-${item_quantity} WHERE item_id=${item_id}`,
                            function (err, res) {
                                if (err) throw err;
                                restart();
                                // Call deleteProduct AFTER the UPDATE completes
                            }
                        );
                    } else {
                        console.log('Insufficient quantity, please select a different amount')
                        restart();
                    }
                    // Call deleteProduct AFTER the UPDATE completes
                }
            );
        })
}

