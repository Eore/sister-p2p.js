// let main = (() => {
//   let ret = {};

//   ret.uid = "";

//   socketServer.ws.onopen = () => {
//     socketServer.ws.onmessage = ({ data }) => {
//       console.log(data);
//       // switch (data) {
//       //   case 'offer':

//       //     break;

//       //   default:
//       //     break;
//       // }
//     };
//   };

//   ret.connectToListServer = () => {
//     return socketServer
//       .connect(
//         "localhost:4444",
//         ret.uid
//       )
//       .then(() => {
//         return socketServer.requestList();
//       });
//   };

//   ret.selectNodes = nodes => {
//     p2p.socketServer.sendMessage();
//   };

//   ret.requestHandshake = to => {
//     socketServer.sendMessage(to, { type: "offer" });
//     socketServer.ws.onmessage = ({ data }) => {};
//   };

//   return ret;
// })();

// socketServer.ws.onopen = () => {
//   socketServer.ws.onmessage = ({ data }) => {
//     console.log(data);
//     // switch (data) {
//     //   case 'offer':

//     //     break;

//     //   default:
//     //     break;
//     // }
//   };
// };

let requestOffer = to => {
  p2p.newConnection(to);
  socketServer.sendMessage(to, "request-offer", "");
};

socketServer
  .connect(
    "localhost:4444",
    Date.now().toString(16)
  )
  .then(() => {
    socketServer.ws.onmessage = ({ data }) => {
      let { to, from, type, message, at } = JSON.parse(data);
      // console.log(JSON.parse(data));
      switch (type) {
        case "request-offer":
          p2p.newConnection(from);
          p2p.createDataChannel(from);
          p2p.createOffer(from).then(offer => {
            // console.log({ to, offer });
            socketServer.sendMessage(from, "offer", JSON.stringify(offer));
          });
          break;

        case "offer":
          let offer = JSON.parse(message);
          console.log(offer);
          p2p.newConnection(from);
          // p2p.createDataChannel(from);
          p2p.createAnswer(from, offer).then(answer => {
            socketServer.sendMessage(from, "answer", JSON.stringify(answer));
          });
          break;

        case "answer":
          let answer = JSON.parse(message);
          console.log(answer);
          p2p.connect(
            from,
            answer
          );
          break;

        default:
          console.log(message);
          break;
      }
    };
  });
// .then(() => {
//   return socketServer.requestList();
// });
