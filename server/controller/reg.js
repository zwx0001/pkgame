const getQuery = require("../mysql/index");
const crypto = require("crypto");
const { hash, cipher, hpe } = require("../utils/encrypt");

let api_reg = async (ctx, next) => {
  let { user_tel, user_pwd, user_nickname } = ctx.request.body;
  if (user_tel && user_pwd && user_nickname) {
    let hash_user_pwd = hash(user_pwd); //生成单项密码加密

    let user_id = cipher(user_tel, ctx.state.key); //用户tel生成用户的id

    let result = await getQuery("select * from user_info where user_tel=?", [
      user_tel
    ]);
    if (result.length <= 0) {
      //用户不存在
      try {
        let result = await getQuery(
          "insert into user_info (user_id,user_nickname,user_tel,user_pwd,user_power,user_pkcount,user_winnercount) values (?,?,?,?,?,?,?)",
          [user_id, user_nickname, user_tel, hash_user_pwd, 3000, 0, 0]
        );
        ctx.body = {
          code: 1,
          msg: "注册成功！"
        };
      } catch (err) {
        throw err;
      }
    } else {
      //用户存在
      ctx.body = {
        code: -1,
        msg: "该用户已存在！"
      };
    }
  } else {
    ctx.body = {
      code: 0,
      msg: "传入参数有误,注册失败！"
    };
  }
};

let api_portrait = async ctx => {
  let { uid, purl } = ctx.request.body;
  if (!uid || !purl) {
    ctx.response.body = {
      code: 0,
      msg: "params uid,purl are missing"
    };
    return;
  }
  let [err, res] = await hpe(
    getQuery(`update user_info set user_url=? where user_id=?`, [purl, uid])
  );

  if (err) {
    ctx.response.body = {
      code: 0,
      msg: err
    };
    return;
  }
  ctx.response.body = {
    code: 1,
    msg: "success"
  };
};
module.exports = {
  "POST /reg": api_reg,
  "POST /addPortrait": api_portrait
};
