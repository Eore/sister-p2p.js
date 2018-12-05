let createNewConnection = () => {
  let connection = new RTCPeerConnection(null);
  let uid = Date.now().toString(16);
  connection.ondatachannel = ({ channel }) => {
    let dataChannel = channel;
    dataChannel.onmessage = ({ data }) => {
      console.log(`${uid} :`, data);
    };
  };
  return {
    uid,
    connection
  };
};

let createDataChannel = (connection1, uid) => {
  return connection1.createDataChannel(uid);
};

let createOffer = connection1 => {
  return connection1.createOffer().then(offer => {
    connection1.setLocalDescription(offer);
    return offer;
  });
};

let createAnswer = (connection2, offerDesc) => {
  let offer = new RTCSessionDescription(offerDesc);
  connection2.setRemoteDescription(offer);
  return connection2.createAnswer().then(answer => {
    connection2.setLocalDescription(answer);
    return answer;
  });
};

let connect = (connection1, answerDesc) => {
  let answer = new RTCSessionDescription(answerDesc);
  connection1.setRemoteDescription(answer);
};
