// create variable to hold db connection
let db;

// establish a connection to IndexedDB database
const request = indexedDB.open('budget-tracker', 1);