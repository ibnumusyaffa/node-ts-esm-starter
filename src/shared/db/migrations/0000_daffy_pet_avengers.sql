CREATE TABLE `users` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`email` varchar(255),
	`password` text,
	`updated_at` datetime,
	`created_at` datetime,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
