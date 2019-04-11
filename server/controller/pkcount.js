const getQuery = require("../mysql");
const { hpe } = require("../utils/encrypt");
let api_pkcount = async (ctx, next) => {
  const { uid } = ctx.request.query;
  let pk_count = 0;
  let [err, [result]] = await hpe(
    getQuery("select * from user_info where user_id=?", [uid])
  );
  if (err) {
    ctx.body = {
      code: 0,
      msg: err
    };
    return;
  } else {
    if (!result) {
      ctx.body = {
        code: -1,
        msg: "该用户不存在"
      };
      return;
    } else {
      pk_count = result.user_pkcount;
    }
  }
  pk_count++;

  let [errs] = await hpe(
    getQuery("update user_info set user_pkcount=? where user_id=?", [
      pk_count,
      uid
    ])
  );

  if (errs) {
    ctx.body = {
      code: 0,
      msg: errs
    };
  } else {
    ctx.body = {
      code: 1,
      msg: "pk成功,次数加一"
    };
  }
};

let api_userrank = async (ctx, next) => {
  let [err, result] = await hpe(getQuery("select * from user_info"));
  if (err) {
    ctx.body = {
      code: 0,
      msg: err
    };
  } else {
    if (result.length === 0) {
      ctx.body = {
        code: -1,
        msg: "还没有排名表,快去pk吧"
      };
    } else {
      ctx.body = {
        code: 1,
        data: result,
        msg: "获取数据成功！"
      };
    }
  }
};

let api_winnercount = async (ctx, next) => {
  const { uid } = ctx.request.query;
  let pk_count = 0;
  let [err, [result]] = await hpe(
    getQuery("select * from user_info where user_id=?", [uid])
  );
  if (err) {
    ctx.body = {
      code: 0,
      msg: err
    };
    return;
  } else {
    if (!result) {
      ctx.body = {
        code: -1,
        msg: "该用户不存在"
      };
      return;
    } else {
      pk_count = result.user_winnercount;
    }
  }
  pk_count++;

  let [errs] = await hpe(
    getQuery("update user_info set user_winnercount=? where user_id=?", [
      pk_count,
      uid
    ])
  );

  if (errs) {
    ctx.body = {
      code: 0,
      msg: errs
    };
  } else {
    ctx.body = {
      code: 1,
      msg: "恭喜你成功,获胜次数加一"
    };
  }
};
module.exports = {
  "GET /pkcount": api_pkcount, //获取pk次数，次数增加
  "GET /userrank": api_userrank, //获取排名
  "GET /winnercount": api_winnercount //统计获胜的次数
};
