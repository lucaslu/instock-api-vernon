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
