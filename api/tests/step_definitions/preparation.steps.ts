import { BeforeAll, After, AfterAll } from '@cucumber/cucumber';
import { conn, Pokemon } from '../../src/infrastructure/persistence/sequelize';

BeforeAll(async () => {
  try {
    await conn.authenticate();
  } catch (error) {
    console.error('Failed to authenticate database during BeforeAll:', error);
    throw error;
  }
});

After(async () => {
  try {
    await Pokemon.destroy({ where: {}, force: true });
  } catch (error) {
    console.error('Failed to clear database during After hook:', error);
  }
});

AfterAll(async () => {
  try {
    await conn.close();
  } catch (error) {
    console.error('Failed to close database connection during AfterAll:', error);
  }
});
