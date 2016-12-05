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
  buyOrQuit();
}

function buyOrQuit() {
  inquirer.prompt({
    type: "list",
    message: "Would you like to buy something or exit the shop?",
    name: "buyOrQuit",
    choices: [
    "Purchase something.",
    "I'm out of here!"
    ]
  }).then(function(answer) {
    if (answer.buyOrQuit == "I'm out of here!") {
      quit();
    } else {
      userBuy();
    }
  });
}

// exit app
function quit() {
  console.log("Thank you for stopping by!");
  connection.end();
}

//displays the bamazon database data 
function printTable() {
       var table = new Table({
       head: ['Product ID', 'Product Name', 'Product Category', 'Price', 'Stock'],
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
   });
}

function userBuy() {
  printTable();
  inquirer.prompt([{
    name: "id",
    type: "input",
    message: "Enter the ID of the product you would like to purchase: ",
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  }, {
    name: "quantity",
    type: "input",
    message: "Enter the amount you would like to purchase: ",
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  }]).then(function(answer) {
    connection.query("SELECT * FROM products WHERE ?", {item_id: answer.id}, function(err, res) {
      if (err) throw err;
      //not sufficient quantity
      if (answer.quantity > res.stock_quantity) {
        console.log("Sorry! I don't have enough " + res[0].product_name + "(s) right now. Try buying a few less.");
        buyOrQuit();
      } else {
        console.log("Thank you for your purchase! You bought " + answer.quantity + " " + res[0].product_name + "(s) for a total of: $" + answer.quantity*res[0].price + ".");
        connection.query("UPDATE products SET stock_quantity = ? WHERE ?", [res[0].stock_quantity-=answer.quantity, {item_id: answer.id}]);
        buyOrQuit();
      }
    })
  });
}

welcome();