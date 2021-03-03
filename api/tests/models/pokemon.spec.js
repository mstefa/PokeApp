const { Pokemon, Type, conn } = require('../../src/db.js');
const { expect } = require('chai');

describe('Pokemon model', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  describe('Validators', () => {
    beforeEach(() => Pokemon.sync({ force: true }));
    // describe('name', () => {
      it('should throw an error if name is null', (done) => {
        Pokemon.create({})
          .then(() => done(new Error('It requires a valid name')))
          .catch(() => done());
      });
      it('should work when its a valid name', () => {
        pokemon = Pokemon.build({ name: 'IAMPikachu' }); // build crea una instancia de la class model. Para guardar en db habia que llamar el metodo save. 
        expect(pokemon.name).to.be.equal('IAMPikachu')
      });
      it('should recibe al stadistics of a pokemon', () => {
        Pokemon.create({
          name: 'MyPokemon1',
          life: 45,
          strength: 22,
          defense: 22,
          speed: 444,
          height: 7,
          weight: 10
        });
      });
      it('life should be integer', (done) => {
        Pokemon.create({
          name: 'MyPokemon2',
          life: 45.2,
          strength: 22,
          defense: 22,
          speed: 444,
          height: 7,
          weight: 10
        })
        .then(() => done('Should no accept a real number'))
        .catch(() => done());
      });
      it('strength should be integer', (done) => {
        Pokemon.create({
          name: 'MyPokemon3',
          life: 45,
          strength: 22.2,
          defense: 22,
          speed: 444,
          height: 7,
          weight: 10
        })
        .then(() => done('Should no accept a real number'))
        .catch(() => done());
      });
      it('defense should be integer', (done) => {
        Pokemon.create({
          name: 'MyPokemon4',
          life: 45,
          strength: 22,
          defense: 22.2,
          speed: 444,
          height: 7,
          weight: 10
        })
        .then(() => done('Should no accept a real number'))
        .catch(() => done());
      });  
      it('speed should be integer', (done) => {
        Pokemon.create({
          name: 'MyPokemon5',
          life: 45,
          strength: 22,
          defense: 22,
          speed: true,
          height: 7,
          weight: 10
        })
        .then(() => done('Should no accept a boolean'))
        .catch(() => done());
      });
      it('height should be integer', (done) => {
        Pokemon.create({
          name: 'MyPokemon6',
          life: 45,
          strength: 22,
          defense: 22,
          speed: 444,
          height: 'es muy alto',
          weight: 10
        })
        .then(() => done('Should no accept a string'))
        .catch(() => done());
      });
      it('weight should be integer', (done) => {
        Pokemon.create({
          name: 'MyPokemon6',
          life: 45,
          strength: 22,
          defense: 22,
          speed: 444,
          height: 7,
          weight: 10.2
        })
        .then(() => done('Should no accept a real number'))
        .catch(() => done());
      });
      it('img should only accept an image link', (done) => {
        Pokemon.create({
          name: 'MyPokemon7',
          life: 45,
          strength: 22,
          defense: 22,
          speed: 444,
          height: 7,
          weight: 10,
          img: 'not a valid url'
        })
        .then(() => done('Should only accept a valid'))
        .catch(() => done());
      });
      it('should accept all properties', () => {
        return Pokemon.create({
          name: 'MyPokemon8',
          life: 45,
          strength: 22,
          defense: 22,
          speed: 444,
          height: 7,
          weight: 10,
          personalized : true,
          img: 'https://i2.wp.com/islademonos.com/wp-content/uploads/2020/03/pokemon-primera-genreacion.png?resize=870%2C600&ssl=1'
        })
        .then(pokemon => {
          expect(
            { name: pokemon.name,
              life: pokemon.life,
              strength: pokemon.strength,
              defense: pokemon.defense,
              speed: pokemon.speed,
              height: pokemon.height,
              weight:pokemon.weight,
              personalized: pokemon.personalized,
              img: pokemon.img
            }
            ).to.deep.equal({
            name: 'MyPokemon8',
            life: 45,
            strength: 22,
            defense: 22,
            speed: 444,
            height: 7,
            weight: 10,
            personalized : true,
            img: 'https://i2.wp.com/islademonos.com/wp-content/uploads/2020/03/pokemon-primera-genreacion.png?resize=870%2C600&ssl=1'
          });
        });
      });
    });
  });
// });

describe('Type model', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  describe('Validators', () => {
    beforeEach(() => Type.sync({ force: true }));
    describe('name', () => {
      it('should throw an error if name is null', (done) => {
        Type.create({})
          .then(() => done(new Error('It requires a valid name')))
          .catch(() => done());
      });
      it('should work when its a valid name', () => {
        type = Type.build({ name: 'water' });  // build crea una instancia de la class model. Para guardar en db habia que llamar el metodo save. 
        expect(type.name).to.be.equal('water')
      });
      it('should work when its a valid name', () => {
        Type.create({ name: 'water' }); // Create es el shortcut de build + save
      });
    });
  });
});



// await Pokemon.drop();
// console.log("Pokemons table dropped!");

// await Type.drop();
// console.log("Types table dropped!");