CREATE TABLE `graph_checkpoints` (
	`checkpoint` blob NOT NULL,
	`checkpoint_id` text NOT NULL,
	`checkpoint_namespace` text NOT NULL,
	`checkpoint_type` text NOT NULL,
	`metadata` blob NOT NULL,
	`metadata_type` text NOT NULL,
	`parent_checkpoint_id` text,
	`thread_id` text NOT NULL,
	CONSTRAINT `graph_checkpoints_pk` PRIMARY KEY(`thread_id`, `checkpoint_namespace`, `checkpoint_id`)
);
--> statement-breakpoint
CREATE TABLE `graph_writes` (
	`channel` text NOT NULL,
	`checkpoint_id` text NOT NULL,
	`checkpoint_namespace` text NOT NULL,
	`data` blob NOT NULL,
	`write_index` integer NOT NULL,
	`task_id` text NOT NULL,
	`thread_id` text NOT NULL,
	`type` text NOT NULL,
	CONSTRAINT `graph_writes_pk` PRIMARY KEY(`thread_id`, `checkpoint_namespace`, `checkpoint_id`, `task_id`, `write_index`)
);
--> statement-breakpoint
CREATE TABLE `tutor_messages` (
	`created_at` integer NOT NULL,
	`id` text PRIMARY KEY,
	`parts` text NOT NULL,
	`role` text NOT NULL,
	`run_id` text NOT NULL,
	`sequence` integer NOT NULL,
	`thread_id` text NOT NULL,
	CONSTRAINT `fk_tutor_messages_thread_id_tutor_threads_id_fk` FOREIGN KEY (`thread_id`) REFERENCES `tutor_threads`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `tutor_runs` (
	`completed_at` integer,
	`error` text,
	`finish_reason` text,
	`id` text PRIMARY KEY,
	`input_tokens` integer,
	`model_id` text NOT NULL,
	`output_tokens` integer,
	`response_time_ms` integer,
	`started_at` integer NOT NULL,
	`status` text NOT NULL,
	`thread_id` text NOT NULL,
	`total_tokens` integer,
	CONSTRAINT `fk_tutor_runs_thread_id_tutor_threads_id_fk` FOREIGN KEY (`thread_id`) REFERENCES `tutor_threads`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `tutor_threads` (
	`created_at` integer NOT NULL,
	`id` text PRIMARY KEY,
	`title` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `graph_checkpoints_lookup_idx` ON `graph_checkpoints` (`thread_id`,`checkpoint_namespace`,`checkpoint_id`);--> statement-breakpoint
CREATE INDEX `graph_writes_checkpoint_idx` ON `graph_writes` (`thread_id`,`checkpoint_namespace`,`checkpoint_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `tutor_messages_thread_sequence_uidx` ON `tutor_messages` (`thread_id`,`sequence`);--> statement-breakpoint
CREATE UNIQUE INDEX `tutor_messages_run_role_uidx` ON `tutor_messages` (`run_id`,`role`);--> statement-breakpoint
CREATE INDEX `tutor_messages_thread_created_at_idx` ON `tutor_messages` (`thread_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `tutor_runs_thread_started_at_idx` ON `tutor_runs` (`thread_id`,`started_at`);--> statement-breakpoint
CREATE INDEX `tutor_runs_status_started_at_idx` ON `tutor_runs` (`status`,`started_at`);--> statement-breakpoint
CREATE INDEX `tutor_threads_updated_at_idx` ON `tutor_threads` (`updated_at`);