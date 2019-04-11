import React, { Component } from "react";
import "./index.css";
// import http from "../../utils/http";
class Rule extends Component {
  render() {
    return (
      <div className="rule">
        <p>活动规则</p>
        <div className="box">
          <img src="images/rule.png" alt="" />
        </div>
      </div>
    );
  }
  componentDidMount() {
    // http.get("/rules").then(data => {
    //   console.log(data);
    // });
  }
}

export default Rule;
