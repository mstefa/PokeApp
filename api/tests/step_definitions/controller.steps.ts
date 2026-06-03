import { When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import supertest from 'supertest';
import { createApp } from '../../src/app';

const app = createApp();
const request = supertest(app);

let response: supertest.Response;

When('I send a GET request to {string}', async function (path: string) {
  response = await request.get(path);
});

Then('the response status code should be {int}', function (status: number) {
  assert.strictEqual(response.status, status);
});

Then('the response body should contain status {string}', function (status: string) {
  assert.ok('status' in response.body);
  assert.strictEqual(response.body.status, status);
});

Then('the response should contain a list of pokemons', function () {
  assert.ok('pokemons' in response.body);
  assert.ok(Array.isArray(response.body.pokemons));
});

Then('the list size should be {int}', function (size: number) {
  assert.strictEqual(response.body.pokemons.length, size);
});

Then('the response body should contain name {string}', function (name: string) {
  assert.ok('name' in response.body);
  assert.strictEqual(response.body.name, name);
});

Then('the response body should contain type {string}', function (type: string) {
  assert.ok('types' in response.body);
  assert.ok(Array.isArray(response.body.types));
  const typeNames = response.body.types.map((t: any) => t.name.toLowerCase());
  assert.ok(typeNames.includes(type.toLowerCase()));
});

When('I send a POST request to {string} with body:', async function (path: string, bodyString: string) {
  const body = JSON.parse(bodyString);
  response = await request.post(path).send(body);
});

Then('the response should contain validation error for field {string}', function (field: string) {
  assert.ok('details' in response.body);
  assert.ok(Array.isArray(response.body.details));
  const fields = response.body.details.map((e: any) => e.field);
  assert.ok(fields.includes(field));
});
