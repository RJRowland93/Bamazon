var mysql      = require('mysql');
var inquirer   = require('inquirer');
var Table      = require('cli-table'); 

// connect to DB
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bamazon'
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  //console.log('connected as id ' + connection.threadId);
});

// Welcome message
function welcome() {
  console.log("I'm Randal Rowland and this is my shop.\nI work here with my high ambitions and low standards.\nEverything in here has a story and a price.\nOne thing I've learned in 23 years,\nyou never know what is going to come through that console.");
  manageOrQuit();
}

// exit app
function quit() {
  console.log("Thank you for stopping by!");
  connection.end();
}

function manageOrQuit() {
  inquirer.prompt({
    type: "list",
    message: "Would you like to manage something or exit the shop?",
    name: "buyOrQuit",
    choices: [
    "Manage the stockroom.",
    "I'm out of here!"
    ]
  }).then(function(answer) {
    if (answer.buyOrQuit == "I'm out of here!") {
      quit();
    } else {
      manage();
    }
  });
} 

function manage() {
	inquirer.prompt({
		name: "options",
		type: "list",
		message: "What would you like to do?",
		choices: [
		"View products for sale.",
		"View low inventory",
		"Add to inventory",
		"Add new product"]
	}).then(function(answer) {
		switch (answer.options) {
		case "View products for sale.":
			printTable();
			break;
		case "View low inventory":
			printLow();
			break;
		case "Add to inventory":
			addInventory();
			break;
		case "Add new product":
			addProduct();
			break;
		}
	});
}

//displays the bamazon database data 
function printTable() {
       var table = new Table({
       head: ['Product ID', 'Product Name', 'Product Department', 'Price', 'Stock'],
       colWidths: [10, 25, 15, 10, 10],
       chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
       , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
       , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
       , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
   });
   var queryTable = "SELECT * from products";
   connection.query(queryTable, function(err, response) {
       if (err) throw err;
       for (var i = 0; i < response.length; i++) {
           table.push(
               [response[i].item_id, response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity]
           );
       }
       console.log(table.toString());
       manageOrQuit();
   });
}
// show items with stock_quantity less than 5
function printLow() {
	var table = new Table({
       head: ['Product ID', 'Product Name', 'Product Department', 'Price', 'Stock'],
       colWidths: [10, 25, 15, 10, 10],
       chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
       , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
       , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
       , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
   });
	connection.query("SELECT * from products GROUP BY item_id HAVING stock_quantity < 6", function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			table.push(
				[res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
				);
		}
		console.log(table.toString());
		manageOrQuit();
	});
}

function addInventory() {
	// printTable();
	inquirer.prompt([{
		name: "id",
		type: "input",
		message: "Enter the ID of the product you would like to update: ",
		validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
	}, {
		name: "quantity",
		type: "input",
		message: "Enter the amount you would like to add: ",
		validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
	}]).then(function(answer) {
		connection.query("SELECT * FROM products WHERE ?", {item_id: answer.id}, function(err, res) {
			if (err) throw err;
			connection.query("UPDATE products SET stock_quantity = ? WHERE ?", [res[0].stock_quantity+=parseInt(answer.quantity), {item_id: answer.id}]);
			console.log("You have added " + answer.quantity + " " + res[0].product_name + "(s) for a total of " + res[0].stock_quantity + " " + res[0].product_name + "(s).");
			manageOrQuit();
		});
	});
}

function addProduct() {
	inquirer.prompt([{
		name: "name",
		type: "input",
		message: "Enter the name of the product"
	}, {
		name: "department",
		type: "input",
		message: "Enter the name of the department"
	}, {
		name: "price",
		type: "input", 
		message: "Enter the price",
		validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			}
			return false;
		}
	}, {
		name: "quantity",
		type: "input",
		message: "Enter the quantity",
		validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			}
			return false;
		}
	}]).then(function(answers) {
		var post = {product_name: answers.name, department_name: answers.department, price: answers.price, stock_quantity: answers.quantity}
		connection.query("INSERT INTO products SET ?", post, function(err, res) {
			if (err) throw err;
			connection.query("SELECT * FROM products WHERE ?", {item_id: res.insertId}, function(err, res) {
				if (err) throw (err);
				console.log("You have added " + res[0].stock_quantity + " " + res[0].product_name + "(s) to the stockroom.");
				manageOrQuit();
			});
		});
	});
}

welcome();