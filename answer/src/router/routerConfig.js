import Home from "../pages/home"; //答题首页
import Reg from "../pages/reg"; //注册页面
import Login from "../pages/login"; //登录页面
import Myprize from "../pages/myprize"; //我的奖品列表
import Rule from "../pages/rule"; //活动规则
import Gogame from "../pages/goGame"; //匹配页面
import Answer from "../pages/answer"; //答题页面
import Result from "../pages/result"; //结果页面。谁赢谁输
import Addcount from "../pages/addCount"; //增加机会

const routers = [
  {
    path: "/",
    exact: true,
    component: Home
  },
  {
    path: "/reg",
    component: Reg
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/myprize",
    component: Myprize
  },
  {
    path: "/rule",
    component: Rule
  },
  {
    path: "/gogame",
    component: Gogame
  },
  {
    path: "/answer",
    component: Answer
  },
  {
    path: "/result",
    component: Result
  },
  {
    path: "/addcount",
    component: Addcount
  }
];
export default routers;
