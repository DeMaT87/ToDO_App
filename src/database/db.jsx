import * as SQLite from "expo-sqlite";

const DB_NAME = "app_session.db";
let dbInstance = null;

async function getDb() {
  if (!SQLite || typeof SQLite.openDatabaseAsync !== "function") {
    throw new Error("SQLite or openDatabaseAsync is not available!");
  }

  if (!dbInstance) {
    try {
      dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
      if (!dbInstance) {
        throw new Error(
          "Failed to open database: openDatabaseAsync returned null/undefined"
        );
      }
    } catch (error) {
      throw error;
    }
  }
  return dbInstance;
}

export async function initSessionTable() {
  try {
    const db = await getDb();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS session (
        id INTEGER PRIMARY KEY NOT NULL,
        userId TEXT
      );
    `);
    await db.execAsync(
      `INSERT OR IGNORE INTO session (id, userId) VALUES (1, NULL);`
    );
  } catch (error) {
    throw error;
  }
}

export async function saveActiveSession(userId = "active_user") {
  try {
    const db = await getDb();
    await db.runAsync("UPDATE session SET userId = ? WHERE id = 1;", [userId]);
  } catch (error) {
    throw error;
  }
}

export async function loadActiveSession() {
  try {
    const db = await getDb();
    const firstRow = await db.getFirstAsync(
      "SELECT userId FROM session WHERE id = 1;"
    );
    return firstRow ? firstRow.userId : null;
  } catch (error) {
    throw error;
  }
}

export async function clearActiveSession() {
  try {
    const db = await getDb();
    await db.runAsync("UPDATE session SET userId = NULL WHERE id = 1;");
  } catch (error) {
    throw error;
  }
}
