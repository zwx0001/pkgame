import React, { Component } from "react";
import "./index.css";
import { Form, Icon, Input, Button, message } from "antd";
import Avatar from "../../components/upload";

class Reg extends Component {
  handleSubmit = e => {
    e.preventDefault();
    let that = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let { userName, password, userTel } = values;
        let reg = /^1(3|4|5|7|8)\d{9}$/;

        if (userTel && userTel.trim() && reg.test(userTel)) {
          if (userName && userName.trim() && password && password.trim()) {
            fetch("/reg", {
              method: "POST",
              headers: {
                "content-Type": "application/json"
              },
              body: JSON.stringify({
                user_nickname: userName,
                user_pwd: password,
                user_tel: userTel
              })
            })
              .then(res => res.json())
              .then(data => {
                if (data.code === 1) {
                  message.success(data.msg);
                  that.props.history.push("/login");
                } else {
                  message.error(data.msg);
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            message.error("您的填写不完整！");
          }
        } else {
          message.error("您的电话号不符合规则！");
        }
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="reg">
        <div className="form">
          <div className="head">
            <Avatar />
          </div>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator("userName", {
                rules: [
                  { required: true, message: "Please input your username!" }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Username"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("password", {
                rules: [
                  { required: true, message: "Please input your Password!" }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="Password"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("userTel", {
                rules: [
                  { required: true, message: "Please input your usertel!" }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="phone" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Usertelephone"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                注册
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}
const WrappedNormalLoginForm = Form.create({ name: "normal_login" })(Reg);
export default WrappedNormalLoginForm;
