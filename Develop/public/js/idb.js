// create variable to hold db connection
let db;

// establish a connection to IndexedDB database
const request = indexedDB.open('budget-tracker', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
}