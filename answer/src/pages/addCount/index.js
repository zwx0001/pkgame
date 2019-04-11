import React, { Component } from "react";
import "./index.css";
import cookie from "../../utils/cookie";

let count = cookie.get("count") ? cookie.get("count") : 10;

class Addcount extends Component {
  render() {
    return (
      <div className="addcount">
        <p>
          <b>{count}</b>
        </p>
      </div>
    );
  }
}

export default Addcount;
