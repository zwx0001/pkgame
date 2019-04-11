import Dva from "dva";
import "./index.css";
import "./common/reset.css"; //全局样式
import { createBrowserHistory } from "history";
import "antd/dist/antd.css"; //引入antd的css

const app = Dva({
  history: createBrowserHistory()
});

app.router(require("./router").default);

app.start("#root");
