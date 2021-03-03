const express = require('express');
const router = express.Router();
// const { populatePokemons } = require('../services/populateDB')
const { Pokemon} = require('../db.js');
const {getPokemonDetailAPI, getPokemonsALL, getPokemonByName, getPokemonById, savePokemon} = require('../services/pokemonsIdRequest')
let countAPIPokemons = 1118;
let countDBPokemons = 0;
let countTotalPokemons = countAPIPokemons;
let lastId = 10220;


Pokemon.count({})
.then(size => {
  countDBPokemons = size;
  countTotalPokemons = countAPIPokemons + size;
  lastId = lastId + size;
})

router.get('/', async function (req, res) {
  let {offset, limit} = req.query;

  try{
    let info = await getPokemonsALL(offset, limit, false);
    res.json({count:countTotalPokemons, pokemons: info})
  }
  catch(error){
    console.log(error)
    res.status(500).json(error)
  }

});

// query by name---------------------------------
router.get('/search/', async function (req, res) {
  let name = req.query.name;
  try{
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`
    let info = await getPokemonDetailAPI(url, true);
    res.json(info.id)
  }  
  catch(error){
    if(error.message == '404:PokemonNotFound'){
      
      try{
        let info = await getPokemonByName(name);
        // console.log(info[0].id)
        res.json(info[0].id)
      }
      catch(error){
        console.log(error)
        res.status(404).json({error: 'Pokemon no encontrado'})
      }  
    }else{
      console.log(error)
      res.status(404).json(error)
    }

  }
});

router.get('/:id', async function (req, res) {
  let id = req.params.id;
  try{
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`
    let info = await getPokemonDetailAPI(url, true);
    res.json(info)
  }  
  catch(error){
    if(error.message == '404:PokemonNotFound'){
      
      try{
        let info = await getPokemonById(id);
        // console.log(info[0].id)
        res.json(info[0])
      }
      catch(error){
        console.log(error)
        res.status(404).json({error: 'Pokemon no encontrado'})
      }  
    }else{
      console.log(error)
      res.status(404).json(error)
    }
  };
});

router.post('/', async function (req, res) {
  let data = req.body;
  // console.log(data)
  try{
    let info = await savePokemon(data, lastId)
    if(info.id !== 'Error'){
      console.log(info.id)
      lastId = info.id;
      countDBPokemons ++
      console.log(lastId)
      countTotalPokemons = countAPIPokemons + countDBPokemons;
      res.json('Your pokemon was correctly added. His Id is #' + info.id)
    }else{
      res.json('An error occurred. Please check if the data is correct')
    }

  }
  catch(error){
    console.log('Se produjo un error')
    // console.log(error)
    res.status(500).json(error)
  }
  
});

module.exports = router;