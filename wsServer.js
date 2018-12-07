let ws = require("ws");
let port = 4444;

let listConnection = {};
// let listDesc = [];
let wsServer = new ws.Server({ port });
wsServer.on("connection", (socket, request) => {
  listConnection[request.url.substr(1)] = socket;
  // console.log(listConnection);
  socket.on("message", data => {
    let at = Date.now();
    let { to, from, message } = JSON.parse(data);
    console.log("Incoming :", { to: to ? to : "server", from, message, at });
    // console.log(typeof message);
    if (typeof message === "object") {
      let { type } = message;
      switch (type) {
        // case "sending":
        //   listConnection[to].send(JSON.stringify({ from, message, at }));
        //   break;

        // case "request":
        //   let indexAddress = Math.floor(Math.random() * listDesc.length);
        //   socket.send(JSON.stringify(listDesc[indexAddress]));
        //   console.log(`request [${indexAddress}] :`, listDesc[indexAddress]);
        //   break;

        case "request-list":
          socket.send(JSON.stringify(Object.keys(listConnection)));
          break;
      }
    } else {
      listConnection[to].send(JSON.stringify({ from, message, at }));
    }
  });
  socket.onclose = ({ reason }) => {
    let { id } = JSON.parse(reason);
    delete listConnection[id];
    console.log(`${id} disconnected`);
  };
});
