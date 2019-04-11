import React, { Component } from "react";
import "./index.css";
import Pro from "../../components/progress";
import { Modal, message } from "antd";
import http from "../../utils/http";

let socket;
let answer = "";
let time = null;

class Answer extends Component {
  state = {
    data: [], //所有的题目
    count: 0,
    toggleck: false, //切换选中题目
    idx: "",
    uid: "",
    outtime: "",
    visible: false,
    elsescore: 0,
    myscore: 0,
    myheadimg:
      "http://img5.imgtn.bdimg.com/it/u=3817824897,1768495848&fm=26&gp=0.jpg",
    elseheadimg:
      "http://img4.imgtn.bdimg.com/it/u=2146046871,2611785107&fm=26&gp=0.jpg",
    isSuccess: true
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    let that = this;
    that.props.history.push("/");
    socket.emit(`disconnect?uid=${that.state.uid}`);
    socket.close();

    // confirm({
    //   title: "是否退出当前房间再挑战?",
    //   okText: "是",
    //   cancelText: "否",
    //   onOk() {
    //     socket.emit(`disconnect?uid=${that.state.uid}`);
    //     socket.close();
    //     that.props.history.push("/");
    //   },
    //   onCancel() {
    //     that.props.history.push("/");
    //   }
    // });

    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    this.props.history.push("/result");
    socket.emit(`disconnect?uid=${this.state.uid}`);
    socket.close();

    this.setState({
      visible: false
    });
  };

