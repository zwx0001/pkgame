import React, { Component } from "react";
import "./index.css";
import http from "../../utils/http";
import { message } from "antd";
import { Modal } from "antd";
import { Link } from "react-router-dom";
import cookie from "../../utils/cookie";
// const io = require("socket.io-client");
import io from "socket.io-client";

let count = cookie.get("count") ? cookie.get("count") : 10;
const confirm = Modal.confirm;

class Home extends Component {
  state = {
    activeStyle: false,
    flag: true,
    idx: 0,
    power: { pow: 20, code: 0 },
    mypower: 0,
    uid: "",
    togglepic: true,
    visible: false, //modle弹框
    prize: "",
    imgurl: ""
  };
  render() {
    return (
      <div className="root">
        <div className={this.state.activeStyle ? " rt animate" : "rt animate2"}>
          <div className="home">
            <ul>
              <li>
                <Link to="/myprize">
                  <img src="images/pri_r1_c1.png" alt="我的奖品" />
                </Link>
              </li>
              <li>
                <Link to="/result">
                  <img src="images/pri_r2_c1.png" alt="英雄榜" />
                </Link>
              </li>
              <li>
                <Link to="/rule">
                  <img src="images/price_r3_c1.png" alt="活动规则" />
                </Link>
              </li>
              <li>
                <Link to="/addcount">
                  <img src="images/price_r4_c1.png" alt="获得次数" />
                </Link>
              </li>
            </ul>
            <dl>
              <dt>
                <img
                  src={this.state.imgurl}
                  alt=""
                  style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                />
                <input name="file" type="file" onChange={e => this.upimg(e)} />
              </dt>
              <dd>我的</dd>
            </dl>
            <img src="images/logo1.png" alt="" style={{ marginTop: "50px" }} />
            <img
              src="images/logo2.png"
              alt=""
              style={{ marginTop: "20px" }}
              onClick={() => {
                if (!this.state.uid) {
                  message.error("您还不能开始答题,请先登录");
                  this.props.history.push("/login");
                  return;
                }

                if (count <= 0) {
                  count = 0;
                  console.log(count);
                  this.showConfirm();
                  return;
                }

                this.props.history.push("/gogame");
              }}
            />
            <div className="power">
              <p onClick={this.getprice}>能量兑好礼</p>
              <p>我的能量值:{this.state.mypower}</p>
            </div>
          </div>

          <div className="getprice">
            <div className="power">
              <p onClick={this.getprice}>能量兑好礼</p>
              <p>我的能量值:{this.state.mypower}</p>
              <div className="box">
                <p style={{ textAlign: "center" }}>
                  能量越多兑换的福袋等级越高哦~
                </p>
                <p className="bagtab">
                  <span
                    className={this.state.idx === 0 ? "active" : ""}
                    onClick={() => this.handleTab(20, 0)}
                  >
                    幸运福袋
                  </span>
                  <span
                    className={this.state.idx === 1 ? "active" : ""}
                    onClick={() => this.handleTab(50, 1)}
                  >
                    美好福袋
                  </span>
                  <span
                    className={this.state.idx === 2 ? "active" : ""}
                    onClick={() => this.handleTab(100, 2)}
                  >
                    超级福袋
                  </span>
                </p>

                {this.state.togglepic ? (
                  <img src="images/1.png" alt="" />
                ) : (
                  <img src="images/price.png" alt="" />
                )}
                <button onClick={this.drawprize}>
                  {this.state.power.pow}能量开启福袋
                </button>
              </div>
            </div>
            <Modal
              title="中奖结果"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              okText="继续开福袋"
              cancelText="查看奖励"
            >
              <p
                style={{ textAlign: "center", color: "red", fontSize: "20px" }}
              >
                {this.state.prize}
              </p>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
  upimg = e => {
    let formdata = new FormData();
    let that = this;
    formdata.append("file", e.target.files[0]);
    fetch("/upload", {
      method: "POST",
      "content-type": "multipart/form-data",
      body: formdata
    })
      .then(res => res.json())
      .then(data => {
        if (data.code === 1) {
          http
            .post("/addPortrait", {
              uid: that.state.uid,
              purl: data.path
            })
            .then(
              data => {
                console.log(data);
              },
              err => {
                console.log(err);
              }
            );
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  showConfirm = () => {
    //增加机会
    let that = this;
    confirm({
      title: "今天的挑战次数用完啦,快去增加次数吧~",
      okText: "现在就去",
      cancelText: "下次再说",
      onOk() {
        that.props.history.push("/addcount");
      },
      onCancel() {}
    });
  };

  handleOk = e => {
    //抽奖继续
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    //抽奖查看
    this.setState({
      visible: false
    });
    this.props.history.push("/myprize");
  };

  componentDidMount() {
    let that = this;
    let uid = window.localStorage.getItem("uid")
      ? window.localStorage.getItem("uid")
      : "";
    let imgurl = window.localStorage.getItem("u_headimg")
      ? window.localStorage.getItem("u_headimg")
      : "";

    var socket = io(`ws://192.168.43.184:8888?uid=${uid}`, {
      autoConnect: false
    });
    window.socket = socket;
    this.setState({
      uid,
      imgurl
    });

    if (uid) {
      http
        .get("/getpower", {
          user_id: uid
        })
        .then(
          data => {
            if (data.code === 1) {
              that.setState({
                mypower: data.data.user_power
              });
            } else {
              message.error(data.msg);
            }
          },
          err => {
            console.log(err);
          }
        );
    }
  }

  getprice = () => {
    //点击能量切换盒子
    let that = this;
    this.setState({
      activeStyle: !this.state.activeStyle
    });
    setTimeout(() => {
      that.setState({
        flag: false
      });
    }, 1000);
  };

  handleTab = (pow, idx) => {
    //切换抽奖类型
    let { power } = this.state;
    power.pow = pow;
    power.code = idx;
    this.setState({
      idx,
      power
    });
  };

  drawprize = () => {
    //抽奖
    if (!this.state.uid) {
      message.error("您还不能抽奖,请先登录");
      this.props.history.push("/login");
      return;
    }
    let { power } = this.state;
    let that = this;
    this.setState({
      togglepic: false
    });

    http
      .get("/drawprice", {
        user_id: this.state.uid,
        type: power.code
      })
      .then(
        data => {
          // console.log(data);
          if (data.code === 1) {
            message.success(data.msg);
            that.setState({
              prize: data.data,
              visible: true,
              mypower: data.power
            });
          } else {
            if (data.code === -5) that.countDown();
            else message.error(data.msg);
          }
        },
        err => {
          console.log(err);
        }
      );
  };

  countDown = () => {
    //能量值不够的弹框
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "当前能量值不够哦",
      content: `快去答题攒能量吧 ${secondsToGo} second.`
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: `快去答题赚能量吧 ${secondsToGo} second.`
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      modal.destroy();
    }, secondsToGo * 1000);
  };
}

export default Home;
