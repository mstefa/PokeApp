import React from 'react';
import Styles from './Navbar.module.css';

export default function NavBar() {
  return (
    <header className={Styles.navbar}>
      <div className={Styles.imgConteiner}>
        <a href="/home">
          <img
            label="logoPokemon"
            src="/resources/pickachuLogo.png"
            width="40"
            height="40"
            className="d-inline-block align-top"
            alt="logoPokemon"
          />
        </a>
      </div>
      <nav>
        <ul className={Styles.list}>
          <li className={Styles.listItem}>
            <a href="/home">Home</a>
            <a href="/create">Crea tu pokemon</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
