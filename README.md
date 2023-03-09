# Storefront Backend Project

## Installation Instructions
Using any Code Editor, like Visual Studio Code, open the project file. Then, open a teminal and run the following commands.

This section contains all the packages used in this project and how to install them.
### Prettier
1- Install prettier
	npm i prettier
2- Add some preferences to prettier (in bash terminal)
	touch .prettierrc
3- Inside prettierrc file add (example->)
	{
  		"semi": true,
  		"singleQuote": true
    }
4- Allow prettier to check our code, add in package.json file -> Edit “scripts”
	"prettier": "prettier --config .prettierrc ./src/**/*.ts --write",
5- Run prettier 
	npm run prettier 	

### Lodash
1- Install lodash
	npm i lodash
2- Add some preferences to lodash 
    npm i --save-dev @types/lodash

### Jasmine
1- Install Jasmine
	npm i jasmine
2- Add a reporter for outputting Jasmine results to the terminal
	npm i jasmine-spec-reporter
3- Add type definitions
	npm i --save-dev @types/jasmine
4- Allow jasmine into our code, add in package.json file -> Edit “scripts”
	"jasmine": "jasmine"
	"test": "npm run build && npm run jasmine"
5- to run jasmine
    npm run jasmine
    npm run test
        OR
    npm run test

### Endpoint Testing
1- Install Supertest
	npm i supertest
2- Add type definition to allow the code to compile without TypeScript errors
    npm i --save-dev @types/supertest
3- Import SuperTest in the spec file
4- Create and Run Tests
    npm run test

### dotenv
1- Install dotenv
    npm i dotenv
2- Add type definitions
	npm i --save-dev @types/dotenv

### pg
1- Install pg
    npm i pg
2- Add type definitions
	npm i --save-dev @types/ pg

### db-migrate
1- Install db-migrate
    npm install -g db-migrate
2- Install db-migrate-pg
	npm i db-migrate-pg
3- Create a migration (includes db-migrate up & db-migrate down)
    db-migrate create nameofthetable-table --sql-file

### jsonwebtoken
1- Install jsonwebtoken
    npm i jsonwebtoken
2- Add type definitions
    npm i --save-dev @types/jsonwebtoken

## Database

### setup
First we download postgresql and install it in your device. After that you will open pgAdmid and create a database using it (the database will have a user and a password).
To make things easier, you can set up environment variables and add the path in the system variables.

### Create user
**Via pgAdmin**
- Login to your pgAdmin
- Create a user by right clicking on *Login/Group Rules*
- Add the username and password
- In *privileges* allow all the choices for the user
- Press *Save*

### Create database
**Via SQL query**
- Go to your terminal
- Write this command connect to the pgAdmin user 'psql -U pgAdmin_username'
- To create the database write SQL query 'CREATE DATABASE Database_Name'

### connect (in case you disconnected)
To connect to the database that we created, we use 'psql Database_Name' command in CMD. After that we will be able to use sql to build tables in the database.

### run
In this project all the commands that are used to build the database are saved in the root we go to migrations/sqls and there we will find two files for each table.
db-migrate up which will include the commands that executes the migrations of the table and db-migrate down which will include the commands that executes the migrations that will undo some commands drom the db-migrate up.
Running these two files, for each table, will make you able to access the database freely in the code.

Note: the .env file in the root should include Postgres information that make you connect to the database.

## Running Ports
After start up, the server will start on port 3000 and the database on port 5432