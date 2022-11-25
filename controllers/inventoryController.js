const knex = require("knex")(require("../knexfile"));

exports.index = (_req, res) => {
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
      .then((data)=>{
        res
          .status(200)
          .json(data);
      })
    })
    .catch((err) =>
      res.status(400).send(`Error deleting item ${req.params.id} ${err}`)
    );
};
