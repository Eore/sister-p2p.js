// let createNewConnection = () => {
//   let connection = new RTCPeerConnection(null);
//   let uid = Date.now().toString(16);
//   connection.ondatachannel = ({ channel }) => {
//     let dataChannel = channel;
//     dataChannel.onmessage = ({ data }) => {
//       console.log(`${uid} :`, data);
//     };
//   };
//   return {
//     uid,
//     connection
//   };
// };

// let createDataChannel = (connection1, uid) => {
//   return connection1.createDataChannel(uid);
// };

// let createOffer = connection1 => {
//   return connection1.createOffer().then(offer => {
//     connection1.setLocalDescription(offer);
//     return offer;
//   });
// };

// let createAnswer = (connection2, offerDesc) => {
//   let offer = new RTCSessionDescription(offerDesc);
//   connection2.setRemoteDescription(offer);
//   return connection2.createAnswer().then(answer => {
//     connection2.setLocalDescription(answer);
//     return answer;
//   });
// };

// let connect = (connection1, answerDesc) => {
//   let answer = new RTCSessionDescription(answerDesc);
//   connection1.setRemoteDescription(answer);
// };

// let connectToWS = (host, id) => {
//   let ws = new WebSocket(`ws://${host}/${id}`);
//   window.onbeforeunload = () => {
//     ws.close(1000, JSON.stringify({ id }));
//   };
//   ws.onmessage = ({ data }) => {
//     console.log(data);
//   };
//   return ws;
// };

// let sendMessage = (wsConnection, message) => {
//   wsConnection.send(JSON.stringify(message));
// };

//p2p
let p2p = (() => {
  let ret = {};
  ret.listConnection = {};

  ret.newConnection = () => {
    let connection = new RTCPeerConnection(null);
    let uid = Date.now().toString(16);
    connection.ondatachannel = ({ channel }) => {
      let dataChannel = channel;
      dataChannel.onmessage = ({ data }) => {
        console.log(`${uid} :`, data);
      };
    };

    ret.listConnection[uid] = connection;
  };

  ret.createDataChannel = localUid => {
    ret.listConnection[localUid].createDataChannel(localUid);
  };

  ret.craeteOffer = localUid => {
    let con = ret.listConnection[localUid];
    return con.createOffer().then(offer => {
      con.setLocalDescription(offer);
      return offer;
    });
  };

  ret.createAnswer = (remoteUid, offerDesc) => {
    let con = ret.listConnection[remoteUid];
    let offer = new RTCSessionDescription(offerDesc);
    con.setRemoteDescription(offer);
    return con.createAnswer().then(answer => {
      con.setLocalDescription(answer);
      return answer;
    });
  };

  ret.connect = (localUid, answerDesc) => {
    let answer = new RTCSessionDescription(answerDesc);
    ret.listConnection[localUid].setRemoteDescription(answer);
  };

  return ret;
})();

//socket
let socketServer = (() => {
  let ret = {};
  let ws = null;
  ret.localId = null;

  ret.connect = (host, localId) =>
    new Promise(resolve => {
      ws = new WebSocket(`ws://${host}/${localId}`);
      ret.localId = localId;
      window.onbeforeunload = () => {
        ws.close(1000, JSON.stringify({ id: localId }));
      };
      ws.onmessage = ({ data }) => {
        console.log(data);
      };
      ws.onopen = () => {
        resolve();
      };
    });

  ret.sendMessage = (to, message) => {
    ws.send(JSON.stringify({ to, from: ret.localId, message }));
  };

  ret.requestList = () =>
    new Promise(resolve => {
      ws.send(
        JSON.stringify({ from: ret.localId, message: { type: "request-list" } })
      );
      ws.onmessage = ({ data }) => {
        resolve(data);
      };
    });

  return ret;
})();
