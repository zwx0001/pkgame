let services = require("../service");
let obj = {};
module.exports = (socket, pkRooms, io, userCollection) => {
  socket.on("get result", async (info, callback) => {
    let { uid } = info;
    obj[uid] = uid;
    let len = Object.keys(obj).length;
    if (!uid) {
      socket.send("uid is missing");
      return;
    }

    let { roomid } = userCollection[uid];
    //room 房间2个人的基本信息  q该房间的题目  status房间状态
    let { room, q, status } = pkRooms[roomid];
    let u1 = room[0];
    let u2 = room[1];
    let u1Scrore = Object.values(u1.score).reduce((start, step) => {
      return (start += step * 1);
    }, 0);
    let u2Scrore = Object.values(u2.score).reduce((start, step) => {
      return (start += step * 1);
    }, 0);
    //确认分数

    let elsepeo = room.filter((item, index) => {
      return item.uid !== uid;
    })[0];
    let elseid = elsepeo.uid;

    if (len === 2) {
      let u_id = u1Scrore > u2Scrore ? u1.uid : u2.uid;
      io.to(userCollection[elseid].socketid).emit(
        "get winner",
        "The Winner：" + (u1Scrore > u2Scrore ? u1.nickname : u2.nickname),
        u_id
      );
      io.to(userCollection[uid].socketid).emit(
        "get winner",
        "The Winner：" + (u1Scrore > u2Scrore ? u1.nickname : u2.nickname),
        u_id
      );
      
      obj={};
    } else {
      io.to(userCollection[uid].socketid).emit(
        "get elsewinner",
        "游戏还未结束,请等待对方答题！"
      );
    }
    callback({
      code: 1,
      result: [
        {
          ...u1,
          sum: u1Scrore
        },
        {
          ...u2,
          sum: u2Scrore
        }
      ],
      msg: "The Winner：" + (u1Scrore > u2Scrore ? u1.nickname : u2.nickname)
    });
    let winnerId = u1Scrore > u2Scrore ? u1.uid : u2.uid;
    let re = await services.updatePkUser(winnerId);
  });
};
