# Database Setup: Create Tables, Migrations, Seeding

## Create a new project and Configure Knex.js

- Create a new folder & open the folder in Terminal or Git Bash.
- In the opened folder, in terminal, run `npm init` or `npm init -y` to create a new **package.json** file.
- In the same folder, in terminal, run `npm install knex mysql dotenv express`.
- To use the knex.js CLI you can install knex globally by running the following command in terminal `npm install knex -g`.

  - If you encounter EACCES permission errors related to write permissions, please refer to [this article](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally).

- With the Knex CLI installed globally, in the same folder in terminal, run `knex init` to create a file called knexfile.js. Alternatively, you can create one manually if you have not installed a CLI.

- The generated knexfile contains examples of different environments an app could run in. Production would be a live deployment of an application, staging would be a deployed version for testing/reviewing features, and development would be for local development. For now, we will stick to local development. Please update `knexfile.js`:
  - remove the objects `production`, `staging` and `development`
  - update the remaining object to the following:

```js
require("dotenv").config();
module.exports = {
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    database: process.env.DB_LOCAL_DBNAME,
    user: process.env.DB_LOCAL_USER,
    password: process.env.DB_LOCAL_PASSWORD,
    charset: "utf8",
  },
};
```

- Create a .env file with following contents

```js
DB_LOCAL_DBNAME = "<your_db_username>";
DB_LOCAL_USER = "<your_db_password>";
DB_LOCAL_PASSWORD = "<your_db_password>";
PORT = 8080;
```

- Create a new MySQL Database. Once you have a database to use, update the `.env` file again with your user, password, and database information.

## Creating Tables

- Migrations folder and file can be created by running `knex migrate:make <migration_file_name>` You can replace <migration_file_name> with something like **create_warehouses_table**.

- We will create migration files for both warehouse table and inventory table

- Run `knex migrate:make create_warehouses_table` and then run `knex migrate:make create_inventories_table`

  > Running this command for the first time will create a **migrations** folder and a migration file with a timestamp prefix.

- The new file and folder may look something like: **migrations/20221117170505_create_warehouses_table.js**
  Open the generated file and you should see two functions, an `up` function and a `down` function. These are where we can create and drop tables!

- Edit `timestamp_create_warehouses_table.js` file to be:

```js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("warehouses", (table) => {
    table.uuid("id").primary();
    table.string("warehouse_name").notNullable();
    table.string("address").notNullable();
    table.string("city").notNullable();
    table.string("country").notNullable();
    table.string("contact_name").notNullable();
    table.string("contact_position").notNullable();
    table.string("contact_phone").notNullable();
    table.string("contact_email").notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("warehouses");
};
```

- Edit `timestamp_create_inventories_table.js` file to be:

```js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("inventories", (table) => {
    table.uuid("id").primary();
    table
      .uuid("warehouse_id")
      .references("warehouses.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.string("item_name").notNullable();
    table.string("description").notNullable();
    table.string("category").notNullable();
    table.string("status").notNullable();
    table.integer("quantity").notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("inventories");
};
```

- With the migration file edited, you can now create tables by running `knex migrate:latest`. If there are issues requiring you to drop the tables, you can run `knex migrate:rollback` or `knex migrate:down`.

  > If you get errors related to `ER_NOT_SUPPORTED_AUTH_MODE`, you will have to reset your database password using following commands in MySQL Workbench:

  ```sql
  ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new_password';
  ```

---

# Seeding Data

- With the tables created, we can populate the database with some content by creating a "seedfile". To do this, run the command `knex seed:make <seed_file_name>`, again replacing <seed_file_name> with a name of your choosing for example: `knex seed:make warehouses`. This command will create a **seeds** folder and a seed file.

- Create a seed file for warehouses data by running `knex seed:make 01_warehouses`
- Create a seed file for inventories data by running `knex seed:make 02_inventories`

- The numbers in seed file names will help in running the seed files in order - first warehouses and then inventories

---

- Open the newly generated file in the seeds folder. You should see one exported function called `seed`. This function does two things: deletes content from the tables and then inserts content. The inserted example content is an array of objects.

- Add the following to the **seeds/warehouses.js** file:

