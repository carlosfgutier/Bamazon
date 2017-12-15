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
	shop();
});

function shop() {
	console.log('\nItems for sale\n');
	connection.query('SELECT * FROM products', function(err, res) {
		if (err) {
			console.log(err)
		} else {
			for (var i = 0; i < res.length; i++) {
				console.log('ID: ' + res[i].item_id);
				console.log('Item: ' + res[i].product_name);
				console.log('Price: ' + res[i].price);
				console.log('Units in stock: ' + res[i].stock_quantity);
				console.log('Department : ' + res[i].department_name + '\n');
				console.log('--------------------------------------------\n');
			}

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
				if (answer.itemId != '' && answer.itemUnits != '') {
					inStock = res[(answer.itemId - 1)].stock_quantity;
	    			checkout(answer.itemId, answer.itemUnits);
	    		} else {
	    			shop();
	    			console.log('\nPlease answer all fields\n');
	    		}
			});
		}
	});
};

// function afterConnection(){
// 	console.log("Stocked Items\n");
//   	connection.query("SELECT * FROM products", function(err, res) {
    
// 	    if (err) throw err;
// 	    console.log(res);

// 	    inquirer.prompt([
// 	    	{
// 	    		name: 'itemId',
// 	    		type: 'input',
// 	    		message: '\nType the ID of the item you would like to buy'
// 	    	},
// 	    	{
// 	    		name: 'itemUnits',
// 	    		type: 'input',
// 	    		message: 'How many units would you like to buy?'
// 	    	}
// 	    ]).then(function(answer) {
// 	    	inStock = res[(answer.itemId - 1)].stock_quantity;
// 	    	checkout(answer.itemId, answer.itemUnits);
// 	    });
//   	});
// };

function checkout(item, quantity) {
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
		shop();
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
			shop();
		} else {
			connection.end();
		}
	});
};

