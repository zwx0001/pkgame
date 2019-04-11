import React, { Component } from "react";
import "./index.css";
import http from "../../utils/http";
import { message } from "antd";
class Myprize extends Component {
  state = {
    prizelist: []
  };
  render() {
    return (
      <div className="myprize">
       
          <p>我的奖品</p>
          <div className="box">
            <p>
              <span>获奖时间</span>
              <span>获得奖励</span>
            </p>
            <ul>
              {this.state.prizelist.map(item => (
                <li key={item.user_creattime}>
                  <span>{item.user_creattime}</span>
                  <span>{item.user_price}</span>
                </li>
              ))}
            </ul>
            <img
              src="images/2.png"
              alt=""
              onClick={() => {
                this.props.history.push("/");
              }}
            />
          </div>
       
      </div>
    );
  }

  componentDidMount() {
    let uid = window.localStorage.getItem("uid")
      ? window.localStorage.getItem("uid")
      : "";
    let that = this;
    http
      .get("/myprize", {
        user_id: uid
      })
      .then(
        data => {
          if (data.code === 1) {
            message.success(data.msg);
            that.setState({
              prizelist: data.data
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

export default Myprize;
