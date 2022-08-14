let sendmess=require('./sendmess')
let scookie = '';//cookie
let download=require('download')
let upload=require('./upload')
let request=require('request')
let surl=''
/*
@descript 更nb的ai
*/ 
async function MoreIce(FromUserName,text,appid) {
    return new Promise(async (resolve, reject) => {
    let cookie = "";
    text = text.replace( 
      /[`:_.~!@#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ·~！@#￥%……&*（）—— \+ ={}|《》？：“”【】、；‘’，。、]/g,
      ""
    );
    
    if (scookie == null || scookie == undefined || scookie=='') {
      cookie ='uxplusaffinity=1655282322.763.2534.804511; cpid=GEkjtCEzOjJeTCtLeTEoNTFKbzEYtSFJXDJDM9hIUzVJAA; salt=00724C00FB368F765FE816A61F7A84EB; .AspNetCore.Session=CfDJ8ERZhkNG/mFHjVPUGvk8eparMPKadtSnAUs64i8TmyrYk5y2XcSM9WDcmy6XqezeLrXzml9pYMcbQ0fNtJ8pOWA3Qpm9W7FY22laQvC5v3+B/PpyqoVJAVHNfAnPPI782CJ/iatnJC2/0xxePhZTkM+hWxhO2xaCN3Tao4sKWJCT; afuidcode=E5tq0WYvqb-U6elaY1KuWs757Y9f0WqGtm2KIpzQ71mJ_q6NWpBrxrBtjyQcMzFtuLjNmP4u4lrzxVu7EC9km2g; logInfo={"pageName":"builtinvirtualchat","tid":"dfa951aedf274e0df9e320afb1c884e2"}';
      //cookie=await getNewCookie(FromUserName,text,appid);
    } else {
      cookie = scookie;
    }
    console.log("Ice cookie:" + scookie);
    var options = {
      method: "POST",
      url: "https://ux-plus-bing.xiaoice.com/s_api/game/getresponse?workflow=AIBeingsBingGFChat",
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "content-type": "application/json;charset=UTF-8",
        origin: "https://ux-plus-bing.xiaoice.com",
        referer: surl,
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36",
        "content-type": "application/json",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "Windows",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        cookie: scookie,
      },
      body:
        '{"TraceId":"dab801035f0428a1ff57575b75f531b8f","PartnerName":"bingaibeings","SubPartnerId":"virtualgf","Content":{"Text":"' +
        text +
        '","Metadata":{}}}',
    };
    request(options, async function (error, response) {
      if (error) throw new Error(error);
      if (
        response.body == "Access denied. Context missing." ||
        response.statusCode == "400"
      ) {
        console.log("Need auth"+response.statusCode+":" + response.body);
        let reply=await getNewCookie(FromUserName,text,appid);
        resolve(reply);
        // iceAI_word(text, fromQQ, bot, "", 1, 1, log, Message);
        // log.warn("转交给iceAI")
        return;
      }
      if (response.statusCode != 200) {
        console.log("requestCode:" + response.statusCode);
        // await sendmess(appid, {
        //     touser: FromUserName,
        //     msgtype: 'text',
        //     text: {
        //       content: '处理错误。'
        //     }
        //   })
        return;
      }
      let result = JSON.parse(response.body);
      console.log("这条消息有" + result.length + "条");
      let reply='';
      
      for (r of result) {
        console.log(r);
        if (r.Content.Text == null || r.Content.Text == undefined) {
          if (r.Content.ImageUrl != null) {
              //发送图片
            // bot.sendMessage({
            //   friend: fromQQ,
            //   message: new Message().addImageUrl(r.Content.ImageUrl),
            // });
            let filename = moment().format("X")+".png"
            let file_path='public/'+filename;
            fs.writeFileSync(file_path, await download(r.Content.ImageUrl));
            let body=await upload({
                    file:{
                        name: filename,
                        path: file_path
                    }
                }
             )
            //  await sendmess(appid, {
            //     touser: FromUserName,
            //     msgtype: 'image',
            //     image: {
            //       media_id: body.media_id
            //     }
            //   })

          }
        } else {
            // await sendmess(appid, {
            //     touser: FromUserName,
            //     msgtype: 'text',
            //     text: {
            //       content: r.Content.Text
            //     }
            //   })
        //   bot.sendMessage({
        //     friend: fromQQ,
        //     message: new Message().addText(r.Content.Text),
        //   });
        if(result.length>1){
            reply+=r.Content.Text+","
        }else{
            reply+=r.Content.Text
        }
         
        }
      }
      resolve(reply)
    });
    })
  }
function getNewCookie(
    FromUserName,text,appid
  ) {
    return new Promise((resolve, reject) => {
    let cookie =
      ".AspNetCore.Antiforgery.cEwzT8cw35M=CfDJ8GrhB5lM6UlCoCUgHHKCleios-rVWl05IVx9_3IMYGe3tAPFABwOQgXwFIx53tgrcnh3xXlFF3clt-n2dtwq1QsOMRj6GHxwz4ZYt8teDXclSMEAmkXem6Q89A5iJHtfFKMlo_SQSPpeqsos5E5XprA; .AspNetCore.Session=CfDJ8GrhB5lM6UlCoCUgHHKClej3XdE1RqQmT26DaNImhXDLsiIYQTmyou4wkJWbCNwP3h77OGU1B7G2AVhHf5KhV1/1o8LCDbNC/Qojl6V9SrWFezFXTfYf0wb2rknSrXcyZfQcenSvhNKroLij09N1XJEuP0+XlRt9V57NbfqrSPMg; SessionGuestId=4EjdMF5KRDBaSywzezErMckwEU3lMF20WTVCNV00UktKAA; .AspNetCore.Mvc.CookieTempDataProvider=CfDJ8KnXpXHnRH9LsyCF6UzWJvIjY6rhuxeWFQnEx1savuFSbceF9F0BnIOhr9NS-pWy3NXElbxNUKBHFxTdbnfORNg0bZ9HrFpJQP8LcqpnrUwe7JXLz39_R4HiJzGr5CJeXV6xB05q3LU4OBqSCBbGm2f_KYv5uaySqlJhTTwJ2K8wYduvsPIQa5Pee2xA_r9RBA; .AspNetCore.Identity.Application=CfDJ8KnXpXHnRH9LsyCF6UzWJvJ5rtYmaQGbCLBGNv12FQPk1ggdW3Ns_nntOmsKo9t1ojpO9joJWYbhieFQtaZcC3ErrCmHf685Ij7pvst9zqLJ-yLUucQYNb7_MVelUGsEA680gb2jGDAzJ1F8lkJjxwo_PGNMxl4tbE-YOB1XtVmgTH6znoaZ9Ux4DHKCK3-TZMxDyb1NGQ1enIx4bJp0lTUPbjh2z3-i2Itb-ldhvekS7RcDyDuel-PXHAEYhUX7JfpCKXHC3bMA9SVZwDk-uIdCvXeUL6hYlGwcd44ctdTHWSCD6qCqm6BSNfyk5tG1J2LH3ktCazsmyT4Gp9h2QT3gTgDIwXICXgjl7AsK8PaJU57Vwtx-msqQPJ9uXD8r39TpnI9jPPOuxGaLNUxzWoDjIa5RjHFq8eMQZq4-WyboZa4QZnrKelL8TSzNZfHlihESsEKcbCYsRkhxi_dqx9t5inUwcjMjN0IpvQ89x5a-wpqnl6XzdPOu5UcJJeSM1UUnFUPkaZU-2_ZYhDUzS48";
    // await getAuth(options,redis)
    var options = {
      method: "GET",
      url: "https://ux-plus-bing.xiaoice.com/BingVirtualGF",
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "user-agent":
          "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "Windows",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "if-none-match": 'W/"4e332-HZ+IEsunhtQ2uWdBiM/B3pjH6do"',
        "upgrade-insecure-requests": "1",
        "sec-fetch-user": "?1",
        cookie: cookie,
      },
      //body: '{"TraceId":"dab801035f0428a1ff57575b75f531b8f","PartnerName":"bingaibeings","SubPartnerId":"virtualgf","Content":{"Text":"' + encodeURIComponent("我爱你") + '","Metadata":{}}}'
    };

    request(options, async function (error, response) {
      if (error) reject(error.toString());
      if (response.statusCode != "200") {
        console.log("requestCode:" + response.statusCode);
      }
      console.log("requestCode:" + response.statusCode);
      var responseCookies = response.headers["set-cookie"];
      //console.log(response);
      //fs.writeFileSync("./text.json", JSON.stringify(response))
      var requestCookies = "";
      for (var i = 0; i < responseCookies.length; i++) {
        var oneCookie = responseCookies[i];
        oneCookie = oneCookie.split(";");
        requestCookies = requestCookies + oneCookie[0] + ";";
      }
      let url = response.request.href;
      console.log("即将登录请求的地址: " + url);
      surl= url;
      scookie=cookie;
      let reply=await getReply(
        url,
        requestCookies,
        FromUserName,text,appid
      )
      resolve(reply)
      // getCookie(url, requestCookies);
      
    });
})
  }

  async function getReply(
    url,
    cookie,
    FromUserName,text,appid
  ) {
    return new Promise((resolve, reject) => {
    var options = {
      method: "POST",
      url: "https://ux-plus-bing.xiaoice.com/s_api/game/getresponse?workflow=AIBeingsBingGFChat",
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "content-type": "application/json;charset=UTF-8",
        origin: "https://ux-plus-bing.xiaoice.com",
        referer: url,
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36",
        "content-type": "application/json",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "Windows",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        cookie: cookie,
      },
      body:
        '{"TraceId":"dab801035f0428a1ff57575b75f531b8f","PartnerName":"bingaibeings","SubPartnerId":"virtualgf","Content":{"Text":"' +
        text +
        '","Metadata":{}}}',
    };
    request(options, async function (error, response) {
      if (error) reject(error.toString());
      console.log(response.body);
      if (
        response.body == "Access denied. Context missing." ||
        response.statusCode == "400" ||
        response.statusCode != "200"
      ) {
          let ciku= require('./chat').iceAI_word
          let reply=await ciku({
            ToUserName: '',
            FromUserName: FromUserName,
            CreateTime: '',
            MsgType: "text",
            Content: text,
            MsgId: '',
          });
          console.log("finially,转交给iceAI");
        console.log("疑似cookie失效");
         resolve(reject);
          
        return;
      }
      let result = JSON.parse(response.body);
      console.log("这条消息有" + result.length + "条");
      let reply='';
      
      for (r of result) {
        console.log(r);
        if (r.Content.Text == null || r.Content.Text == undefined) {
          if (r.Content.ImageUrl != null) {
              //发送图片
            // bot.sendMessage({
            //   friend: fromQQ,
            //   message: new Message().addImageUrl(r.Content.ImageUrl),
            // });
            let filename = moment().format("X")+".png"
            let file_path='public/'+filename;
            fs.writeFileSync(file_path, await download(r.Content.ImageUrl));
            let body=await upload({
                    file:{
                        name: filename,
                        path: file_path
                    }
                }
             )
            //  await sendmess(appid, {
            //     touser: FromUserName,
            //     msgtype: 'image',
            //     image: {
            //       media_id: body.media_id
            //     }
            //   })

          }
        } else {
            // await sendmess(appid, {
            //     touser: FromUserName,
            //     msgtype: 'text',
            //     text: {
            //       content: r.Content.Text
            //     }
            //   })
        //   bot.sendMessage({
        //     friend: fromQQ,
        //     message: new Message().addText(r.Content.Text),
        //   });
        if(result.length>1){
            reply+=r.Content.Text+","
        }else{
            reply+=r.Content.Text
        }
         
        }
      }
      resolve(reply)
    });
})
  }
async function _servant({
    Content,
  }){
let reply = await MoreIce('',Content,'')
  return reply;
  }
    // console.log("o:"+_servant({
    //     Content:"哈哈哈"
    //   }))

  
  module.exports =_servant;