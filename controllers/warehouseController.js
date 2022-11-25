const { v4: uuidv4 } = require("uuid");

// This sends the id, warehouse name and contact name columns from Warehouses DB
const knex = require("knex")(require("../knexfile"));
exports.index = (_req, res) => {
  knex
    .from("warehouses")
    .select(
      "id",
      "warehouse_name",
      "contact_name",
      "address",
      "contact_phone",
      "contact_email",
      "city",
      "country"
    )
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving Warehouses: ${err}`)
    );
};

// This sends ALL info for a SINGLE warehouse

/**
 *
 *This controller method returns a single warehouse, building the SQL query `SELECT * FROM warehouse WHERE id=#`, where `#` is our parameter at `req.params.id`.
 */

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

/**
 * Grab the inventory of a single warehouse from a particluar warehouse id
 * /warehouses/28/inventories
 */

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

/** Add a new Warehouse /warehouses post */

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

/** Put request - update a single warehouse based on a single passed in ID */

exports.updateWarehouse = (req, res) => {
  knex("warehouses")
    .update({
      warehouse_name: req.body.warehouse_name || "",
      address: req.body.address || "",
      city: req.body.city || "",
      country: req.body.country || "",
      contact_name: req.body.contact_name || "",
      contact_position: req.body.contact_position || "",
      contact_phone: req.body.contact_phone || "",
      contact_email: req.body.contact_email || "",
    })
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

/**
 * INSERT PATCH end point and route!
 */
exports.patchWarehouse = (req, res) => {
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

/** Delete Warehouse by ID */

exports.deleteWarehouse = (req, res) => {
  knex("warehouses")
    .where({ id: req.params.id })
    .delete()
    .then(() => {
      // For DELETE response we can use 204 status code
      res.status(200).json({
        message: "warehouse deleted",
        id: req.params.id,
      });
    })
    .catch((err) =>
      res.status(400).send(`Error deleting Warehouse ${req.params.id} ${err}`)
    );
};
