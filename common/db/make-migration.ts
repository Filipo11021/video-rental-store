// eslint-disable-next-line @typescript-eslint/no-unused-vars
const template = `
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  
}

export async function down(knex: Knex): Promise<void> {

}
`;

const moduleName = process.argv[2];
if (!moduleName) {
  process.exit('module name is required');
}
