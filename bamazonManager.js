var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId + "\n");
	managerSays();
});

function managerSays() {
	inquirer.prompt([
		{
			name: 'order',
			type: 'list',
			message: 'What would you like to do?',
			choices: ['View inventory', 'View low inventory', 'Add new product', 'Restock inventory', 'Log out']
		}
	]).then(function(answer) {
		if (answer.order == 'View inventory') {
			checkInventory();

		} else if (answer.order == 'View low inventory') {
			checkLow();

		} else if (answer.order == 'Add new product') {
			addItem();

		} else if (answer.order == 'Restock inventory') {
			console.log('restocking inventory');
			restock();

		} else if (answer.order == 'Log out') {
			connection.end();
		}
	})
};


//MAIN FUNCTIONS
//--------------------------------------------------------
function checkInventory() {
	console.log('\nStocked Items\n');
	connection.query('SELECT * FROM products', function(err, res) {
		if (err) throw err;
	    console.log(res);
	    keepWorking();
	});
};

function checkLow() {
	connection.query('SELECT * FROM products WHERE stock_quantity < 50', function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			console.log('\nID: ' + res[i].item_id);
			console.log('Item: ' + res[i].product_name);
			console.log('In Stock: ' + res[i].stock_quantity + '\n');
			console.log('--------------------------------------------\n');
		}
		keepWorking();
	});
};

function addItem() {
	inquirer.prompt([
		{
			name: 'item',
			type: 'input',
			message: 'Type the name of the item you want to add'
		},
		{
			name: 'department',
			type: 'input',
			message: 'Which department does this item belong'
		},
		{
			name: 'cost',
			type: 'input',
			message: 'What is the price for a unite of this item'
		},
		{
			name: 'ammount',
			type: 'input',
			message: 'How many would you like to add'
		}
	]).then(function(answer) {
		if (answer.item != '' 
			&& answer.department != '' 
			&& answer.cost != '' 
			&& answer.ammount != '') {
			
			connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("' + answer.item + '", "' + answer.department + '", ' + answer.cost + ', ' + answer.ammount + ');', function(err, res) {
				if (err) throw err;
				console.log('\n' + answer.ammount + ' ' + answer.item + ' successfully added\n');
				addAnother();
			});
		} else {
			console.log('\nPlease answer all fields\n');
			addAnother();
		}
	});
};

function restock() {
	inquirer.prompt([
		{
			name: 'sortBy',
			type: 'list',
			message: 'Search item by: '
			choices: ['Name', 'ID']
		}
	]).then(function(answer) {
		if (answer.sortBy == 'Name') {
			sortByName();
		} else if (answer.sortBy == 'ID') {
			sortById();
		}
	})
};


//OTHER FUNCTIONS 
//--------------------------------------------------------
function sortByName() {
	inquirer.prompt([
		{
			name: 'byName',
			type: 'input',
			message: 'What is the name of the product?'
		},
		{
			name: 'ammount',
			type: 'input',
			message: 'How many do you want to add?'
		}
	]).then(function(answer) {
		if (answer.byName != '' && answer.ammount != '') {

		} else {








			
		}
	})
};


function addAnother() {
	inquirer.prompt([
		{
			name: 'oneMore',
			type: 'confirm',
			message: 'Would you like to add another item?'
		}
	]).then(function(answer) {
		if (answer.oneMore === true) {
			addItem();
		} else {
			keepWorking();
		}
	});
};

function keepWorking() {
	inquirer.prompt([
		{
			name: 'again',
			type: 'confirm',
			message: 'Would you like to perform another action?'
		}
	]).then(function(answer) {
		if (answer.again === true) {
			managerSays();
		} else {
			console.log('\nHave a Great Day\n');
			connection.end();
		}
	});
};