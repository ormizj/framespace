import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export default sqliteTable('jwt_token', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	token: text('token').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});
