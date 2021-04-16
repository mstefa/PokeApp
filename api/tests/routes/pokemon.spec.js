const { Pokemon, Type, conn } = require('../../src/db.js');
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');

const agent = session(app);
const pokemon = {
  name: 'Pikachu',
};

describe('Pokemon routes', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));
  beforeEach(() => Pokemon.sync({ force: true })
    .then(() => Pokemon.create(pokemon)));
  describe('GET /pokemons', () => {
    it('should get 200', () =>
      agent.get('/pokemons/?offset=0&limit=12')
      .expect(200)
      .expect(function(res) {
        expect(res.body.pokemons).to.have.length(12);
      })
    );
  });
});

let type = {id: 9999, name: 'TestType'}
describe('Types routes', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));
  beforeEach(() => Type.sync({ force: true })
    .then(() => Type.create(type)));
  describe('GET /Types', () => {
    it('should get 200', () =>
      agent.get('/types')
      .expect(200)
      .expect(function(res) {
        // console.log(res.body)
        expect(res.body[0].name).to.eql(type.name);
      })
    );
  });
});
