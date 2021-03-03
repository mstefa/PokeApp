const {Type} = require('../db.js');

async function getTypes() {
  const data = await Type.findAll(
    {attributes: ['id', 'name']},
  );
  
  console.log((data))
  return data;
}


module.exports = {
  getTypes
}