Feature: Pokemons API Management
  As an API client
  I want to interact with the Pokemons API
  So that I can verify health, fetch lists with pagination, search details, and validate creations.

  Scenario: Verify API Health Status
    When I send a GET request to "/health"
    Then the response status code should be 200
    And the response body should contain status "ok"

  Scenario: Get Pokemons List with Custom Pagination
    When I send a GET request to "/pokemons?limit=5&offset=0"
    Then the response status code should be 200
    And the response should contain a list of pokemons
    And the list size should be 5

  Scenario: Get Pokemon Details for Pikachu
    When I send a GET request to "/pokemons/search?name=pikachu"
    Then the response status code should be 200
    And the response body should contain name "pikachu"
    And the response body should contain type "electric"

  Scenario: Create Pokemon Validations - Missing Name
    When I send a POST request to "/pokemons" with body:
      """
      {
        "life": 100,
        "strength": 80,
        "defense": 70,
        "types": [{"id": 10, "name": "fire"}]
      }
      """
    Then the response status code should be 400
    And the response should contain validation error for field "name"

  Scenario: Create Pokemon Validations - Invalid Stat Value
    When I send a POST request to "/pokemons" with body:
      """
      {
        "name": "superchar",
        "life": 300,
        "strength": 80,
        "defense": 70,
        "types": [{"id": 10, "name": "fire"}]
      }
      """
    Then the response status code should be 400
    And the response should contain validation error for field "life"
