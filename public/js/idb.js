// create variable to hold db connection
let db;

// establish a connection to IndexedDB database
const request = indexedDB.open('budget', 1);

// create 'pending transaction' object store and set auto increment to true
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('pending transaction', { autoIncrement: true});
};

request.onsuccess = function(event) {
    db = event.target.result;

    // confirm whether app is online prior to reading from db, if yes run the checktransactions function to send all local data to the api
    if (navigator.onLine) {
        checkTransactions();
    }
};

request.onerror = function(event) {
    console.log('error' + event.target.errorCode);
};

// if there is no internect connection, the savetransaction function will be executed
function saveRecord(record) {
    const newTransaction = db.newTransaction(['pending transaction'], 'readwrite');

    const storeTransaction = newTransaction.objectStore('pending transaction');

    storeTransaction.add(record);
};

function checkTransactions() {
    const newTransaction = db.newTransaction(['pending transaction'], 'readwrite');

    const storeTransaction = newTransaction.objectStore('pending transaction');
    
    const getAllTransactions = storeTransaction.getAll();

    getAllTransactions.onsuccess = function() {
        if (getAllTransactions.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'Post',
                body: JSON.stringify(getAllTransactions.result),
                headers: {
                    Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(() => {
                const newTransaction = db.newTransaction(['pending transaction'], 'readwrite');

                const storeTransaction = newTransaction.objectStore('pending transaction');

                storeTransaction.clear();
            });
        }
    };
}

// event listener for when the app comes back on
window.addEventListener('online', checkTransactions);