  render() {
    let ques = this.state.data[this.state.count];
    answer = ques && ques.answer;
    let s = ques && ques.options;
    let reg = /(A|B|C|D)/;
    let obj = {};
    s &&
      s
        .split(reg)
        .slice(1)
        .forEach((item, index) => {
          if (index % 2 === 0) {
            obj[item] = s.split(reg).slice(1)[index + 1];
          }
        });

    let arrobj = Object.entries(obj);

    return (
      <div className="answer">
        <div className="box2">
          <div>
            <dl>
              <p>+{this.state.myscore}</p>
              <dt>
                <img src={this.state.myheadimg} alt="" />
              </dt>
              <dd>我</dd>
            </dl>
            <p style={{ fontSize: "30px" }}>
              <b>PK</b>
            </p>
            <dl>
              <p>+{this.state.elsescore}</p>
              <dt>
                <img src={this.state.elseheadimg} alt="" />
              </dt>
              <dd>
                {this.props.history.location.data &&
                  this.props.history.location.data.nickname}
              </dd>
            </dl>
          </div>
        </div>
        <div className="box">
          <div className="title">
            <p>
              <b>{this.state.count + 1}</b>.{ques && ques.title}
            </p>
            <div
              style={{
                width: "100%",
                padding: "0 15px",
                position: "absolute",
                bottom: "5px"
              }}
            >
              {this.state.count < this.state.data.length - 1 ? (
                <Pro
                  key={this.state.count}
                  countDown={this.countDown}
                  js={this.js}
                />
              ) : null}

              {this.state.count === this.state.data.length - 1 ? (
                <Pro key={this.state.count} info={this.info} js={this.js} />
              ) : null}
            </div>
          </div>
          <div className="question">
            {this.state.toggleck ? (
              <ul data-answer={ques && ques.answer}>
                {arrobj.map((item, index) => {
                  if (item[0] === answer) {
                    return (
                      <li className="yes" key={index}>
                        <b>{item[0]}</b>.{item[1]}
                      </li>
                    );
                  } else if (this.state.idx === index && item[0] !== answer) {
                    return (
                      <li className="no" key={index}>
                        <b>{item[0]}</b>.{item[1]}
                      </li>
                    );
                  } else {
                    return (
                      <li key={index}>
                        <b>{item[0]}</b>.{item[1]}
                      </li>
                    );
                  }
                })}
              </ul>
            ) : (
              <ul data-answer={ques && ques.answer}>
                {arrobj.map((item, index) => (
                  <li
                    key={index}
                    data-ans={item[0]}
                    onClick={() =>
                      this.checkanswer(index, ques.qid, ques.answer, item[0])
                    }
                  >
                    <b>{item[0]}</b>.{item[1]}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="model">
          <Modal
            title="PK 结果"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText={"继续挑战"}
            cancelText={"休息一下"}
          >
            {this.state.isSuccess ? (
              <img src="images/success.jpg" alt="" style={{ width: "100%" }} />
            ) : (
              <img src="images/fail.jpg" alt="" style={{ width: "100%" }} />
            )}
          </Modal>
        </div>
      </div>
    );
  }
  js = outtime => {
    //计算剩余时间
    this.setState({
      outtime
    });
  };
  componentDidMount() {
    let that = this;
    let uid = window.localStorage.getItem("uid")
      ? window.localStorage.getItem("uid")
      : "";
    let head_img = window.localStorage.getItem("u_headimg")
      ? window.localStorage.getItem("u_headimg")
      : "http://img5.imgtn.bdimg.com/it/u=3817824897,1768495848&fm=26&gp=0.jpg";

    let else_img = window.localStorage.getItem("else_headimg")
      ? window.localStorage.getItem("else_headimg")
      : "http://img4.imgtn.bdimg.com/it/u=2146046871,2611785107&fm=26&gp=0.jpg";

    this.setState({
      uid,
      myheadimg: head_img,
      elseheadimg: else_img
    });
    socket = this.socket = window.socket;
    socket.open();
    socket.emit(
      "get question",
      {
        uid
      },
      data => {
        that.setState({
          data
        });
      }
    );

    socket.on("get elesescore", function(data) {
      //获取别人答题成绩
      let { elsescore } = that.state;
      elsescore += data * 1;
      that.setState({
        elsescore
      });
    });

    socket.on("user left", data => {
      console.log(data);
    });

    socket.on("message", data => {
      Modal.success({
        title: data,
        onOk() {
          that.props.history.push("/");
        }
      });
    });

    socket.on("get winner", function(data, info) {
      message.info(data);
      if (info === that.state.uid) {
        that.setState({
          isSuccess: true
        });
        http
          .get("/winnercount", {
            uid
          })
          .then(
            data => {
              console.log(data);
            },
            err => {
              console.log(err);
            }
          );
        that.showModal();
      } else {
        that.setState({
          isSuccess: false
        });
        that.showModal();
      }

      // socket.emit(`disconnect?uid=${that.state.uid}`, data => {
      //   //销毁房间
      //   console.log(data);
      // });
    });

    socket.on("get elsewinner", function(data) {
      //等待对方
      message.info(data);
    });
  }

  countDown = () => {
    let secondsToGo = 3;
    let { count } = this.state;
    let that = this;
    count++;
    const modal = Modal.success({
      title: "您的答题已超时,请进入下一题",
      content: ` ${secondsToGo} second 后进入.`
    });

    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: ` ${secondsToGo} second 后进入.`
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      that.setState({
        count
      });
      modal.destroy();
    }, secondsToGo * 1000);
  };

  checkanswer = (idx, qid, trueans, myans) => {
    let { outtime, myscore } = this.state;
    let score = "0";
    switch (true) {
      case outtime < 10 && trueans === myans:
        score = "5";
        break;
      case outtime < 20 && trueans === myans:
        score = "10";
        break;
      case outtime < 30 && trueans === myans:
        score = "20";
        break;
      case outtime < 40 && trueans === myans:
        score = "30";
        break;
      case outtime < 50 && trueans === myans:
        score = "40";
        break;
      case outtime < 60 && trueans === myans:
        score = "50";
        break;
      case outtime < 70 && trueans === myans:
        score = "60";
        break;
      case outtime < 80 && trueans === myans:
        score = "70";
        break;
      case outtime < 90 && trueans === myans:
        score = "80";
        break;
      case outtime < 100 && trueans === myans:
        score = "90";
        break;
      default:
        score = "0";
    }
    myscore += score * 1;
    this.setState({
      myscore
    });
    socket.emit(
      "set score",
      {
        uid: this.state.uid,
        score,
        qid
      },
      function(res) {
        // console.log(res);
      }
    );

    let { count } = this.state;
    let that = this;

    this.setState({
      toggleck: true,
      idx
    });

    time = setTimeout(() => {
      count++;
      if (count >= this.state.data.length) {
        that.info();
        return;
      }

      that.setState({
        count,
        toggleck: false
      });
    }, 1000);

    socket.emit(
      "get elseans",
      {
        uid: that.state.uid,
        idx,
        score
      },
      function(data) {
        socket.on("get get elesescore", function(data) {
          console.log(data);
        });
      }
    );
  };

  componentWillUnmount() {
    clearTimeout(time);
  }

  info = () => {
    //结束挑战
    let that = this;
    Modal.info({
      title: "挑战结束",
      onOk() {
        socket.emit(
          "get result",
          {
            uid: that.state.uid
          },
          function(data) {
            //console.log(data);
          }
        );
      }
    });
  };
}

export default Answer;
