import { When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import supertest from 'supertest';
import { createApp } from '../../src/app';

const app = createApp();
const request = supertest(app);

let response: supertest.Response;

When('I send a GET request to {string}', async function (path: string) {
  response = await request.get(path);
});

Then('the response status code should be {int}', function (status: number) {
  expect(response.status).to.equal(status);
});

Then('the response body should contain status {string}', function (status: string) {
  expect(response.body).to.have.property('status');
  expect(response.body.status).to.equal(status);
});

Then('the response should contain a list of pokemons', function () {
  expect(response.body).to.have.property('pokemons');
  expect(response.body.pokemons).to.be.an('array');
});

Then('the list size should be {int}', function (size: number) {
  expect(response.body.pokemons.length).to.equal(size);
});

Then('the response body should contain name {string}', function (name: string) {
  expect(response.body).to.have.property('name');
  expect(response.body.name).to.equal(name);
});

Then('the response body should contain type {string}', function (type: string) {
  expect(response.body).to.have.property('types');
  expect(response.body.types).to.be.an('array');
  const typeNames = response.body.types.map((t: any) => t.name.toLowerCase());
  expect(typeNames).to.include(type.toLowerCase());
});

When('I send a POST request to {string} with body:', async function (path: string, bodyString: string) {
  const body = JSON.parse(bodyString);
  response = await request.post(path).send(body);
});

Then('the response should contain validation error for field {string}', function (field: string) {
  expect(response.body).to.have.property('details');
  expect(response.body.details).to.be.an('array');
  const fields = response.body.details.map((e: any) => e.field);
  expect(fields).to.include(field);
});
