import { Table } from './manager';

const tables: Record<string, Table> = {};
export default {
  get(id: string): Table {
    return tables[id];
  },

  close(id: string): void {
    console.log('Destroying room', id);
    delete tables[id];
  },

  create(id: string, table: Table): void {
    tables[id] = table;
  },
};
