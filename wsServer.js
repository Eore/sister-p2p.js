let ws = require("ws");
let port = 4444;

let listConnection = {};
// let listDesc = [];
let wsServer = new ws.Server({ port });
wsServer.on("connection", (socket, request) => {
  listConnection[request.url.substr(1)] = socket;
  console.log(listConnection);
  socket.on("message", data => {
    let { to, message } = JSON.parse(data);
    console.log("Incoming :", { to, message });
    listConnection[to].send(message);
    // if (typeof data === Object) {
    //   data = JSON.parse(data);
    //   switch (data.type) {
    //     case "sending":
    //       if (!listDesc.find(el => el === data.desc)) {
    //         listDesc.push(data.desc);
    //       }
    //       console.log("Adding desc :", data.desc);
    //       break;

    //     case "request":
    //       let indexAddress = Math.floor(Math.random() * listDesc.length);
    //       socket.send(JSON.stringify(listDesc[indexAddress]));
    //       console.log(`request [${indexAddress}] :`, listDesc[indexAddress]);
    //       break;

    //     case "request-list":
    //       socket.send(JSON.stringify(listDesc));
    //       break;
    //   }
    // } else {
    //   console.log("invalid type data incoming");
    // }
  });
  socket.onclose = ({ reason }) => {
    let { id } = JSON.parse(reason);
    delete listConnection[id];
    console.log(`${id} disconnected`);
  };
});
