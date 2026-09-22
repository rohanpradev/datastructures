import { createDatabase, migrateDatabase } from "../persistence";

const database = createDatabase();

try {
	migrateDatabase(database.db);
	console.log("AI tutor database migrations applied.");
} finally {
	database.close();
}
