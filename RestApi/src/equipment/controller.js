const pool = require("../../db/db");
const queries = require("../equipment/queries");
const getEquipments = (req, res) => {
  pool.query(queries.getEquipments, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};
const getEquipmentById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getEquipmentById, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};
// const addEquipments = (req, res) => {
//   const {
//     equipment_name,
//     equipment_picture,
//     rent_price,
//     verification,
//     location,
//     description,
//     category,
//     type,
//     availability_status,
//   } = req.body;

//   // check if equipment name exists
//   pool.query(queries.checkNameExists, [equipment_name], (error, results) => {
//     if (results.rows.length) {
//       res.send("equipment is Already exists");
//     }
//   });
//   //   // add equipments to db
//   pool.query(queries.addEquipments,[equipment_name, equipment_picture ,rent_price,verification ,  location, description,category, type,availability_status],(error, results)=> {if (error) throw error;
//      res.status(201).send("Equipments Created Succssfully!");
//   })
// };
const addEquipments = (req, res) => {
  const {equipment_id,
    equipment_name,
    equipment_picture,
    rent_price,
    verification,
    location,
    description,
    category,
    type,
    availability_status,
  } = req.body;

  // Check if equipment name exists
  pool.query(queries.checkNameExists, [equipment_id], (error, results) => {
    if (error) {
      throw error;
    }

    if (results.rows.length) {
      res.status(400).send("Equipment already exists");
    } else {
      // Add equipment to the database
      pool.query(
        queries.addEquipments,
        [equipment_id,
          equipment_name||nUll,
          equipment_picture || null,
          rent_price || null,
          verification || null,
          location || null,
          description || null,
          category || null,
          type || null,
          availability_status || null,
        ],
        (error, results) => {
          if (error) {
            throw error;
          }
          res.status(201).send("Equipment created successfully!");
        }
      );
    }
  });
};

 const deleteEquipments= (req, res) => {
  const id=parseInt(req.params.id);
  pool.query(queries.getEquipmentById,[id] ,(error, results) => {const noEquipmentFound=!results.rows.length;
      if (noEquipmentFound){ res.send(" the Equipment does not exist in the database. so, you could not remove ! ");}

  });
   pool.query(queries.deleteEquipments,[id] ,(error, results) => {
    if (error) throw error;
     res.status(201).send("Equipments deleted Succssfully!");

  });

};
// const updateEquipments=(req,res)=>{ const id=parseInt(req.params.id);
//   const {equipment_name, equipment_picture ,rent_price,verification ,  location, description,category, type,availability_status }= req.body;
//   pool.query(queries.getEquipmentById,[id],(error, results) =>{ const noEquipmentFound=!results.rows.length;
//     if (noEquipmentFound){ res.send(" the Equipment does not exist in the database. so, you could not remove ! ");} });
//    pool.query(queries.updateEquipments,[equipment_name, equipment_picture ,rent_price,verification ,  location, description,category, type,availability_status,id ],(error, results) => {
//     if (error) throw error;
//      res.status(201).send("Equipments updated Succssfully!");

//   })
// }
const updateEquipments = (req, res) => {
  const id = parseInt(req.params.id);
  const { equipment_name, equipment_picture, rent_price, verification, location, description, category, type, availability_status } = req.body;
  
  pool.query(queries.getEquipmentById, [id], (error, results) => {
    if (error) {
      throw error;
    }

    const noEquipmentFound = !results.rows.length;

    if (noEquipmentFound) {
      res.status(404).send("The equipment does not exist in the database.");
    } else {
      pool.query(
        queries.updateEquipments,
        [equipment_name, equipment_picture, rent_price, verification, location, description, category, type, availability_status, id],
        (error, results) => {
          if (error) {
            throw error;
          }

          res.status(201).send("Equipment updated successfully!");
        }
      );
    }
  });
};

module.exports = {
  getEquipments,
  getEquipmentById,
  addEquipments,
  deleteEquipments,
  updateEquipments
};