```js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("warehouses").del();
  await knex("warehouses").insert([
    {
      id: "2922c286-16cd-4d43-ab98-c79f698aeab0",
      warehouse_name: "Manhattan",
      address: "503 Broadway",
      city: "New York",
      country: "USA",
      contact_name: "Parmin Aujla",
      contact_position: "Warehouse Manager",
      contact_phone: "+1 (646) 123-1234",
      contact_email: "paujla@instock.com",
    },
    {
      id: "5bf7bd6c-2b16-4129-bddc-9d37ff8539e9",
      warehouse_name: "Washington",
      address: "33 Pearl Street SW",
      city: "Washington",
      country: "USA",
      contact_name: "Greame Lyon",
      contact_position: "Warehouse Manager",
      contact_phone: "+1 (646) 123-1234",
      contact_email: "glyon@instock.com",
    },
    {
      id: "90ac3319-70d1-4a51-b91d-ba6c2464408c",
      warehouse_name: "Jersey",
      address: "300 Main Street",
      city: "New Jersey",
      country: "USA",
      contact_name: "Brad MacDonald",
      contact_position: "Warehouse Manager",
      contact_phone: "+1 (646) 123-1234",
      contact_email: "bmcdonald@instock.com",
    },
    {
      id: "bfc9bea7-66f1-44e9-879b-4d363a888eb4",
      warehouse_name: "SF",
      address: "890 Brannnan Street",
      city: "San Francisco",
      country: "USA",
      contact_name: "Gary Wong",
      contact_position: "Warehouse Manager",
      contact_phone: "+1 (646) 123-1234",
      contact_email: "gwong@instock.com",
    },
    {
      id: "89898957-04ba-4bd0-9f5c-a7aea7447963",
      warehouse_name: "Santa Monica",
      address: "520 Broadway",
      city: "Santa Monica",
      country: "USA",
      contact_name: "Sharon Ng",
      contact_position: "Warehouse Manager",
      contact_phone: "+1 (646) 123-1234",
      contact_email: "sng@instock.com",
    },
    {
      id: "ade0a47b-cee6-4693-b4cd-a7e6cb25f4b7",
      warehouse_name: "Seattle",
      address: "1201 Third Avenue",
      city: "Seattle",
      country: "USA",
      contact_name: "Daniel Bachu",
      contact_position: "Warehouse Manager",
      contact_phone: "+1 (646) 123-1234",
      contact_email: "dbachu@instock.com",
    },
    {
      id: "bb1491eb-30e6-4728-a5fa-72f89feaf622",
      warehouse_name: "Miami",
      address: "2650 NW 5th Avenue",
      city: "Miami",
      country: "USA",
      contact_name: "Alana Thomas",
      contact_position: "Warehouse Manager",
      contact_phone: "+1 (646) 123-1234",
      contact_email: "athomas@instock.com",
    },
    {
      id: "150a36cf-f38e-4f59-8e31-39974207372d",
      warehouse_name: "Boston",
      address: "215 Essex Street",
      city: "Boston",
      country: "USA",
      contact_name: "Vanessa Mendoza",
      contact_position: "Warehouse Manager",
      contact_phone: "+1 (646) 123-1234",
      contact_email: "vmendoza@instock.com",
    },
  ]);
};
```

- Add the following to the **seeds/inventories.js** file:

