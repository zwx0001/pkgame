import React, { Component } from "react";
import "./index.css";
import { message, Modal } from "antd";
import cookie from "../../utils/cookie";
import http from "../../utils/http";

let socket;
let time = null;
let count = cookie.get("count");
class Gogame extends Component {
  state = {
    isSuccess: true,
    otherPeo: "",
    con: "匹配成功",
    head_img:
      "http://img5.imgtn.bdimg.com/it/u=3817824897,1768495848&fm=26&gp=0.jpg",
    elsehead_img:
      "http://img4.imgtn.bdimg.com/it/u=2146046871,2611785107&fm=26&gp=0.jpg"
  };
  render() {
    return (
      <div className="gogame">
        {this.state.isSuccess ? (
          <div className="box">
            <p>匹配中...</p>
            <img src={this.state.head_img} alt="" />
          </div>
        ) : (
          <div className="box2">
            <p style={{ textAlign: "center" }} ref="countdown">
              {this.state.con}
            </p>
            <div>
              <dl>
                <dt>
                  <img src={this.state.head_img} alt="" />
                </dt>
                <dd>我</dd>
              </dl>
              <p style={{ fontSize: "30px" }}>
                <b>PK</b>
              </p>
              <dl>
                <dt>
                  <img src={this.state.elsehead_img} alt="" />
                </dt>
                <dd>{this.state.otherPeo}</dd>
              </dl>
            </div>
          </div>
        )}
      </div>
    );
  }
  componentDidMount() {
    let uid = window.localStorage.getItem("uid")
      ? window.localStorage.getItem("uid")
      : "";
    let head_img = window.localStorage.getItem("u_headimg")
      ? window.localStorage.getItem("u_headimg")
      : "http://img5.imgtn.bdimg.com/it/u=3817824897,1768495848&fm=26&gp=0.jpg";
    this.setState({
      head_img
    });
    let that = this;
    if (uid) {
      socket = this.socket = window.socket;
      socket.open();
      socket.on("msg", data => {
        message.error(data);
      });

      socket.on("message", data => {
        message.success(data);
      });

      socket.on("pkinfo", data => {
        count--;
        if (count <= 0) {
          count = 0;
        }
        cookie.set("count", count);
        window.localStorage.setItem("else_headimg", data.headimg);
        http
          .get("/pkcount", {
            uid
          })
          .then(
            data => {
              //console.log(data);
            },
            err => {
              console.log(err);
            }
          );
        that.setState({
          elsehead_img: data.headimg
        });
        time = setTimeout(() => {
          that.setState({
            isSuccess: false,
            otherPeo: data.nickname
          });
          that.countDown(data);
        }, 1000);
      });
    } else {
      message.error("请先登录");
    }
  }
  componentWillUnmount() {
    clearTimeout(time);
    this.setState(() => {
      return;
    });
  }

  countDown = data => {
    let secondsToGo = 3;
    let that = this;
    const modal = Modal.success({
      title: "即将开始答题",
      content: `还有 ${secondsToGo} s.`
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: `还有 ${secondsToGo} s.`
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      that.props.history.push({
        pathname: "/answer",
        data: data
      });
      modal.destroy();
    }, secondsToGo * 1000);
  };
}

export default Gogame;
