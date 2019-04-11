let http = {
  post(url, params) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        body: JSON.stringify(params),
        method: "POST",
        headers: {
          "content-Type": "application/json"
        }
      })
        .then(res => {
          return res.json();
        })
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  get(url, params) {
    var param = "";
    if (params) {
      param = "?";
      Object.keys(params).forEach(item => {
        param += item + "=" + params[item] + "&";
      });
      param = param.slice(0, param.length - 1);
    }
    return new Promise((resolve, reject) => {
      fetch(url + param, {
        headers: {
          "content-Type": "application/json"
        }
      })
        .then(res => {
          return res.json();
        })
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

export default http;
