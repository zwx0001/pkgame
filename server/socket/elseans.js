let services = require("../service");
module.exports = (socket, pkRooms, io, userCollection) => {
  socket.on("get elseans", async (info, callback) => {
    let { uid, score } = info;

    if (!uid) {
      socket.send("uid is missing");
      return;
    }
    let { roomid } = userCollection[uid];
    // //room 房间2个人的基本信息  q该房间的题目  status房间状态
    let { room, q, status } = pkRooms[roomid];
    let elsepeo = room.filter((item, index) => {
      return item.uid !== uid;
    })[0];
    let elseid = elsepeo.uid;
    io.to(userCollection[elseid].socketid).emit("get elesescore", score);
  });
};
