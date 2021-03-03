const { Pokemon, Type, TypePokemon, conn } = require('../db.js');
const {getPokemonDetailAPI} = require('./pokemonsIdRequest')
const axios = require('axios').default;
const { Op } = require("sequelize");


//Get the information of all types from PokeApi and save it on the DB

async function populateTypes() {
  let url = 'https://pokeapi.co/api/v2/type'  // limit should be at least 1200
  let response;

  // await Type.sync({ force: true });        // drop tables an create new ones. 

  try{
    response = await axios.get(url);
  }
  catch(error){
    console.error(error);
  }
  let types = response.data.results;

  types.forEach( async function(e) {
    url = e.url;
    let id = parseInt(url.match(/\/[0-9]+/)[0].slice(1)); // get id of type
    try{
      let type = await Type.findOrCreate({
        where: {id: id, // force id to be equal as in the API
        name: e.name} 
      });
    }
    catch(error){
    console.log(error)
    }
    });
    console.log('Types Loaded!') 
    return types;
}

//Get the information of all Pokemons from PokeApi and save it on the DB 

async function populatePokemons() {
  let url = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=100'  // limit should be at least 1118
  let response;

  // await Pokemon.sync({ force: true });     // drop tables an create new ones.  
  // await TypePokemon.sync({ force: true }); // drop tables an create new ones.
  try{
    response = await axios.get(url);
    let pokemons = response.data.results;

    pokemons.forEach( async function(element) {
      url = element.url;
      try{
        response = await axios.get(url);
        let pokeTypes = []
  
        response.data.types.forEach( function(e){
    
          let id = parseInt(e.type.url.match(/\/[0-9]+/)[0].slice(1)); // get id of type
          pokeTypes.push(id);
    
        })
        
        let pokemon = await Pokemon.create({
          name: element.name,
          // life: response.data.stats[0].base_stat, // hp
          // strength:response.data.stats[1].base_stat, // atack
          // defense:response.data.stats[2].base_stat,
          // speed:response.data.stats[5].base_stat,
          // height:response.data.height,
          // weight:response.data.weight,
          personalized: false,
          img:response.data.sprites.other.dream_world.front_default,
          id:response.data.id,  // the id force to keep the correlation because it is now which id has each pokemon by the fans
        })
        pokemon.addTypes(pokeTypes)
      }
      catch(error){
        console.log('Error reading a pokemon object')
        console.error(error);
      }
  

    });
    console.log('Pokemons Loaded!')
  }
  catch(error){
    console.error(error);
  }

}





module.exports = {
  populateTypes,
  populatePokemons
}