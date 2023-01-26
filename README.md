# InStock
Fully responsive Full-stack React/Express.js app built in a week-long sprint with a group of 4: Miguel Lopez, Ian del Carpio, Lucas Lu, and Jayson Postle.

## Overview:
In a group of 4, we were tasked with creating an inventory management system for a fictitious company. We were given a Figma design file and had to build a backend using a relational MySQL database, connected with Knex.js, and a server using Express.js. The front-end was built using React (Axios, SCSS, React Router Dom). The user can view warehouse and inventory data as well as add, edit, and delete warehouses and inventories.

## Screenshots
<img width="1103" alt="warehouses" src="https://user-images.githubusercontent.com/50502972/214374777-916c283c-2efe-471d-ba23-fe8ecec0514d.png">
<img width="1105" alt="add-new-inventory-item" src="https://user-images.githubusercontent.com/50502972/214955495-af55cdb2-5c92-4b39-8ac7-ada311bb2a9d.png">
<img width="1098" alt="edit-inventory-item" src="https://user-images.githubusercontent.com/50502972/214955500-50b52ddc-9222-439a-851f-889fdda61b10.png">


## Developer installation instructions

### Set up the db
Create a .env file with the following contents:
```js
DB_LOCAL_DBNAME = "<your_db_username>";
DB_LOCAL_USER = "<your_db_password>";
DB_LOCAL_PASSWORD = "<your_db_password>";
PORT = 8080;
```

- Create a new MySQL Database called 'instock'. Once you have a database to use, update the `.env` file again with your user, password, and database information.


Seed your data
- Run npx knex seed:run to execute all seed files and add seed data to the database and each table.

If you have to create your migrations and tables first:
- For each table, run 'npx knex migrate:make [schema name]' replacing schema name with inventories, warehouses. But these should already be populated with a clone from GitHub.

Start your server
- cd into the server folder
- npm run server

Start your client
- cd into the client folder
- npm start

## Tech Stack
Backend built in javascript with node.js/express.js, a MySQL database connected with Knex.js. The frontend was built in React.js and SCSS for styling.

## What we learned
### Team Code Consistency and Code Collisions
We were very lucky to have such a great team both in our ability but more importantly, communication skills. We had rare code collisions and as a group we very quickly resolved issues. The Prettier extension made a few pull requests look like there were issues when in reality there weren’t. One area we would want to work on if given a second opportunity would be to create a consistent design system. We each took tickets from the project management board JIRA and to an extent, worked on each ticket/page/piece of functionality in silo. We asked each other questions but there are lines of duplicate code that could be streamlined. For example, the CSS for the Warehouse and Inventory tables is nearly the same. We really only need one component along but we made two along with two SCSS files. There are 2 other sets of pages that have similar views (adding and editing database items).

## Portfolio Link
See more details about the project on our individual portfolios:

### Jayson Postle
https://jaysonpostle.digital/portfolio/instock-inventory-management-system
