const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB, Counter } = require("./db");
const moment = require("moment");
const logger = morgan("tiny");
const fs = require("fs");
const _servant = require("./servant");
let upload = require("./upload");
let download = require("download");
// let sendmess=require('./sendmess')
let ciku = require("./chat").iceAI_word;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

let servant = {
  process: "", //记录当前用户是谁
  lock: false, //锁，如果为假则是自由状态
  time: "", //上次时间
};

setInterval(function () {
  //每个小时执行一次
  if (moment(servant.time, "X").add(5, "minutes").isAfter(moment())) {
    console.log("没过期:" + servant);
    //过期时间在现在的后面
  } else {
    //过期了解锁
    console.log("过期了" + servant);
    servant.lock = false;
  }
}, 300000);

function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
}
function randomArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 首页
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 更新计数
app.post("/api/count", async (req, res) => {
  const { action } = req.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }
  res.send({
    code: 0,
    data: await Counter.count(),
  });
});

// 获取计数
app.get("/api/count", async (req, res) => {
  const result = await Counter.count();
  res.send({
    code: 0,
    data: result,
  });
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});

// 消息回复
app.post("/api/message", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    let example = {
      ToUserName: "gh_919b00572d95", // 小程序/公众号的原始ID，资源复用配置多个时可以区别消息是给谁的
      FromUserName: "oVneZ57wJnV-ObtCiGv26PRrOz2g", // 该小程序/公众号的用户身份openid
      CreateTime: 1651049934, // 消息时间
      MsgType: "text", // 消息类型
      Content: "回复文本", // 消息内容
      MsgId: 23637352235060880, // 唯一消息ID，可能发送多个重复消息，需要注意用此 ID 去重
    };
    console.log("消息推送", req.body);
    if (req.body.action == "CheckContainerPath") {
      res.send("success");
      return;
    }
    const { ToUserName, FromUserName, MsgType, Content, CreateTime, MsgId } =
      req.body;
    if (req.body.MsgType == "text") {
      if (Content == "【收到不支持的消息类型，暂无法显示】") {
        let json = {
          ToUserName: req.body.FromUserName,
          FromUserName: req.body.ToUserName,
          CreateTime: req.body.CreateTime,
          MsgType: "text",
          Content: "我还不能回复这种类型的消息。",
        };
        console.log("消息回复", json);
        res.send(json);
        return;
      }
      if (Content == "随机图片") {
        let filename = moment().format("X") + ".png";
        let file_path = "public/" + filename;
        //fs.writeFileSync(file_path, );
        let body = await upload(
          {
            file: {
              name: filename,
              path: file_path,
            },
          },
          await download("https://www.dmoe.cc/random.php")
        );

        res.send({
          ToUserName: FromUserName,
          FromUserName: ToUserName,
          CreateTime: CreateTime,
          MsgType: "image",
          Image: {
            MediaId: body.media_id,
          },
        });
        return;
        // await sendmess(appid, {
        //     touser: FromUserName,
        //     msgtype: 'image',
        //     image: {
        //       media_id: body.media_id
        //     }
        //   })
      }
      if (Content.indexOf("头像盲盒") != -1) {
        let basepath = "";
        if (Content.indexOf("女生") != -1) {
          basepath = "public/touxiang/";
        } else if (Content.indexOf("男生") != -1) {
          basepath = "public/touxiangBoy/";
        } else if (Content.indexOf("动漫") != -1) {
          basepath = "public/touxiangDman/";
        } else {
          let dir = randomArray(["touxiang", "touxiangBoy", "touxiangDman"]);
          basepath = "public/" + dir + "/";
        }

        const files = fs.readdirSync(basepath);
        let filename = randomArray(files);
        let file_path = basepath + filename;
        let body = await upload(
          {
            file: {
              name: filename,
              path: file_path,
            },
          },
          fs.readFileSync(file_path)
        );

        res.send({
          ToUserName: FromUserName,
          FromUserName: ToUserName,
          CreateTime: CreateTime,
          MsgType: "image",
          Image: {
            MediaId: body.media_id,
          },
        });
        return;
        // await sendmess(appid, {
        //     touser: FromUserName,
        //     msgtype: 'image',
        //     image: {
        //       media_id: body.media_id
        //     }
        //   })
      }
      if (
        Content.indexOf("背景盲盒") != -1 ||
        Content.indexOf("壁纸盲盒") != -1 ||
        Content.indexOf("表情盲盒") != -1
      ) {
        let basepath = "";
        if (
          Content.indexOf("背景盲盒") != -1 ||
          Content.indexOf("壁纸盲盒") != -1
        ) {
          basepath = "public/background/";
        } else if (Content.indexOf("表情包盲盒") != -1) {
          basepath = "public/biaoqingbao/";
        } else {
          basepath = "public/biaoqingbao/";
        }

        const files = fs.readdirSync(basepath);
        let filename = randomArray(files);
        let file_path = basepath + filename;
        // files object contains all files names
        // log them on console
        // files.forEach(file => {
        //     console.log(file);
        // });

        //fs.writeFileSync(file_path, );
        let body = await upload(
          {
            file: {
              name: filename,
              path: file_path,
            },
          },
          fs.readFileSync(file_path)
        );

        res.send({
          ToUserName: FromUserName,
          FromUserName: ToUserName,
          CreateTime: CreateTime,
          MsgType: "image",
          Image: {
            MediaId: body.media_id,
          },
        });
        return;
        // await sendmess(appid, {
        //     touser: FromUserName,
        //     msgtype: 'image',
        //     image: {
        //       media_id: body.media_id
        //     }
        //   })
      }

      const appid = req.headers["x-wx-from-appid"] || "";
      if (servant.lock == true) {
        if (servant.process == FromUserName) {
          //此用户在锁内，记录时间，servant处理
          servant.time = moment().format("X");
          //调用servant服务
          let reply = await _servant({
            Content,
          });
          let json = {
            ToUserName: req.body.FromUserName,
            FromUserName: req.body.ToUserName,
            CreateTime: req.body.CreateTime,
            MsgType: "text",
            Content: reply,
          };
          console.log("消息回复", json);
          res.send(json);
          return;
        } else {
          //锁外，直接跳过，就由小冰处理
        }
      } else {
        //锁为空 把自己插入进去
        servant.lock = true;
        servant.process = FromUserName;
        //调用servant服务
        let reply = await _servant({
          Content,
        });
        let json = {
          ToUserName: req.body.FromUserName,
          FromUserName: req.body.ToUserName,
          CreateTime: req.body.CreateTime,
          MsgType: "text",
          Content: reply,
        };
        console.log("消息回复", json);
        res.send(json);
        return;
      }
      let reply = await ciku({
        ToUserName: req.body.ToUserName,
        FromUserName: req.body.FromUserName,
        CreateTime: req.body.CreateTime,
        MsgType: "text",
        Content: req.body.Content,
        MsgId: req.body.MsgId,
      });
      let json = {
        ToUserName: req.body.FromUserName,
        FromUserName: req.body.ToUserName,
        CreateTime: req.body.CreateTime,
        MsgType: "text",
        Content: reply,
      };
      console.log("消息回复", json);
      res.send(json);
      return;
    } else if (Content == "【收到不支持的消息类型，暂无法显示】") {
      let json = {
        ToUserName: req.body.FromUserName,
        FromUserName: req.body.ToUserName,
        CreateTime: req.body.CreateTime,
        MsgType: "text",
        Content: "我还不能回复这种类型的消息。",
      };
      console.log("消息回复", json);
      res.send(json);
    } else {
      res.send("success");
      return;
    }
  }
});

const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
