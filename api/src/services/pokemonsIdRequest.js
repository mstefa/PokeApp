const axios = require('axios').default;
const { Op } = require("sequelize");
const { Pokemon, Type, TypePokemon, conn } = require('../db.js');

//We request the pokemon, starting from the API data, and then from DB. 
async function getPokemonsALL(offset, limit, completeInfo, type, personalized) {
  offset = parseInt(offset)
  limit = parseInt(limit)
  
  try{
    // Look for the pokemons on the API
    let {isNext, pokemons : pokeApi} = await getPokemonsAPI(offset, limit, completeInfo)
    let pokeDB;
    //If the response from API reach the number of pokemons required, it send that information
    //Else start serching on the DB
    if(pokeApi.length === limit){
      return pokeApi;
    }else{
      let endId = offset + limit - pokeApi.length + 9103;   // there is on the API a gap of 9103
      let startId = offset + 9103;   
      try{
        pokeDB = await Pokemon.findAll({
          include:[{
            model: Type,
            attributes: ['id', 'name'],
          }],
          attributes: ['id', 'name',  'personalized', 'img' ],
          where:{
            id: {[Op.between]:[startId, endId ]}
          }
        },
        )
        return pokeApi.concat(pokeDB);
      }
      catch(error){
        console.error(error);
      }
    }
  }
  catch(error){
    console.log(error)
  }
}

//**************************************     APIs Request     *********************************************************/

// Request the name and URL of each pokemon, the call a funtion to get de the Detail Information
async function getPokemonsAPI(offset, limit, isComplete) {
  // define the url to ask the request defining the offset (the first id of the list of pokemons) 
  //and the number of pokemons it should response
  let url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}%22`  
  let response;
  // ask to the API. It response only with a list of name, ids and the url where should ask for more information about this pokemon
  try{
    response = await axios.get(url);
  }
  catch(error){
    console.error(error);
  }
  // check is there are more pokemons on the API list. 
  let isNext = !!response.data.next;
  // get the list of pokemons and create an array where to save the detail information
  let pokemonsData = response.data.results;
  let pokemons = []
  // for each pokemon ask for detail information. 
  for(let i=0; i < pokemonsData.length; i++){
    element = pokemonsData[i];
    url = element.url;
    // we push the object with all data about one pokemon into pokemons array. 
    pokemons.push(getPokemonDetailAPI(url, isComplete))
  }
  pokemons = await Promise.all(pokemons)

  return {isNext, pokemons}

}

async function getPokemonDetailAPI(url, isComplete) {
  //ask the api for the infomation about one pokemon (url can ask for pokemon id or pokemon name)
  try{
    response = await axios.get(url); 
  }
  catch(error){
    console.log('Error reading a pokemon object')
    console.error(error);
    throw new TypeError('404:PokemonNotFound')
  }
  // types are in an array, we only extrat the needed info
  let pokeTypes = []

  response.data.types.forEach( function(e){

    let id = parseInt(e.type.url.match(/\/[0-9]+/)[0].slice(1)); // get id of type
    pokeTypes.push({
      id,
      name: e.type.name,
    });

  })
  //Check if the response should includes all data or only basic information
  if(isComplete){
    return( {
      name: response.data.name,
      life: response.data.stats[0].base_stat, // hp
      strength:response.data.stats[1].base_stat, // atack
      defense:response.data.stats[2].base_stat,
      speed:response.data.stats[5].base_stat,
      height:response.data.height,
      weight:response.data.weight,
      personalized: false,
      img: response.data.sprites.other.dream_world.front_default || response.data.sprites.front_default || response.data.sprites.other['official-artwork'].front_default, 
      id:response.data.id,  // the id force to keep the correlation because it is now which id has each pokemon by the fans
      types: pokeTypes,
    });
  }else{
    return( {
      name: response.data.name,
      life: response.data.stats[0].base_stat, // hp
      personalized: false,
      img: response.data.sprites.other.dream_world.front_default || response.data.sprites.front_default || response.data.sprites.other['official-artwork'].front_default, 
      id:response.data.id,  // the id force to keep the correlation because it is now which id has each pokemon by the fans
      types: pokeTypes,
    });
  }
}

//**************************************     DBs Request     *********************************************************/

async function getPokemonByName(name) {
  let pokemon = await Pokemon.findAll({
    attributes: ['id', 'name',  'personalized', 'img', 'life', 'strength', 'defense', 'speed', 'height', 'weight'],
    where:{
      name: name
    }
  },
  )
  return pokemon;
}

async function getPokemonById(id) {
  let pokemon = await Pokemon.findAll({
    attributes: ['id', 'name',  'personalized', 'img', 'life', 'strength', 'defense', 'speed', 'height', 'weight'],
    where:{
      id: id
    },
    include:[{
      model: Type,
      attributes: ['id', 'name'],
    }],
  },
  )
  return pokemon;
}

async function savePokemon(data, id, count){
  id = parseInt(id) + 1;
  count = parseInt(count)

  try{
    let pokemon = await Pokemon.create({
      name: data.name,
      life: data.life, 
      strength: data.strength,
      defense: data.defense,
      speed: data.speed,
      height:data.height,
      weight:data.weight,
      personalized: true,
      img: data.img,
      id: id,  // the id force to keep the correlation because it is now which id has each pokemon by the fans
    })
    for (let i=0; i < data.types.length; i++) {  // agrega en la tabla intermedia las relaciones
      await pokemon.addTypes(data.types[i].id)
    };
    count++;
    return {id, count}
  }
  catch(error){
    console.log(error)
    return{id:'Error', count: count}
  }
}

module.exports = {
  getPokemonByName,
  getPokemonById,
  getPokemonDetailAPI,
  getPokemonsALL,
  savePokemon
}