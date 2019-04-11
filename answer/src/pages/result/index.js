import React, { Component } from "react";
import "./index.css";
import http from "../../utils/http";
import { message } from "antd";
class Result extends Component {
  state = {
    rank: [],
    uid: "",
    mycount: 1,
    mywinner: 1
  };
  render() {
    let { mywinner, mycount } = this.state;
    let rate = ((Number(mywinner) / Number(mycount)) * 100).toFixed(0);
    return (
      <div className="result">
        <p>PK英雄榜</p>
        <div className="box">
          <p>上榜用户将有机会获得惊喜大礼!</p>
          <ul>
            {this.state.rank.map((item, index) => (
              <li
                key={index}
                className={item.user_id === this.state.uid ? "active" : ""}
              >
                {index === 0 ? <img alt="" src="images/heroprice.png" /> : null}
                {index === 1 ? (
                  <img alt="" src="images/heroprice2_r1_c1.png" />
                ) : null}
                {index === 2 ? (
                  <img alt="" src="images/heroprice2_r3_c1.png" />
                ) : null}
                <span>
                  <b style={{ paddingRight: "30px" }}>{index + 1}</b>
                  {item.user_tel}
                </span>
                <span>pk {item.user_pkcount} 次</span>
              </li>
            ))}
          </ul>
          <img
            alt=""
            src="images/gogame.png"
            onClick={() => {
              this.props.history.push("/");
            }}
          />
        </div>
        <div className="foot">
          <img
            alt=""
            src="http://img5.imgtn.bdimg.com/it/u=3817824897,1768495848&fm=26&gp=0.jpg"
          />
          <span>
            您本月共PK <b>{this.state.mycount}</b> 次，获胜{" "}
            <b>{this.state.mywinner} </b>次，胜率
            <b>{rate}</b>%
          </span>
        </div>
      </div>
    );
  }
  componentDidMount() {
    let that = this;
    let uid = window.localStorage.getItem("uid")
      ? window.localStorage.getItem("uid")
      : "";
    this.setState({
      uid
    });
    http.get("/userrank").then(
      data => {
        if (data.code === 1) {
          data.data.sort((a, b) => {
            return b.user_pkcount - a.user_pkcount;
          });

          let mycount = data.data.filter((item, idnex) => {
            return item.user_id === uid;
          })[0].user_pkcount;
          let mywinner = data.data.filter((item, idnex) => {
            return item.user_id === uid;
          })[0].user_winnercount;

          data.data.forEach((item, index) => {
            item.user_tel = item.user_tel
              .split("")
              .map((itm, idx) => {
                if (idx < 3 || idx > 6) {
                  return itm;
                } else {
                  return "*";
                }
              })
              .join("");
          });

          that.setState({
            mycount,
            mywinner,
            rank: data.data
          });
        } else {
          message.info(data.msg);
        }
      },
      err => {
        console.log(err);
      }
    );
  }
}

export default Result;
