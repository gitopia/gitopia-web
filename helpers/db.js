import Dexie from "dexie";

const db = new Dexie("userNotificationDB");
db.version(1).stores({
  notifications: "++id, type, msg, unread", // Primary key and indexed props
});

export default db;
