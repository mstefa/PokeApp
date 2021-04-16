const express = require('express');
const router = express.Router();
const {populateTypes} = require('../services/populateDB')
const {getTypes} = require('../services/typesRequest')



router.get('/', async function (req, res) {
  // let {offset, limit} = req.body;
  let info;
  try{

    info = await getTypes();
    if(info.length < 1){
      // console.log('entro')
      await populateTypes();  // get all types from API and save it on DB
      info = await getTypes();
    }
    res.json(info)
  }
  catch(error){
    console.log(error);
    res.status(500).json(error)
  }
});

module.exports = router;