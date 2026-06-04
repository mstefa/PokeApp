import React from 'react';
import Button from './ui/Button';
import Icon from './ui/Icon';
import Styles from './Navbar.module.css';

export default function NavBar() {
  return (
    <header className={Styles.navbar}>
      <div className={Styles.logoContainer}>
        <a href="/home" className={Styles.logoLink}>
          <img
            src="/resources/pickachuLogo.png"
            width="36"
            height="36"
            alt="logo"
            className={Styles.logoImg}
          />
          <span className={Styles.logoText}>PokeApp</span>
        </a>
      </div>
      <nav className={Styles.nav}>
        <div className={Styles.navLinks}>
          <a href="/home" className={Styles.navLink}>
            <Button variant="secondary" className={Styles.navButton}>
              <Icon name="pokedex" size={18} />
              <span>Home</span>
            </Button>
          </a>
          <a href="/create" className={Styles.navLink}>
            <Button variant="primary" className={Styles.navButton}>
              <Icon name="arena" size={18} />
              <span>Crea tu Pokémon</span>
            </Button>
          </a>
        </div>
      </nav>
    </header>
  );
}
