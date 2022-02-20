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

function saveTransaction(recordTransaction) {
    const newTransaction = db.newTransaction(['pending'], 'readwrite');

    const storeTransaction = newTransaction.objectStore('pending transaction');

    storeTransaction.add(recordTransaction);
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
                const newTransaction = db.transaction(['pending transaction'], 'readwrite');

                const storeTransaction = newTransaction.objectstore('pending transaction');

                storeTransaction.clear();
            });
        }
    };
}