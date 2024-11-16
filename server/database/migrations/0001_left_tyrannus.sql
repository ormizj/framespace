CREATE TABLE `jwt_token` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
