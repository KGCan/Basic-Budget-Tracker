// create variable to hold db connection
let db;

// establish a connection to IndexedDB database
const request = indexedDB.open('budget-tracker', 1);


request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('pending-transaction', { autoIncrement: true});
};

request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {
        checkTransactions();
    }
};

request.onerror = function(event) {
    console.log('error' + event.target.errorCode);
};

function saveTransaction(transaction) {
    const newTransaction = db.newTransaction(['pending'], 'readwrite');

    const storeTransaction = newTransaction.objectStore('pending transaction');

    storeTransaction.add(transaction);
}