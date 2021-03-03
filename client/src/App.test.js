// For this project it was decided to use Testing-Library instead of enzyme (what were used on the CP)
//Small list of main methods
//getByText function accepts a string as input.  but also a regular expression, and throws an error by default if the element cannot be found
//getByRole: it shows all the selectable roles if you provide a role that isn't available in the rendered component's HTML
//queryBy: So every time you are asserting that an element isn't there
//For any element that isn't there yet but will be there eventually, use findBy over getBy or queryBy (await)


import { render, screen } from '@testing-library/react'; // Testing utility for React like enzyme but from a users perpective
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'

import App from './App';

test('Render the app', () => {
  render(<App />);
  // verify page content for expected route
  // screen.debug();
  const linkElement = screen.getByText(/Bienvenidos/i);
  expect(linkElement).toBeInTheDocument();
});

test('full app rendering/navigating: Entering logo', async () => {
  const history = createMemoryHistory()
  render(
    <Router history={history}>
      <App />
    </Router>
  )
  // Simulate a click on the image to continue to home
  const leftClick = { button: 0 };
  userEvent.click(screen.getByRole('img', {name:/enterImage/i}), leftClick)
  
  // check that the content changed to the new page
  screen.debug();
  expect( screen.getByText(/Loading/)).toBeInTheDocument()
  expect( screen.getByRole(/PokemonsComponent/i)).toBeInTheDocument()

})


test('full app rendering/navigating: Create Pokemon', () => {
  const history = createMemoryHistory()
  render(
    <Router history={history}>
      <App />
    </Router>
  )
  
  // Simulate a click on "Create Pokemon" to continue to home
  const leftClick = { button: 0 }
  userEvent.click(screen.getByText(/Create tu pokemon/), leftClick)
  // check that the content changed to the new page
  expect(screen.getByText(/Cual es el nombre de tu pokemon/i)).toBeInTheDocument()
})

test('full app rendering/navigating: Home', async () => {
  const history = createMemoryHistory()
  render(
    <Router history={history}>
      <App />
    </Router>
  )
 // Simulate a click on "Home" to continue to home
  const leftClick = { button: 0 };
  userEvent.click(screen.getByText(/Home/i), leftClick)
  
  // check that the content changed to the new page
  // expect(await screen.findAllByTestId('Pokemon')).toHaveLength(12)
  screen.debug();
  expect( screen.getByText(/Loading/)).toBeInTheDocument()
  expect( screen.getByRole(/PokemonsComponent/i)).toBeInTheDocument()
  // expect(await screen.findByText(/poison/i)).toBeInTheDocument()

})

test('full app rendering/navigating: Icon', async () => {
  const history = createMemoryHistory()
  render(
    <Router history={history}>
      <App />
    </Router>
  )
  // Simulate a click on the pikachu icon to continue to home
  const leftClick = { button: 0 };
  userEvent.click(screen.getByRole('img', {name:/logoPokemon/i}), leftClick)
  
  // check that the content changed to the new page
  screen.debug();
  expect( screen.getByText(/Loading/)).toBeInTheDocument()
  expect( screen.getByRole(/PokemonsComponent/i)).toBeInTheDocument()

})