```js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("inventories").del();
  await knex("inventories").insert([
    {
      id: "9b4f79ea-0e6c-4e59-8e05-afd933d0b3d3",
      warehouse_id: "2922c286-16cd-4d43-ab98-c79f698aeab0",
      item_name: "Television",
      description:
        'This 50", 4K LED TV provides a crystal-clear picture and vivid colors.',
      category: "Electronics",
      status: "In Stock",
      quantity: 500,
    },
    {
      id: "83433026-ca32-4c6d-bd86-a39ee8b7303e",
      warehouse_id: "2922c286-16cd-4d43-ab98-c79f698aeab0",
      item_name: "Gym Bag",
      description:
        "Made out of military-grade synthetic materials, this gym bag is highly durable, water resistant, and easy to clean.",
      category: "Gear",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "a193a6a7-42ab-4182-97dc-555ee85e7486",
      warehouse_id: "2922c286-16cd-4d43-ab98-c79f698aeab0",
      item_name: "Hoodie",
      description:
        "A simple 100% cotton hoodie, this is an essential piece for any wardrobe.",
      category: "Apparel",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "8f16bd30-bab5-40af-aca2-b63d5fdd1acc",
      warehouse_id: "2922c286-16cd-4d43-ab98-c79f698aeab0",
      item_name: "Keychain",
      description:
        "Made from 100% genuine leather, this keychain will keep your keys organized while keeping a classic, professional look.",
      category: "Accessories",
      status: "In Stock",
      quantity: 2000,
    },
    {
      id: "bdc6bb69-e09c-498d-8abd-be2792504d00",
      warehouse_id: "2922c286-16cd-4d43-ab98-c79f698aeab0",
      item_name: "Shampoo",
      description: "Natural shampoo made from 99% biodegradable ingredients.",
      category: "Health",
      status: "In Stock",
      quantity: 4350,
    },
    {
      id: "3ce124a4-78b0-4d80-91b9-11f9ced631a7",
      warehouse_id: "2922c286-16cd-4d43-ab98-c79f698aeab0",
      item_name: "Phone Charger",
      description:
        "This USB-C phone charger features fast charging for the latest devices.",
      category: "Electronics",
      status: "In Stock",
      quantity: 10000,
    },
    {
      id: "4dd464d6-90b8-4330-91e0-bd1217811bd9",
      warehouse_id: "2922c286-16cd-4d43-ab98-c79f698aeab0",
      item_name: "Tent",
      description:
        "Perfect for spring or summer camping, this 1-person tent is easy to pack and has the option to become modular when used with other products.",
      category: "Gear",
      status: "In Stock",
      quantity: 800,
    },
    {
      id: "c0ba64a8-0ecb-4a7d-ab7f-2dbbd1d437b1",
      warehouse_id: "2922c286-16cd-4d43-ab98-c79f698aeab0",
      item_name: "Winter Jacket",
      description:
        "Made with a durable 100% waterproof shell, and breathable layers without a ton of vents and perforations. breathable layers without a ton of vents and perforations.",
      category: "Apparel",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "d9ef9352-2367-4272-8884-70cf80cb7a38",
      warehouse_id: "2922c286-16cd-4d43-ab98-c79f698aeab0",
      item_name: "Watch",
      description:
        "Crafted from premium materials including a full-grain leather strap and a stainless steel case, this watch features swiss movement and is waterproof up to 5 ATM.",
      category: "Accessories",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "b70067d1-49c9-4925-b830-67b3e98005d5",
      warehouse_id: "2922c286-16cd-4d43-ab98-c79f698aeab0",
      item_name: "Soap",
      description:
        "Organic and hypoallergenic, this soap is safe to use for all skin types.",
      category: "Health",
      status: "In Stock",
      quantity: 12500,
    },
    {
      id: "7c79d334-6b90-4052-9def-aa9b8519c9fb",
      warehouse_id: "5bf7bd6c-2b16-4129-bddc-9d37ff8539e9",
      item_name: "Monitor",
      description:
        'A 32" IPS LED ultrawide monitor, perfect for work or gaming.',
      category: "Electronics",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "eafcb711-a726-4b3c-adec-704e3265c47d",
      warehouse_id: "5bf7bd6c-2b16-4129-bddc-9d37ff8539e9",
      item_name: "Backpack",
      description:
        "This sleek, 40L backpack is completely waterproof making it perfect for adventures or the daily commute.",
      category: "Gear",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "72c826ba-fde0-4aae-9aaf-95c6072946cd",
      warehouse_id: "5bf7bd6c-2b16-4129-bddc-9d37ff8539e9",
      item_name: "T-Shirt",
      description:
        "Breathable, and made of 100% organic cotton, this is an essential piece for any wardrobe",
      category: "Apparel",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "019da03d-1162-48a4-ad48-ed655e3d7301",
      warehouse_id: "5bf7bd6c-2b16-4129-bddc-9d37ff8539e9",
      item_name: "Belt",
      description:
        "Made from 100% full grain leather this belt will go with any dress or casual outfit.",
      category: "Accessories",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "705b808f-d8a0-4713-a796-8653c5c5952b",
      warehouse_id: "5bf7bd6c-2b16-4129-bddc-9d37ff8539e9",
      item_name: "Toothpaste",
      description:
        "This toothpaste is specially formulated to protect enamel and whiten teeth with natural ingredients.",
      category: "Health",
      status: "In Stock",
      quantity: 4000,
    },
    {
      id: "f19b0b8a-9cca-4567-9af7-4016a15e038a",
      warehouse_id: "5bf7bd6c-2b16-4129-bddc-9d37ff8539e9",
      item_name: "Mouse",
      description:
        "With a 1-month battery life this mouse is perfect for travel and productivity.",
      category: "Electronics",
      status: "In Stock",
      quantity: 785,
    },
    {
      id: "2cba0296-c77d-4758-9115-bd98ac18f2c0",
      warehouse_id: "5bf7bd6c-2b16-4129-bddc-9d37ff8539e9",
      item_name: "Sleeping Bag",
      description:
        "This ultra-light sleeping bag is packed with an eco-friendly fill. Best used in spring or summer temperatures.",
      category: "Gear",
      status: "In Stock",
      quantity: 987,
    },
    {
      id: "e202e167-d242-4d7f-b8fc-68caffef9e01",
      warehouse_id: "5bf7bd6c-2b16-4129-bddc-9d37ff8539e9",
      item_name: "Windbreaker",
      description:
        "Made from waterproof material, this windbreaker is best layered on top of a sweater to keep warm in inclement conditions.",
      category: "Apparel",
      status: "In Stock",
      quantity: 1185,
    },
    {
      id: "079c88df-ed32-4d88-a9b7-eaebc85c4ce2",
      warehouse_id: "5bf7bd6c-2b16-4129-bddc-9d37ff8539e9",
      item_name: "Water Bottle",
      description:
        "With a 1-litre capacity and BPA-free, this water-bottle is perfect for long days out.",
      category: "Accessories",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "56c8e94c-777d-4176-b7fd-02f0806f614a",
      warehouse_id: "5bf7bd6c-2b16-4129-bddc-9d37ff8539e9",
      item_name: "Protein Powder",
      description:
        "100% natural plant-based protein powder from organic ingredients.",
      category: "Health",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "2c0185c7-89ef-48ad-a22f-9fc022a5c90c",
      warehouse_id: "90ac3319-70d1-4a51-b91d-ba6c2464408c",
      item_name: "Television",
      description:
        'This 50", 4K LED TV provides a crystal-clear picture and vivid colors.',
      category: "Electronics",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "f3e13429-b5e9-4a50-b01c-75fb07cefded",
      warehouse_id: "90ac3319-70d1-4a51-b91d-ba6c2464408c",
      item_name: "Gym Bag",
      description:
        "Made out of military-grade synthetic materials, this gym bag is highly durable, water resistant, and easy to clean.",
      category: "Gear",
      status: "In Stock",
      quantity: 565,
    },
    {
      id: "3b042051-f18c-4a16-a393-68ceba87277a",
      warehouse_id: "90ac3319-70d1-4a51-b91d-ba6c2464408c",
      item_name: "Hoodie",
      description:
        "A simple 100% cotton hoodie, this is an essential piece for any wardrobe.",
      category: "Apparel",
      status: "In Stock",
      quantity: 245,
    },
    {
      id: "4d6ce289-eb58-45a1-bae3-e3874290ee48",
      warehouse_id: "90ac3319-70d1-4a51-b91d-ba6c2464408c",
      item_name: "Keychain",
      description:
        "Made from 100% genuine leather, this keychain will keep your keys organized while keeping a classic, professional look.",
      category: "Accessories",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "d3c08f85-4570-48e1-88df-610614477359",
      warehouse_id: "90ac3319-70d1-4a51-b91d-ba6c2464408c",
      item_name: "Shampoo",
      description: "Natural shampoo made from 99% biodegradable ingredients.",
      category: "Health",
      status: "In Stock",
      quantity: 209,
    },
    {
      id: "043a70e2-cf28-4ce1-a9a4-e5b3fac9c593",
      warehouse_id: "90ac3319-70d1-4a51-b91d-ba6c2464408c",
      item_name: "Phone Charger",
      description:
        "This USB-C phone charger features fast charging for the latest devices.",
      category: "Electronics",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "66327933-ce38-47e0-9bfe-5d29048bacae",
      warehouse_id: "90ac3319-70d1-4a51-b91d-ba6c2464408c",
      item_name: "Tent",
      description:
        "Perfect for spring or summer camping, this 1-person tent is easy to pack and has the option to become modular when used with other products.",
      category: "Gear",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "70ca48a6-93e2-4ff0-b3a2-f5a38f1a043e",
      warehouse_id: "90ac3319-70d1-4a51-b91d-ba6c2464408c",
      item_name: "Winter Jacket",
      description:
        "Made with a durable 100% waterproof shell, and breathable layers without a ton of vents and perforations. ",
      category: "Apparel",
      status: "In Stock",
      quantity: 125,
    },
    {
      id: "e02f302a-c67c-4600-bf12-e364b59b80ea",
      warehouse_id: "90ac3319-70d1-4a51-b91d-ba6c2464408c",
      item_name: "Watch",
      description:
        "Crafted from premium materials including a full-grain leather strap and a stainless steel case, this watch features swiss movement and is waterproof up to 5 ATM.",
      category: "Accessories",
      status: "In Stock",
      quantity: 123,
    },
    {
      id: "d3d7aa3c-6e27-4ab0-9496-f95faa5042f0",
      warehouse_id: "90ac3319-70d1-4a51-b91d-ba6c2464408c",
      item_name: "Soap",
      description:
        "Organic and hypoallergenic, this soap is safe to use for all skin types.",
      category: "Health",
      status: "In Stock",
      quantity: 863,
    },
    {
      id: "828c12d1-c0dd-4fd4-b8db-ac8eb493f8f8",
      warehouse_id: "bfc9bea7-66f1-44e9-879b-4d363a888eb4",
      item_name: "Monitor",
      description:
        'A 32" IPS LED ultrawide monitor, perfect for work or gaming.',
      category: "Electronics",
      status: "In Stock",
      quantity: 50,
    },
    {
      id: "b6abe52c-05be-4c90-b39a-d9decefd4274",
      warehouse_id: "bfc9bea7-66f1-44e9-879b-4d363a888eb4",
      item_name: "Backpack",
      description:
        "This sleek, 40L backpack is completely waterproof making it perfect for adventures or the daily commute.",
      category: "Gear",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "226fd4a6-863c-459d-b69c-007262a64015",
      warehouse_id: "bfc9bea7-66f1-44e9-879b-4d363a888eb4",
      item_name: "T-Shirt",
      description:
        "Breathable, and made of 100% organic cotton, this is an essential piece for any wardrobe",
      category: "Apparel",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "f516e1c9-486a-40c2-9bed-c8eba070f1f6",
      warehouse_id: "bfc9bea7-66f1-44e9-879b-4d363a888eb4",
      item_name: "Belt",
      description:
        "Made from 100% full grain leather this belt will go with any dress or casual outfit.",
      category: "Accessories",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "5c2000b8-f8c4-461f-935c-66eaeb52c561",
      warehouse_id: "bfc9bea7-66f1-44e9-879b-4d363a888eb4",
      item_name: "Toothpaste",
      description:
        "This toothpaste is specially formulated to protect enamel and whiten teeth with natural ingredients.",
      category: "Health",
      status: "In Stock",
      quantity: 400,
    },
    {
      id: "0716ecfc-e296-4f9f-906b-45e84030285b",
      warehouse_id: "bfc9bea7-66f1-44e9-879b-4d363a888eb4",
      item_name: "Mouse",
      description:
        "With a 1-month battery life this mouse is perfect for travel and productivity.",
      category: "Electronics",
      status: "In Stock",
      quantity: 1275,
    },
    {
      id: "9fe106e0-d719-4963-9f5b-c9321b786064",
      warehouse_id: "bfc9bea7-66f1-44e9-879b-4d363a888eb4",
      item_name: "Sleeping Bag",
      description:
        "This ultra-light sleeping bag is packed with an eco-friendly fill. Best used in spring or summer temperatures.",
      category: "Gear",
      status: "In Stock",
      quantity: 5672,
    },
    {
      id: "4b6a7565-077e-4595-a317-c53095fd5dad",
      warehouse_id: "bfc9bea7-66f1-44e9-879b-4d363a888eb4",
      item_name: "Windbreaker",
      description:
        "Made from waterproof material, this windbreaker is best layered on top of a sweater to keep warm in inclement conditions.",
      category: "Apparel",
      status: "In Stock",
      quantity: 374,
    },
    {
      id: "9abbf2d2-45d5-463c-8429-ca5454d971d4",
      warehouse_id: "bfc9bea7-66f1-44e9-879b-4d363a888eb4",
      item_name: "Water Bottle",
      description:
        "With a 1-litre capacity and BPA-free, this water-bottle is perfect for long days out.",
      category: "Accessories",
      status: "In Stock",
      quantity: 9875,
    },
    {
      id: "462e4097-ae85-4771-ba42-d28393e39e03",
      warehouse_id: "bfc9bea7-66f1-44e9-879b-4d363a888eb4",
      item_name: "Protein Powder",
      description:
        "100% natural plant-based protein powder from organic ingredients.",
      category: "Health",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "ae986f59-8c40-480c-bd28-ee6068cd3617",
      warehouse_id: "89898957-04ba-4bd0-9f5c-a7aea7447963",
      item_name: "Television",
      description:
        'This 50", 4K LED TV provides a crystal-clear picture and vivid colors.',
      category: "Electronics",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "d1c7d5b5-129d-44e1-8bda-974a90f4b920",
      warehouse_id: "89898957-04ba-4bd0-9f5c-a7aea7447963",
      item_name: "Gym Bag",
      description:
        "Made out of military-grade synthetic materials, this gym bag is highly durable, water resistant, and easy to clean.",
      category: "Gear",
      status: "In Stock",
      quantity: 1895,
    },
    {
      id: "cadc66b1-8b45-4499-a44d-fa02f1e01a04",
      warehouse_id: "89898957-04ba-4bd0-9f5c-a7aea7447963",
      item_name: "Hoodie",
      description:
        "A simple 100% cotton hoodie, this is an essential piece for any wardrobe.",
      category: "Apparel",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "94dbc0b0-85a0-4853-9439-616d46d7c662",
      warehouse_id: "89898957-04ba-4bd0-9f5c-a7aea7447963",
      item_name: "Keychain",
      description:
        "Made from 100% genuine leather, this keychain will keep your keys organized while keeping a classic, professional look.",
      category: "Accessories",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "2165edfe-b836-40ce-90cb-3bc9746fe948",
      warehouse_id: "89898957-04ba-4bd0-9f5c-a7aea7447963",
      item_name: "Shampoo",
      description: "Natural shampoo made from 99% biodegradable ingredients.",
      category: "Health",
      status: "In Stock",
      quantity: 4774,
    },
    {
      id: "ef53825b-8e42-4525-8357-2981bd9c84f9",
      warehouse_id: "89898957-04ba-4bd0-9f5c-a7aea7447963",
      item_name: "Phone Charger",
      description:
        "This USB-C phone charger features fast charging for the latest devices.",
      category: "Electronics",
      status: "In Stock",
      quantity: 9872,
    },
    {
      id: "5ac5c1fc-7785-4870-85bc-39e07e57863d",
      warehouse_id: "89898957-04ba-4bd0-9f5c-a7aea7447963",
      item_name: "Tent",
      description:
        "Perfect for spring or summer camping, this 1-person tent is easy to pack and has the option to become modular when used with other products.",
      category: "Gear",
      status: "In Stock",
      quantity: 3349,
    },
    {
      id: "9ed031c0-c0ad-4a5d-87f0-9fdb4cf0ff48",
      warehouse_id: "89898957-04ba-4bd0-9f5c-a7aea7447963",
      item_name: "Winter Jacket",
      description:
        "Made with a durable 100% waterproof shell, and breathable layers without a ton of vents and perforations. ",
      category: "Apparel",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "d0b01bdb-fbde-40c2-90ea-10750db5e442",
      warehouse_id: "89898957-04ba-4bd0-9f5c-a7aea7447963",
      item_name: "Watch",
      description:
        "Crafted from premium materials including a full-grain leather strap and a stainless steel case, this watch features swiss movement and is waterproof up to 5 ATM.",
      category: "Accessories",
      status: "In Stock",
      quantity: 2997,
    },
    {
      id: "cb460eb8-861a-45e6-8ce8-8ee9b8efabcf",
      warehouse_id: "89898957-04ba-4bd0-9f5c-a7aea7447963",
      item_name: "Soap",
      description:
        "Organic and hypoallergenic, this soap is safe to use for all skin types.",
      category: "Health",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "2c66cfb9-0136-4e79-a6cd-c7802fa245f3",
      warehouse_id: "ade0a47b-cee6-4693-b4cd-a7e6cb25f4b7",
      item_name: "Monitor",
      description:
        'A 32" IPS LED ultrawide monitor, perfect for work or gaming.',
      category: "Electronics",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "3563eb2f-372d-4cf4-a4d9-cbb7851738d2",
      warehouse_id: "ade0a47b-cee6-4693-b4cd-a7e6cb25f4b7",
      item_name: "Backpack",
      description:
        "This sleek, 40L backpack is completely waterproof making it perfect for adventures or the daily commute.",
      category: "Gear",
      status: "In Stock",
      quantity: 607,
    },
    {
      id: "98d370dc-6c7c-4bb3-90df-4e7c96fd2bf4",
      warehouse_id: "ade0a47b-cee6-4693-b4cd-a7e6cb25f4b7",
      item_name: "T-Shirt",
      description:
        "Breathable, and made of 100% organic cotton, this is an essential piece for any wardrobe",
      category: "Apparel",
      status: "In Stock",
      quantity: 1205,
    },
    {
      id: "50b19654-6990-4905-8e6b-933682a8d445",
      warehouse_id: "ade0a47b-cee6-4693-b4cd-a7e6cb25f4b7",
      item_name: "Belt",
      description:
        "Made from 100% full grain leather this belt will go with any dress or casual outfit.",
      category: "Accessories",
      status: "In Stock",
      quantity: 9863,
    },
    {
      id: "579c61d0-d9f7-422e-8902-6416a2298ff2",
      warehouse_id: "ade0a47b-cee6-4693-b4cd-a7e6cb25f4b7",
      item_name: "Toothpaste",
      description:
        "This toothpaste is specially formulated to protect enamel and whiten teeth with natural ingredients.",
      category: "Health",
      status: "In Stock",
      quantity: 1230,
    },
    {
      id: "8ea3f172-14d2-4c04-8d9e-528547781516",
      warehouse_id: "ade0a47b-cee6-4693-b4cd-a7e6cb25f4b7",
      item_name: "Mouse",
      description:
        "With a 1-month battery life this mouse is perfect for travel and productivity.",
      category: "Electronics",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "f3260a1e-0671-466e-8a3d-e49279ea0a1a",
      warehouse_id: "ade0a47b-cee6-4693-b4cd-a7e6cb25f4b7",
      item_name: "Sleeping Bag",
      description:
        "This ultra-light sleeping bag is packed with an eco-friendly fill. Best used in spring or summer temperatures.",
      category: "Gear",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "332d998f-24eb-45d4-9559-2535d36f6489",
      warehouse_id: "ade0a47b-cee6-4693-b4cd-a7e6cb25f4b7",
      item_name: "Windbreaker",
      description:
        "Made from waterproof material, this windbreaker is best layered on top of a sweater to keep warm in inclement conditions.",
      category: "Apparel",
      status: "In Stock",
      quantity: 4508,
    },
    {
      id: "1d62e3c8-68dc-4fcd-8604-d63d950dd4ce",
      warehouse_id: "ade0a47b-cee6-4693-b4cd-a7e6cb25f4b7",
      item_name: "Water Bottle",
      description:
        "With a 1-litre capacity and BPA-free, this water-bottle is perfect for long days out.",
      category: "Accessories",
      status: "In Stock",
      quantity: 2500,
    },
    {
      id: "d2e9bca4-0c88-4104-82a6-18eecf49ef07",
      warehouse_id: "ade0a47b-cee6-4693-b4cd-a7e6cb25f4b7",
      item_name: "Protein Powder",
      description:
        "100% natural plant-based protein powder from organic ingredients.",
      category: "Health",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "cd12eee6-135a-4356-8641-c7a4ee1c1116",
      warehouse_id: "bb1491eb-30e6-4728-a5fa-72f89feaf622",
      item_name: "Television",
      description:
        'This 50", 4K LED TV provides a crystal-clear picture and vivid colors.',
      category: "Electronics",
      status: "In Stock",
      quantity: 1300,
    },
    {
      id: "c1fd4dd3-35dd-444f-90fc-a2583804e8df",
      warehouse_id: "bb1491eb-30e6-4728-a5fa-72f89feaf622",
      item_name: "Gym Bag",
      description:
        "Made out of military-grade synthetic materials, this gym bag is highly durable, water resistant, and easy to clean.",
      category: "Gear",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "29749454-055c-4013-8d77-3a77a9cbf752",
      warehouse_id: "bb1491eb-30e6-4728-a5fa-72f89feaf622",
      item_name: "Hoodie",
      description:
        "A simple 100% cotton hoodie, this is an essential piece for any wardrobe.",
      category: "Apparel",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "f6fbc40a-0471-4557-a073-e7e88ede2ebc",
      warehouse_id: "bb1491eb-30e6-4728-a5fa-72f89feaf622",
      item_name: "Keychain",
      description:
        "Made from 100% genuine leather, this keychain will keep your keys organized while keeping a classic, professional look.",
      category: "Accessories",
      status: "In Stock",
      quantity: 298,
    },
    {
      id: "2d373704-0ca6-4d7c-ba90-8be47eb47c7c",
      warehouse_id: "bb1491eb-30e6-4728-a5fa-72f89feaf622",
      item_name: "Shampoo",
      description: "Natural shampoo made from 99% biodegradable ingredients.",
      category: "Health",
      status: "In Stock",
      quantity: 2888,
    },
    {
      id: "5b03fb06-bbc0-4814-8a12-6f1f4e1223f5",
      warehouse_id: "bb1491eb-30e6-4728-a5fa-72f89feaf622",
      item_name: "Phone Charger",
      description:
        "This USB-C phone charger features fast charging for the latest devices.",
      category: "Electronics",
      status: "In Stock",
      quantity: 983,
    },
    {
      id: "02a8c481-4474-4bb8-998b-64f206bcefdb",
      warehouse_id: "bb1491eb-30e6-4728-a5fa-72f89feaf622",
      item_name: "Tent",
      description:
        "Perfect for spring or summer camping, this 1-person tent is easy to pack and has the option to become modular when used with other products.",
      category: "Gear",
      status: "In Stock",
      quantity: 1406,
    },
    {
      id: "eb647e6c-8673-4520-9155-3cec6f7a120d",
      warehouse_id: "bb1491eb-30e6-4728-a5fa-72f89feaf622",
      item_name: "Winter Jacket",
      description:
        "Made with a durable 100% waterproof shell, and breathable layers without a ton of vents and perforations. ",
      category: "Apparel",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "4040cfae-39bb-403b-80fa-b770642800b6",
      warehouse_id: "bb1491eb-30e6-4728-a5fa-72f89feaf622",
      item_name: "Watch",
      description:
        "Crafted from premium materials including a full-grain leather strap and a stainless steel case, this watch features swiss movement and is waterproof up to 5 ATM.",
      category: "Accessories",
      status: "Out of Stock",
      quantity: 0,
    },
    {
      id: "853bcd65-b0b3-4f9c-844f-8b4133d7df6f",
      warehouse_id: "bb1491eb-30e6-4728-a5fa-72f89feaf622",
      item_name: "Soap",
      description:
        "Organic and hypoallergenic, this soap is safe to use for all skin types.",
      category: "Health",
      status: "Out of Stock",
      quantity: 0,
    },
  ]);
};
```

