## Getting Started

This codealong is a continuation of the codealong for setting up Knex with migrations and seeds.

Feel free to continue from where we left off or [download the starter code.](https://api.brainstation.io/content/link/1M0uWanOi5bXpd1sBfy5oUvGWxj-O9S6Q/)

If you are using the starter code, make sure to install the dependencies with `npm i` as well as run migrations and seeds, first updating `knexfile.js` with the DB connection info and then running `npm run migrate` and `npm run seed`.

Now that we have a database full of data, let's build some API endpoints so we can interface with it. More specifically, we'll add CRUD functionality to our models; we'll concentrate on the warehouse models. For inventory functionality we will write the initial code (similar to previous codealong) and leave it for you to implement fully later.

We need to add both a route and a controller files for our inventory table, as we did previously. Create the new files `/routes/inventoryRoute.js` and `/controllers/inventoryController.js`, similar to your warehouses. Add the inventories route to your `index.js` with these two lines:

```js
const inventoryRoutes = require("./routes/inventoryRoute");
app.use("/inventories", inventoryRoutes);
```

If you have not yet done it, remove the home route we added last time; we no longer need it.

Add these lines to `/routes/inventoryRoute.js`:

```js
const router = require("express").Router();
const inventoryController = require("../controllers/inventoryController");

router.route("/").get(inventoryController.index);

module.exports = router;
```

And `/controllers/inventoryController.js`:

```js
const knex = require("knex")(require("../knexfile"));

exports.index = (_req, res) => {
  knex("inventories")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving Inventories: ${err}`)
    );
};
```

Knex is what we call a query builder - a way to make SQL calls but written in a JS-friendly format. `knex('inventory')` fetches rows similar to the SQL string `SELECT * FROM inventory;` and returns a JavaScript promise.

We can now check our work and make sure that our new route is working. Start the server using `npm run dev` command and using Postman or an equivalent tool, run a GET action on our inventories endpoint at `http://localhost:8080/inventories`.

## CRUD Operations

Because we're building RESTful APIs, it makes sense for us to plan out our API endpoints with the warehouses resource. If we were to apply CRUD principles, what warehouse-related operations do we need?

| Method   | URL                          | Description                            |
| -------- | ---------------------------- | -------------------------------------- |
| `GET`    | `/warehouses`                | Retrieve all warehouses.               |
| `POST`   | `/warehouses`                | Create a new warehouse.                |
| `GET`    | `/warehouses/28`             | Retrieve warehouse #28.                |
| `PUT`    | `/warehouses/28`             | Update warehouse #28.                  |
| `DELETE` | `/warehouses/28`             | Delete warehouse #28.                  |
| `GET`    | `/warehouses/28/inventories` | Retrieve inventories in warehouse #28. |

For each API, we also need to implement routes and controller methods for warehouses.

### GET data on all warehouses

Right now, we're returning all the fields for all of the rows. But what if we only cared about the name and manager fields? Our model could have any amount of fields. Because of this, we should only ask for the information that we need when querying a database. It's also customary for REST API to return limited data for "retrieve all" endpoint. So let's alter our query to only retrieve essential information:

In `/router/warehouseController.js`:

```js
exports.index = (_req, res) => {
  knex("warehouses")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).send(`Error retrieving Warehouses ${err}`));
};
```

This would build out the SQL query `SELECT id, name, manager FROM warehouse;`

### Read a single Warehouse using GET

To get info on a single warehouse record, we need to pass in the id of that record. To accomplish this, we need to create a new route for warehouses that includes an `id` parameter.

Let's add a route in the `/routes/warehouseRoute.js` file. Under the existing route, add:

```js
router.route("/:id").get(warehouseController.singleWarehouse);
```

Notice that we have added a new method to `warehouseController`. How do we add this in the file? As we can export more than one method, we need to add another exported function.

In `/controllers/warehouseController.js`:

```js
exports.singleWarehouse = (req, res) => {
  knex("warehouses")
    .where({ id: req.params.id })
    .then((data) => {
      // If record is not found, respond with 404
      if (!data.length) {
        return res
          .status(404)
          .send(`Record with id: ${req.params.id} is not found`);
      }

      // Knex returns an array of records, so we need to send response with a single object only
      res.status(200).json(data[0]);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving warehouse ${req.params.id} ${err}`)
    );
};
```

This controller method returns a single warehouse, building the SQL query `SELECT * FROM warehouse WHERE id=#`, where `#` is our parameter at `req.params.id`.

### Retrieve inventories from a particular warehouse using GET

That above endpoint gives us specific warehouse information, but we were hoping to also get a list of inventory items that belong to that warehouse using the endpoint `/warehouses/28/inventories`.

In `/routes/warehouseRoute.js`, add the following:

```js
router.route("/:id/inventories").get(warehouseController.warehouseInventories);
```

This time around, we're using the warehouse controller to query items in the inventory table, not the warehouse table. Why is that?

The job of a warehouses controller is to prepare information relating to a warehouse; so in this particular instance, since we are getting records related to warehouse, it should still be in warehouse controller, even though we are querying another table.

In `/controllers/warehouseController.js`:

```js
exports.warehouseInventories = (req, res) => {
  knex("inventories")
    .where({ warehouse_id: req.params.id })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) =>
      res
        .status(400)
        .send(
          `Error retrieving inventories for Warehouse ${req.params.id} ${err}`
        )
    );
};
```

Let's check our work by querying `http://localhost:8080/warehouses/1/inventories`. What data has been returned?

### Create a new warehouse using POST

Let's add the ability to add a warehouse. In `/routes/warehouseRoute.js`, update the following line:

```js
router.route("/").get(warehouseController.index);
```

to be

