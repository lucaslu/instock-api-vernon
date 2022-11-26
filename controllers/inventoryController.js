const { v4: uuidv4 } = require("uuid");

const knex = require("knex")(require("../knexfile"));
exports.index = (_req, res) => {
  knex("inventories")
    .join("warehouses", "warehouses.id", "=", "inventories.warehouse_id")
    .select(
      "warehouses.warehouse_name",
      "inventories.warehouse_id",
      "inventories.id",
      "inventories.category",
      "inventories.item_name",
      "inventories.status",
      "inventories.quantity"
    )
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving Inventories: ${err}`)
    );
};

exports.singleInventoryItem = (req, res) => {
  knex("inventories")
    .where({ id: req.params.id })
    .then((data) => {
      if (!data.length) {
        return res
          .status(404)
          .send(`Inventory with id: ${req.params.id} is not found`);
      }
      res.status(200).json(data[0]);
    })
    .catch((err) =>
      res
        .status(400)
        .send(`Error retrieving Inventorie ${req.params.id} ${err}`)
    );
};

/** Add a new Inventory Item */

exports.addInventoryItem = (req, res) => {
  // Validate the request body for required data
  if (
    // !req.body.warehouse_name ||
    !req.body.warehouse_id ||
    !req.body.item_name ||
    !req.body.description ||
    !req.body.category ||
    !req.body.status ||
    !req.body.quantity
  ) {
    return res
      .status(400)
      .send(
        "Please make sure to provide warehouse_name, item_name, description, category, status, and quantity"
      );
  }

  const newInventoryId = uuidv4();
  knex("inventories")
    .insert({ ...req.body, id: newInventoryId })
    .then((_data) => {
      knex("inventories")
        .where({ id: newInventoryId })
        .then((data) => {
          res.status(201).json(data[0]);
        });
    })
    .catch((err) =>
      res.status(400).send(`Error creating Inventory Item: ${err}`)
    );
};

/** Put request - update a single iventory item based on a single passed in ID */
exports.updateInventoryItem = (req, res) => {
  knex("inventories")
    .update({
      warehouse_name: req.body.warehouse_name || "",
      warehouse_id: req.body.warehouse_id || "",
      item_name: req.body.item_name || "",
      description: req.body.description || "",
      category: req.body.category || "",
      status: req.body.status || "",
      quantity: req.body.quantity || "",
    })
    .where({ id: req.params.id })
    .then((_data) => {
      knex("inventories")
        .where({ id: req.params.id })
        .then((data) => {
          res.status(200).json(data[0]);
        });
    })
    .catch((err) =>
      res
        .status(400)
        .send(`Error updating Inventory Item ${req.params.id} ${err}`)
    );
};

/**
 * INSERT PATCH end point and route!
 */
exports.patchInventoryItem = (req, res) => {
  knex("inventories")
    .update(req.body)
    .where({ id: req.params.id })
    .then((_data) => {
      knex("inventories")
        .where({ id: req.params.id })
        .then((data) => {
          res.status(200).json(data[0]);
        });
    })
    .catch((err) =>
      res
        .status(400)
        .send(`Error updating Inventory Item ${req.params.id} ${err}`)
    );
};

exports.deleteItem = (req, res) => {
  knex("inventories")
    .where({ id: req.params.id })
    .delete()
    .then(() => {
      knex("inventories")
        .join("warehouses", "warehouses.id", "=", "inventories.warehouse_id")
        .select(
          "warehouses.warehouse_name",
          "inventories.id",
          "inventories.item_name",
          "inventories.category",
          "inventories.status",
          "inventories.quantity"
        )
        .then((data) => {
          res.status(200).json(data);
        });
    })
    .catch((err) =>
      res.status(400).send(`Error deleting item ${req.params.id} ${err}`)
    );
};
