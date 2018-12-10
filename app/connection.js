// p2p
let p2p = (() => {
  let ret = {};
  ret.listConnection = {};

  ret.newConnection = uid => {
    let connection = new RTCPeerConnection(null);
    // let uid = Date.now().toString(16);
    connection.ondatachannel = ({ channel }) => {
      ret.listConnection[uid].dataChannel = channel;
      ret.listConnection[uid].dataChannel.onmessage = ({ data }) => {
        console.log(`${uid} :`, data);
      };
    };

    ret.listConnection[uid] = connection;
  };

  ret.createDataChannel = localUid => {
    let con = ret.listConnection[localUid];
    con.dataChannel = con.createDataChannel(localUid);
  };

  ret.createOffer = localUid => {
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

// socket
let socketServer = (() => {
  let ret = {};
  ret.ws = null;
  ret.localId = null;

  ret.connect = (host, localId) =>
    new Promise(resolve => {
      ret.ws = new WebSocket(`ws://${host}/${localId}`);
      ret.localId = localId;
      window.onbeforeunload = () => {
        ret.ws.close(1000, JSON.stringify({ id: localId }));
      };
      // ret.ws.onmessage = ({ data }) => {
      //   console.log(data);
      // };
      ret.ws.onopen = () => {
        resolve();
      };
    });

  ret.sendMessage = (to, type, message) => {
    ret.ws.send(JSON.stringify({ to, type, from: ret.localId, message }));
  };

  ret.requestList = () => {
    ret.ws.send(
      JSON.stringify({ to: "server", from: ret.localId, type: "request-list" })
    );
  };
  // new Promise(resolve => {
  //   ret.ws.send(
  //     JSON.stringify({ from: ret.localId, message: { type: "request-list" } })
  //   );
  //   ret.ws.onmessage = ({ data }) => {
  //     resolve(data);
  //   };
  // });

  return ret;
})();
