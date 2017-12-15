var inquirer = require("inquirer");
var mysql = require("mysql");

var inStock;

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
	if (err) throw err;
	// console.log("connected as id " + connection.threadId + "\n");
	afterConnection();
});

function afterConnection() {
	console.log('Stocked Items\n');
	conntection.query('SELECT * FROM products', function(err, res) {
		afterConnection();
	});
};

function afterConnection(){
	console.log("Stocked Items\n");
  	connection.query("SELECT * FROM products", function(err, res) {
    
	    if (err) throw err;
	    console.log(res);

	    inquirer.prompt([
	    	{
	    		name: 'itemId',
	    		type: 'input',
	    		message: '\nType the ID of the item you would like to buy'
	    	},
	    	{
	    		name: 'itemUnits',
	    		type: 'input',
	    		message: 'How many units would you like to buy?'
	    	}
	    ]).then(function(answer) {
	    	inStock = res[(answer.itemId - 1)].stock_quantity;
	    	checkout(answer.itemId, answer.itemUnits);
	    });
  	});
};

function checkout(item, quantity) {
	if (item <= 10) {
		if (quantity <= inStock) {
			var query = 'UPDATE products SET stock_quantity = ' + (inStock - quantity) + ' WHERE item_id = ' + item;
			connection.query(query, function(err, res) {
				if (err) throw err;
				console.log('\n=================================');
				console.log('Thank you for shopping with us!');
				console.log('Your transaction has been succesful.');
				console.log('\nYou ordered: ' + quantity + ' units of the item with an ID of ' + item + '.\n');
				shopMore();
			});
		} else {
			console.log("We do not have that ammount. Please try a smaller number.");
			afterConnection();
		}
	}
};

function shopMore() {
	inquirer.prompt([
		{
			name: 'again',
			type: 'confirm',
			message: 'Would you like to continue shopping?'
		}
	]).then(function(answer) {
		if (answer.again === true) {
			afterConnection();
		} else {
			connection.end();
		}
	});
};