> When seeding data you can also use a [pluck method](http://knexjs.org/#Builder-pluck) to dynamically assign foreign keys, instead of setting them manually as we've done with our seed data files.

- `knex seed:run` to execute all seed files and add seed data to your database.

> Alternatively, you can have scripts inside of a package.json file:

```json
  "scripts": {
    "migrate": "knex migrate:latest",
    "migrate:down": "knex migrate:down",
    "migrate:rollback": "knex migrate:rollback",
    "seed": "knex seed:run"
  }
```

As an example, instead of running `knex migrate:latest`, you can run `npm run migrate` using one of the provided scripts in the package.json file.

## Querying Data

To start querying data from the newly created tables, we need to set up a simple express app with at least one route:

- In the root of your project, where the package.json file is located, open terminal and run the command `npm install express`.
- Create a new `index.js` file in the root of your project folder.
- Add the following code to `index.js`:

```js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5050;

// basic home route
app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
```

- Note here that we are using port `8080` from `.env` file.

- Now that our Express app is working, we want to create routes for our Warehouses. Let's set up a query to the database using Knex to return all entries in the Warehouses table.

- Add a route to the `index.js` file that uses the Express Router to route the request.

```js
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5050;

const warehouseRoutes = require("./routes/warehouseRoute");

// home route:  we can safely delete this
// app.get("/", (req, res) => {
//   res.send("Welcome to my API");
// });

// all warehouses routes
app.use("/warehouses", warehouseRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
```

- Now let's create a warehouses route file at `/routes/warehouseRoute.js`. Notice that below we have moved our callback to a new file called `warehouseController` which will include the callback methods for the routes. While it may feel like overkill for an app this simple, it reflects best practices when creating an Express app.

```js
const router = require("express").Router();
const warehouseController = require("../controllers/warehouseController");

router.route("/").get(warehouseController.index);

module.exports = router;
```

- Since we reference it above, lets create our controller for the warehouses at `/controllers/warehouseController.js`. This is where we will use knex to access our database:

```js
const knex = require("knex")(require("../knexfile"));

exports.index = (_req, res) => {
  knex("warehouses")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving Warehouses: ${err}`)
    );
};
```

- We add all route callbacks here and export them to the route file. We called the action "index" as this is the convention for naming an action that returns all entries in a table.

- To check our work we can try to reach our warehouses data at: http://localhost:8080/warehouses .

That's all for today; if you'd like to try some more queries with knex, you can get started with the [documentation](http://knexjs.org/#Builder).
