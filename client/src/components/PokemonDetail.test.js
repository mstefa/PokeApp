import React from 'react';
import { configure, mount, shallow } from 'enzyme'; // Testing utility for React
import Adapter from 'enzyme-adapter-react-16';
import configureStore from "redux-mock-store"; //this library is designed to test the action-related logic, not the reducer-related one. In other words, it does not update the Redux store
import PokemonDetail from './PokemonDetail';


configure({adapter: new Adapter()});

xdescribe('Component Test', () => {

  xdescribe('<PokemonDetail />', () => {
    let wrapper;
    let store;
    const match = {params: {id: 1}, isExact: true, path: "/pokemon/:id", url: "/pokemon/1"};
    const pokemons = [
      {
        id: 1,
        name:"Pokemon 1",
        life: 1, 
        strength: 1,
        defense: 1,
        speed:1,
        height:1,
        weight:1,
        personalized: false,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/10.svg",
        types: [{id:13, name: 'electric'}, {id:14, name: 'psychic'},]
      },
      {
        id: 2,
        name:"Pokemon 2",
        life: 2, 
        strength: 2,
        defense: 2,
        speed:2,
        height:2,
        weight:2,
        personalized: false,
        img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/20.svg",
        types: [{id:13, name: 'electric'}, {id:14, name: 'psychic'},]
      }
    ]
    beforeEach(() => {
      const mockStore = configureStore([]);
      store = mockStore(PokemonDetail);  // Initialize mockstore with empty state
      wrapper =  shallow (<PokemonDetail  match={match} store={store} />)  //reder the component shallow or mount (as in the browser)
      store.clearActions();
    })
    
    it('deberia recibir por props el objeto ´match´, utilizar el id de `params` para filtrar el ´todo´ que coincida con ese ´id´ y renderizar los detalles de ese todo', () => {
      // Ten en cuenta que tendras que conectar el componente con el store para traer los `todos` del store y asi poder filtrar el `todo` correcto
      // Lo que se esta testeando aca, es que el componente renderice los detalles del todo correctamente,
      // no la estructura del componente asi que eres libre de diseñar la estructura, siempre y cuando se muestren los datos del todo.
      const todo = pokemons[0];
      expect(wrapper.contains(todo.name)).toEqual(true)
      // expect(wrapper.contains(todo.description)).toEqual(true)
      // expect(wrapper.contains(todo.place)).toEqual(true)
      // expect(wrapper.contains(todo.date)).toEqual(true)
    })
    
    xit('deberia renderizar un "h1" que contenga el texto "No hay todo." si no existe un ´todo´ especifico que corresponda con el id de `params`', () => {
      const match = {params: {id: 3}, isExact: true, path: "/edit/:id", url: "/edit/3"};
      const wrapper =  mount(<TodoDetail match={match} store={store} />)
      expect(wrapper.find('h1')).toHaveLength(1);
      expect(wrapper.find('h1').at(0).text()).toEqual('No hay todo.');
    });
    
    xit('deberia renderizar primero un `button` con el texto `Done` que al hacerle click hace un dispatch de la action `toDone`', () => {
      // El orden del boton aca es importante...
      expect(wrapper.find('button').at(0).text()).toEqual('Done');
      wrapper.find('button').at(0).simulate('click');
      const expectedAction = [{
        payload: 1,
        type: 'ToDone'
      }]
      expect(store.getActions()).toEqual(expectedAction);
    })
    
    xit('deberia renderizar segundo un `button` con el texto `In Progress` que al hacerle click hace un dispatch de la action `toInProgress`', () => {
      // El orden del boton aca es importante...
      expect(wrapper.find('button').at(1).text()).toEqual('In Progress');
      wrapper.find('button').at(1).simulate('click');
      const expectedAction = [{
        payload: 1,
        type: 'ToInProgress'
      }]
      expect(store.getActions()).toEqual(expectedAction);
    })
    
    xit('deberia renderizar tercero un `button` con el texto `Remove` que al hacerle click hace un dispatch de la action `removeTodo`', () => {
      // El orden del boton aca es importante...
      expect(wrapper.find('button').at(2).text()).toEqual('Remove');
      wrapper.find('button').at(2).simulate('click');
      const expectedAction = [{
        payload: 1,
        type: 'RemoveTodo'
      }]
      expect(store.getActions()).toEqual(expectedAction);
    })
    
  });
})