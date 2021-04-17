import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { getPokemons, getTypes } from '../actions';
import Pokemon from './Pokemon';
import Pagination from './Pagination';
import Styles from './Pokemons.module.css';
import SearchBar from './SearchBar';
import loading from '../resurces/loading.gif'

export function Pokemons(props) {

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12);
  let indexOfFirstPost = 0;

  // Change page
  const paginate = pageNumber => {
    setCurrentPage(pageNumber);
    indexOfFirstPost = (pageNumber - 1)* postsPerPage;
    props.getPokemons(indexOfFirstPost,postsPerPage)
  };
  
  useEffect(() => {

    if( props.pokemons.length < 1){  
      props.getPokemons(0,12)
    }

    if(props.types.length < 1){
      props.getTypes()
    }
    },[props])

  if(props.pokemons.length > 0){
    return (
      <div id="PokemonsComponent" >
        <SearchBar/>
        <div className={Styles.container}>
          {props.pokemons.map(function(e){
            if((props.isFilterByPersonalization && e.personalized) || !props.isFilterByPersonalization){
              if(props.isFilterByType !== 'all' ){
                if(e.types.find(type => type.name === props.isFilterByType )){
                  return <Pokemon key = {e.id} name = {e.name} id = {e.id} 
                  img = {e.img || null } types = {e.types || null } personalized = {e.personalized}
                  />
                }
              }else{
                return <Pokemon key = {e.id} name = {e.name} id = {e.id} 
              img = {e.img || null } types = {e.types || null } personalized = {e.personalized}
              />
              }
            } 
            return <></>
            
          })}
        </div>
        <div className={Styles.pagination}>
        <Pagination 
          postsPerPage={postsPerPage}
          totalPosts={props.totalPosts}
          paginate={paginate}
          currentPage = {currentPage}
        />
        </div>
      </div>
    )
  }else{
    return(
      // eslint-disable-next-line jsx-a11y/aria-props
      // eslint-disable-next-line jsx-a11y/aria-role
      <div role="PokemonsComponent" className={Styles.loadingImg}>
        <img className={Styles.img} src = {loading} alt = 'Loading' label = 'Loading' />
        Loading... 
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    pokemons: state.pokemonsLoaded,
    totalPosts: state.pokemonsCount,
    isFilterByPersonalization: state.isFilterByPersonalization,
    isFilterByType: state.isFilterByType,
    types : state.pokemonsTypes,
  }
}

export default connect(mapStateToProps, {getPokemons, getTypes}) (Pokemons);