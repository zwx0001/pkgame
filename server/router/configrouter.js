const fs = require("fs");
const path = require("path");

function getControllers(router, dir = "controller") {
  let pathname = path.join(process.cwd(), dir);
  let files = fs.readdirSync(path.join(process.cwd(), dir));
  files.forEach(item => {
    if (item.endsWith(".js")) {
      let contentFile = require(pathname + "/" + item);
      addRouter(router, contentFile);
    }
  });
}

function addRouter(router, obj) {
  for (let i in obj) {
    if (i.startsWith("POST")) {
      router.post(i.slice(5), obj[i]);
    } else {
      router.get(i.slice(4), obj[i]);
    }
  }
}

module.exports = function(router, dir) {
  getControllers(router, dir);
  return router.routes();
};
