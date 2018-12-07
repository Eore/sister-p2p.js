// let idb = window.indexedDB.open("sister-p2p", 1);

// idb.onerror = () => console.log("Init db fail");

// idb.onupgradeneeded = event => {
//   let db = idb.result;
//   db.createObjectStore("data", { keyPath: "id" }).createIndex("id", "id", {
//     unique: true
//   });
//   db.createObjectStore("temp", { keyPath: "id" }).createIndex("id", "id", {
//     unique: true
//   });
// };

// let txDB = name => {
//   let db = idb.result;
//   return db.transaction(name, "readwrite").objectStore(name);
// };

// let addToTemp = ({ method, data }) => {
//   txDB("temp").add({ id: Date.now(), method, data });
// };

// let addData = data => {
//   txDB("data").add(data);
// };

// let getData = dbName =>
//   new Promise((resolve, reject) => {
//     let ret = txDB(dbName).getAll();
//     ret.onsuccess = event => resolve(event.target.result);
//     ret.onerror = () => reject(null);
//   });

// let cleanTemp = () => {
//   txDB("temp").clear();
// };

let database = (() => {
  indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;

  let request = null;

  let idb = {};
  let datastore = null;

  let tx = objectStore => {
    let db = datastore;
    return db.transaction(objectStore, "readwrite").objectStore(objectStore);
  };

  idb.open = () =>
    new Promise((resolve, reject) => {
      let version = 1;
      request = indexedDB.open("sister-p2p", version);

      request.onupgradeneeded = () => {
        let db = request.result;
        db.createObjectStore("data", { keyPath: "id" });
        db.createObjectStore("temp", { keyPath: "id" });
      };

      request.onsuccess = () => {
        console.log("Opening database success");
        datastore = request.result;
        resolve(datastore);
      };

      request.onerror = () => {
        console.log("Opening database fail");
        reject();
      };
    });

  idb.addTo = (objectStore, data) => {
    tx(objectStore).put(data);
  };

  idb.getDataFrom = (objectStore, id = null) =>
    new Promise(resolve => {
      let getData = null;
      if (id) {
        getData = tx(objectStore).get(id);
      } else {
        getData = tx(objectStore).getAll();
      }
      getData.onsuccess = ({ target }) => resolve(target.result);
    });

  idb.clearTemp = () => {
    tx(objectStore).clear();
  };

  return idb;
})();
