import React from 'react'
import { Link } from 'react-router-dom';
import Styles from './Pokemon.module.css';

export default function Pokemon({id, name, img, personalized, types }) {
  return (
    <div className={Styles.container}>
      <Link to={`/pokemon/${id}`}>
        <div>
          <img className={Styles.img} src = {img} alt = 'Pokemon' />
        </div>
        <p className={Styles.name}>{name}</p>
        <p className={Styles.number}> # {id}</p>
        {types && types.map((t)=>
          <span className={Styles.type}>{t.name}</span>
        )}
      </Link>
    </div>
  )
}
