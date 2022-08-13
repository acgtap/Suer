let ciku=require("./chat").iceAI_word
async function start(){
    console.log(await ciku({
        ToUserName: "gh_919b00572d95", // 小程序/公众号的原始ID，资源复用配置多个时可以区别消息是给谁的
        FromUserName: "oVneZ57wJnV-ObtCiGv26PRrOz2g", // 该小程序/公众号的用户身份openid
        CreateTime: 1651049934, // 消息时间
        MsgType: "text", // 消息类型
        Content: "你好呀", // 消息内容
        MsgId: 23637352235060880, // 唯一消息ID，可能发送多个重复消息，需要注意用此 ID 去重
      }))
}

start()
// let a={
//   app:'a'
// };
// console.log(a.ap)