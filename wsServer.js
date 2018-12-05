let ws = require("ws");
let port = 4444;

let listDesc = [];
let wsServer = new ws.Server({ port });
wsServer.on("connection", socket => {
  socket.on("message", data => {
    data = JSON.parse(data);
    switch (data.type) {
      case "sending":
        if (!listDesc.find(el => el === data.desc)) {
          listDesc.push(data.desc);
        }
        console.log("Adding desc :", data.desc);
        break;

      case "request":
        let indexAddress = Math.floor(Math.random() * listDesc.length);
        socket.send(JSON.stringify(listDesc[indexAddress]));
        console.log(`request [${indexAddress}] :`, listDesc[indexAddress]);
        break;

      case "request-list":
        socket.send(JSON.stringify(listDesc));
        break;
    }
  });
});
