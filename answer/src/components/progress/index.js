import React, { Component } from "react";
import { Progress } from "antd";
let timer = null;
let timer2 = null;
class Pro extends Component {
  state = {
    outtime: 100,
    count: 5
  };
  render() {
    return (
      <div className="Progress">
        <Progress
          strokeColor="#8561EC"
          percent={this.state.outtime}
          status="active"
        />
      </div>
    );
  }

  componentDidMount() {
    let { outtime } = this.state;
    let that = this;
    timer = setInterval(() => {
      outtime -= 10;
      that.setState({
        outtime
      });
      this.props.js(outtime);
      timer2 = setTimeout(() => {
        if (that.props.info) {
          clearInterval(timer);
        }
      }, 9000);
      if (outtime < 0) {
        clearInterval(timer);
        if (that.props.countDown) {
          that.props.countDown();
        }
        if (that.props.info) {
          that.props.info();
        }
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(timer);
    clearInterval(timer2);
  }
}

export default Pro;
