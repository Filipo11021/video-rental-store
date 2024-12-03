import { knex } from './src/knex';

(async function run() {
  const res = await knex.migrate.latest();
  console.log(res);
  process.exit();
})();
