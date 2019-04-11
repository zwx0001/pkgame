import { Upload, Icon, message } from "antd";
import React from "react";
import "./index.css";
import http from "../../utils/http";
let uid = window.localStorage.getItem("uid")
  ? window.localStorage.getItem("uid")
  : "";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === "image/jpeg";
  if (!isJPG) {
    message.error("You can only upload JPG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJPG && isLt2M;
}

class Avatar extends React.Component {
  state = {
    loading: false
  };

  handleChange = info => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        this.setState({
          imageUrl,
          loading: false
        });
        http
          .post("/addPortrait", {
            uid,
            purl: imageUrl
          })
          .then(
            data => {
              console.log(data);
            },
            err => {
              console.log(err);
            }
          );
      });
    }
  };

  render() {
    const uploadButton = (
      <div>
        <Icon
          type={this.state.loading ? "loading" : "user-add"}
          style={{ fontSize: "30px" }}
        />
        <div className="ant-upload-text">上传头像</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="//jsonplaceholder.typicode.com/posts/"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
      </Upload>
    );
  }
}

export default Avatar;
