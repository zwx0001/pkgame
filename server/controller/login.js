const getQuery = require("../mysql/index");
const { hash, token } = require("../utils/encrypt");

let api_login = async (ctx, next) => {
  let { user_tel, user_pwd } = ctx.request.body;
  if (user_tel && user_pwd) {
    let hash_user_pwd = hash(user_pwd); //密码单向加密

    let result = await getQuery(
      "select * from user_info where user_tel=? and user_pwd=?",
      [user_tel, hash_user_pwd]
    );

    let tokens = token(user_tel, ctx.state.key); //根据用户信息生成token
    if (result.length > 0) {
      delete result[0].user_pwd;
      ctx.body = {
        code: 1,
        msg: "登录成功！",
        token: tokens,
        data: result[0]
      };
    } else {
      ctx.body = {
        code: -1,
        msg: "账号或密码错误！"
      };
    }
  } else {
    ctx.body = {
      code: 0,
      msg: "传入参数有误,登录失败！"
    };
  }
};

module.exports = {
  "POST /login": api_login
};
