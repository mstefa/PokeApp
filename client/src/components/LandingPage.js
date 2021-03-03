import React from 'react'
import { NavLink } from 'react-router-dom';
import imgbutton from '../resurces/atrapalosya.png'
import Styles from './LandingPage.module.css';

export default function LandingPage() {
  return (
    <div className={Styles.container}> 
        <p className={Styles.text}> Bienvenidos! </p>
        <NavLink exact to="/home" >
          <img label="enterImage" src={imgbutton} className={Styles.img} alt="enterImage" />
        </NavLink>
    </div>
  )
}
