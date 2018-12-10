let ws = require("ws");
let port = 4444;

let listConnection = {};

let wsServer = new ws.Server({ port });
wsServer.on("connection", (socket, request) => {
  let id = request.url.substr(1);
  listConnection[id] = socket;
  socket.on("message", data => {
    let at = Date.now();
    let { to, from, type, message } = JSON.parse(data);
    console.log("Incoming :\n", { to, from, type, message, at });
    if (listConnection[to] !== undefined) {
      switch (type) {
        case "request-list":
          socket.send(
            JSON.stringify({
              to: from,
              from: "server",
              type: "request-list",
              message: Object.keys(listConnection),
              at
            }),
            at
          );
          break;

        default:
          listConnection[to].send(
            JSON.stringify({ to, from, type, message, at })
          );
      }
    } else {
      console.log(`ID ${to} not in list`);
    }
  });
  socket.onclose = ({ reason }) => {
    let { id } = JSON.parse(reason);
    delete listConnection[id];
    console.log(`${new Date().toLocaleString("ID")} : ${id} disconnected`);
  };
});
