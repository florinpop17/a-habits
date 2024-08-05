import { Table, getTableName, sql } from 'drizzle-orm';
import env from '../../../env';
import { db, connection } from '@src/db';
import * as schema from '@src/db/schemas';

if (!env.DB_SEEDING) {
    throw new Error('You must set DB_SEEDING to "true" when running seeds');
}

async function resetTable(db: db, table: Table) {
    return db.execute(sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`));
}

async function main() {
    for (const table of [schema.habitEntries, schema.habits, schema.users]) {
        // await db.delete(table); // clear tables without truncating / resetting ids
        await resetTable(db, table);
    }

    await connection.end();
}

main();
