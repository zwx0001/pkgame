let { hpe } = require("../utils/encrypt.js");
const getQuery = require("../mysql/index");
const _ = require("lodash");
let price = [
  //存放奖品
  {
    tit: "$5红包",
    code: 1
  },
  {
    tit: "$10红包",
    code: 2
  },
  {
    tit: "$50京东E卡",
    code: 3
  },
  {
    tit: "四件套",
    code: 4
  },
  {
    tit: "99空粉币",
    code: 5
  },
  {
    tit: "666空粉币",
    code: 6
  },
  {
    tit: "谢谢参与",
    code: 7
  }
];
let arr = []; //存放奖品的百分比
let pow = 0;
let flag = false;
for (let i = 0; i < 100; i++) {
  switch (true) {
    case i < 30:
      arr.push(1);
      break;
    case i < 40:
      arr.push(2);
      break;
    case i < 45:
      arr.push(3);
      break;
    case i < 50:
      arr.push(4);
      break;
    case i < 70:
      arr.push(5);
      break;
    case i < 90:
      arr.push(6);
      break;
    case i < 100:
      arr.push(7);
      break;
  }
}

arr = _.shuffle(arr); //随机排序

let api_drawprice = async (ctx, next) => {
  //抽奖
  //抽奖
  let { user_id, type = 0 } = ctx.request.query; //传 用户id  和抽奖类型
  let engery = {
    "0": 20,
    "1": 50,
    "2": 100
  };

  let [err, [result]] = await hpe(
    getQuery("select * from user_info where user_id=?", [user_id])
  );

  if (err) {
    ctx.body = {
      code: 0,
      msg: err
    };
    return;
  } else {
    result && delete result.user_pwd;
    if (result) {
      if (!engery[type]) {
        ctx.body = {
          code: -1,
          msg: "参数有误"
        };
        return;
      }
      pow = result.user_power;
      if (!pow || pow < engery[type]) {
        ctx.body = {
          code: -5,
          msg: "当前能量值不够哦,答题赚能量"
        };
        return;
      }

      ctx.body = {
        code: 1,
        msg: "查询成功"
      };
      flag = true;
    } else {
      ctx.body = {
        code: 0,
        msg: "查询失败,没有该用户"
      };
    }
  }
  
  if (flag) {
    let priCode = arr[Math.floor(Math.random() * 100)];
    let Price = price.filter(item => item.code == priCode);
    let { tit, code } = Price[0];
    let [error] = await hpe(
      getQuery(
        "insert into price (user_id,user_price,user_code,user_creattime) values (?,?,?,?)",
        [user_id, tit, code, new Date().toLocaleString()]
      )
    );
    if (error) {
      ctx.body = {
        code: -3,
        msg: error
      };
      return;
    } else {
      pow -= engery[type];
      let [errors, res] = await hpe(
        getQuery("update user_info set user_power=? where user_id=?", [
          pow,
          user_id
        ])
      );
      if (errors) {
        ctx.body = {
          code: -3,
          msg: error
        };
        return;
      }
      ctx.body = {
        code: 1,
        msg: "抽奖成功",
        data: tit,
        power: pow
      };
    }
  }
  await next();
};

let api_getpower = async (ctx, next) => {
  //获取用户能量
  let { user_id } = ctx.request.query;
  if (user_id) {
    let [err, [result]] = await hpe(
      getQuery("select * from user_info where user_id=?", [user_id])
    );
    if (err) {
      ctx.body = {
        code: -2,
        msg: err
      };
    } else {
      delete result.user_pwd;
      ctx.body = {
        code: 1,
        msg: "能量获取成功！",
        data: result
      };
    }
  } else {
    ctx.body = {
      code: -1,
      msg: "参数传递有误！"
    };
  }
};

let api_myprize = async (ctx, next) => {
  let { user_id } = ctx.request.query;
  if (user_id) {
    let [err, result] = await hpe(
      getQuery("select * from price where user_id=?", [user_id])
    );
    if (err) {
      ctx.body = {
        code: 0,
        msg: err
      };
    } else {
      ctx.body = {
        code: 1,
        msg: "获取奖品列表成功！",
        data: result
      };
    }
  } else {
    ctx.body = {
      code: -1,
      msg: "请先登录！"
    };
  }
};
module.exports = {
  "GET /drawprice": api_drawprice, //抽奖
  "GET /getpower": api_getpower, //获取用户能量
  "GET /myprize": api_myprize //获取奖品列表
};
