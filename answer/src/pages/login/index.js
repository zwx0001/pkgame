import React, { Component } from "react";
import "./index.css";
import { Form, Icon, Input, Button, message } from "antd";

class Login extends Component {
  state = {
    img: "http://img5.imgtn.bdimg.com/it/u=3817824897,1768495848&fm=26&gp=0.jpg"
  };
  handleSubmit = e => {
    e.preventDefault();
    let that = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let { password, userTel } = values;
        if (password && password.trim() && userTel && userTel.trim()) {
          fetch("/login", {
            method: "POST",
            headers: {
              "content-Type": "application/json"
            },
            body: JSON.stringify({
              user_pwd: password,
              user_tel: userTel
            })
          })
            .then(res => res.json())
            .then(data => {
              console.log(data); //获取得到的用户信息
              if (data.code === 1) {
                that.setState({
                  img: data.data.user_url
                });
                message.success(data.msg);
                document.cookie = "count=10";
                document.cookie = `user_token=${data.token}`; //将token存在cookies中
                window.localStorage.setItem("uid", data.data.user_id); //本地存储id
                window.localStorage.setItem("u_headimg", data.data.user_url);
                that.props.history.push("/");
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
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <div className="form">
          <div className="head">
            <img alt="" src={this.state.img} />
          </div>
          <Form onSubmit={this.handleSubmit} className="login-form">
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
                登录
              </Button>
              Or <a href="/reg">register now!</a>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }

  componentDidMount() {
    let u_headimg = window.localStorage.getItem("u_headimg")
      ? window.localStorage.getItem("u_headimg")
      : "http://img5.imgtn.bdimg.com/it/u=3817824897,1768495848&fm=26&gp=0.jpg";
    this.setState({
      img: u_headimg
    });
  }
}
const WrappedNormalLoginForm = Form.create({ name: "normal_login" })(Login);
export default WrappedNormalLoginForm;
