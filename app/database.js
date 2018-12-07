let initDatabase = () =>
  new Promise(resolve => {
    let idb = self.indexedDB.open("sister-p2p", 1);
    idb.onerror = () => console.log("Init db fail");
    idb.onupgradeneeded = event => {
      let db = event.target.result;
      console.log(db);
      let data = db.createObjectStore("data", { keyPath: "id" });
      let temp = db.createObjectStore("temp", { keyPath: "id" });
      resolve({ data, temp });
    };
  });
