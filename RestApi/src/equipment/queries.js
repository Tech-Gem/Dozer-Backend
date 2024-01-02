const getEquipments = "SELECT * FROM equipment";
const getEquipmentById = "SELECT * FROM equipment  WHERE equipment_id= $1";
 const checkNameExists='SELECT e FROM equipment e WHERE e."equipment_id" = $1';
  const addEquipments = 'INSERT INTO equipment ( equipment_id,equipment_name, equipment_picture, rent_price, verification, location, description, category, type, availability_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10)';
const deleteEquipments="DELETE FROM equipment WHERE   equipment_id= $1";
// const updateEquipments="UPDATE equipment SET equipment_name= $1,equipment_picture=$2,rent_price=$3,verification=$4,location=$5,description=$6,category=$7,type=&8,availability_status=&9 WHERE equipment_id=&2";
const updateEquipments = "UPDATE equipment SET equipment_name = $1, equipment_picture = $2, rent_price = $3, verification = $4, location = $5, description = $6, category = $7, type = $8, availability_status = $9 WHERE equipment_id = $10";
module.exports = {
  getEquipments,
  getEquipmentById,
  checkNameExists,
  addEquipments,
  deleteEquipments
  ,updateEquipments



};
