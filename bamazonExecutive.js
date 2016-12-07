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

//displays the bamazon database data 
function printTable() {
       var table = new Table({
       head: ['Dept ID', 'Dept Name', 'Overhead Costs', 'Total Sales'],
       colWidths: [10, 20, 20, 15],
       chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
       , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
       , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
       , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
   });
   var queryTable = "SELECT * from departments";
   connection.query(queryTable, function(err, response) {
       if (err) throw err;
       for (var i = 0; i < response.length; i++) {
           table.push(
               [response[i].department_id, response[i].department_name, response[i].over_head_costs, response[i].total_sales]
           );
       }
       console.log(table.toString());       
   });
}

