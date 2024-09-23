import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export default sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.default(new Date())
		.notNull(),
});
