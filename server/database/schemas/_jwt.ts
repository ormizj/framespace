import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import users from './_users';

const jwt = sqliteTable('jwt', {
	email: text('email').notNull().unique().primaryKey(),
	token: text('token').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const tableRelations = relations(jwt, ({ one }) => ({
	user: one(users, {
		fields: [jwt.email],
		references: [users.email],
	}),
}));

export default jwt;
