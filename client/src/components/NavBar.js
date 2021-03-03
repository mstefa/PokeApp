import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../resurces/pickachuLogo.png'
import Styles from './Navbar.module.css';


export default function NavBar() {
    return (
        <header className={Styles.navbar}>
            <div className={Styles.imgConteiner}>
              <NavLink exact to="/home" >
                <img label="logoPokemon" src={Logo} width="40" height="40" className="d-inline-block align-top" alt="logoPokemon" />
              </NavLink>
            </div>
            <nav>
                <ul className={Styles.list}>
                    <li className={Styles.listItem}>
                        <NavLink exact to="/home" >Home</NavLink>
                        <NavLink to="/create">Crea tu pokemon</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}