```js
router
  .route("/")
  .get(warehouseController.index)
  .post(warehouseController.addWarehouse);
```

And in `/controllers/warehouseController.js`:

- let's install `uuid` package by running `npm i uuid` in our root folder.
- Import uuid in your controller - `const { v4: uuidv4 } = require("uuid");`

```js
exports.addWarehouse = (req, res) => {
  // Validate the request body for required data
  if (
    !req.body.warehouse_name ||
    !req.body.address ||
    !req.body.city ||
    !req.body.country ||
    !req.body.contact_name ||
    !req.body.contact_position ||
    !req.body.contact_phone ||
    !req.body.contact_email
  ) {
    return res
      .status(400)
      .send(
        "Please make sure to provide warehouse_name, address, city, country, contact_name, contact_position, contact_phone and contact_email fields in a request"
      );
  }

  const newWarehouseId = uuidv4();
  knex("warehouses")
    .insert({ ...req.body, id: newWarehouseId })
    .then((_data) => {
      knex("warehouses")
        .where({ id: newWarehouseId })
        .then((data) => {
          res.status(201).json(data[0]);
        });
    })
    .catch((err) => res.status(400).send(`Error creating Warehouse: ${err}`));
};
```

Now check our work: using Postman, send a POST request to the warehouses endpoint with the following json data:

```json
{
  "warehouse_name": "Nanaimo",
  "address": "123 Front Street",
  "city": "Nanaimo",
  "country": "Canada",
  "contact_name": "John Doe",
  "contact_position": "Warehouse Manager",
  "contact_phone": "+1 (250) 123-1234",
  "contact_email": "jdoe@instock.com"
}
```

It's a good thing we checked, because now we're getting an error:

```
TypeError: Cannot read property 'name' of undefined
```

What is causing this? If you guessed that we're missing middleware to parse the body of the POST request, great job! Add this code to `index.js`:

```js
app.use(express.json());
```

Make sure the middleware above is added before your routes middlewares. Now, run the query again: you should get back a 201 status code with the URL of the new warehouse record. The number at the end of the URL is the id of the new warehouse we just created.

If you omit any of the data in a request body, you should also be able to see validation working.

Let's keep going.

### Update an existing warehouse using PUT

This is similar to our POST call, with a couple of differences; if we want to make a change to an existing warehouse, what additional information do we need?

If you said "the warehouse id", you are right! Taking that in account, we'll add another line to `/routes/warehouseRoute.js`:

```js
router.route("/:id").put(warehouseController.updateWarehouse);
```

Before we get to the controller method, you may have noticed that our routes aren't very DRY; we see `router.route('/')` and `router.route('/:id')` a couple of times. Let's refactor this and make our code cleaner. Replace your `router.route()` methods with the following:

```js
router
  .route("/")
  .get(warehouseController.index)
  .post(warehouseController.addWarehouse);

router
  .route("/:id")
  .get(warehouseController.singleWarehouse)
  .put(warehouseController.updateWarehouse);

router.route("/:id/inventories").get(warehouseController.warehouseInventories);
```

Much better. Now let's add the `updateWarehouse` method. In `/controllers/warehouseController.js`:

```js
exports.updateWarehouse = (req, res) => {
  knex("warehouses")
    .update(req.body)
    .where({ id: req.params.id })
    .then((_data) => {
      knex("warehouses")
        .where({ id: req.params.id })
        .then((data) => {
          res.status(200).json(data[0]);
        });
    })
    .catch((err) =>
      res.status(400).send(`Error updating Warehouse ${req.params.id} ${err}`)
    );
};
```

Let's check our work again; using Postman or a similar tool, make a PUT request to the warehouse and change the name of the `name` property inside the request body:

```json
{
  "warehouse_name": "Victoria",
  "address": "123 Front Street",
  "city": "Victoria",
  "country": "Canada",
  "contact_name": "John Doe",
  "contact_position": "Warehouse Manager",
  "contact_phone": "+1 (778) 123-1234",
  "contact_email": "jdoe@instock.com"
}
```

We should get back the id of the warehouse we updated.

Note, that there is another HTTP verb that allows us to update records: PATCH. The difference between PUT and PATCH is that PATCH is used for partially updating an existing resource, while PUT replaces a resource in it's entirety.

What that means is for PATCH requests we can provide only the fields that need to be updated, where PUT requires us to specify all the fields. We'll leave creating a PATCH endpoint as an exercise for you to try on your own.

Now for the last of the CRUD operations! Let's do the DELETE action.

### Delete an existing warehouse using DELETE

Add the route:

```js
router
  .route("/:id")
  .get(warehouseController.singleWarehouse)
  .put(warehouseController.updateWarehouse)
  .delete(warehouseController.deleteWarehouse);
```

And the controller method:

```js
exports.deleteWarehouse = (req, res) => {
  knex("warehouses")
    .delete()
    .where({ id: req.params.id })
    .then(() => {
      // For DELETE response we can use 204 status code
      res
        .status(204)
        .send(`Warehouse with id: ${req.params.id} has been deleted`);
    })
    .catch((err) =>
      res.status(400).send(`Error deleting Warehouse ${req.params.id} ${err}`)
    );
};
```

What happens to inventories associated with the deleted warehouse? What ways can you think of to handle this scenario?

We have left the inventory routes for you to try on your own; think about what needs to happen for each CRUD type, and use what we've implemented for warehouses as a template!

As a side note, even though REST APIs have [best practices](https://restfulapi.net/http-methods/) associated with the response types and response codes (ie: shape of content we get back for our request and the status code) for all HTTP verbs, they are just a prescription and not a hard rule, so always rely on specific API documentation to know what to send as body of the request and what to expect back as a response from the endpoints.
