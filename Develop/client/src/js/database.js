import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  const db = await openDB('jate', 1); // Open the database
  const tx = db.transaction('jate', 'readwrite'); // Start a read-write transaction
  await tx.store.put({ content }); // Put the content in the store
  await tx.done; // Complete the transaction
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  const db = await openDB('jate', 1); // Open the database
  const tx = db.transaction('jate'); // Start a read-only transaction
  const allContent = await tx.store.getAll(); // Get all contents
  await tx.done; // Complete the transaction
  return allContent.length ? allContent[allContent.length - 1].content : null; // Return the last content
};

initdb();
