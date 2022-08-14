var mysql = require("mysql");


  mysqls = mysql.createConnection({
      host: "10.15.101.251",
      user: "root",
      password: "3KMysKKu",
      port: "3306",
      database: "nodejs_demo",
    });
  mysqls.connect();
  function addChatId(fromQQ, config) {
    var addSql =
      "INSERT INTO chatid(Id,qq,conversationId,traceId) VALUES(0,?,?,?)";
    var addSqlParams = [fromQQ, config.conversationId, config.traceId];
    //增
    mysqls.query(addSql, addSqlParams, function (err, result) {
      if (err) {
        console.log("[INSERT ERROR] - ", err.message);
        return false;
      }
      return true;
    });
  }
  async function isHaveChatIdIn(fromQQ) {
    var sql = 'SELECT * FROM `chatid` WHERE `qq`="' + fromQQ + '"';
    //查
    let result = await querySync(sql);
    //mysqls.query(sql, function (err, result) {
    // if (err) {
    //   log.mark('[SELECT ERROR] - ', err.message);
    //   return false;
    // }
    console.log(result.length);
    if (result.length == 0) {
      return false;
    }
    return true;
    // });
  }
  async function getChatId(fromQQ) {
    var sql = 'SELECT * FROM `chatid` WHERE `qq`="' + fromQQ + '"';
    //查
    //mysqls.query(sql, function (err, result) {
    //if (err) {
    //   log.mark('[SELECT ERROR] - ', err.message);
    //   return false;
    //  }
    let result = await querySync(sql);
    if (result.length == 0) {
      return false;
    }
    console.log(result);
    return result[0];
    //});
    return false;
  }
  function querySync(sql, data) {
    return new Promise((resolve, reject) => {
      mysqls.query(sql, data, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
  module.exports = {addChatId,getChatId,isHaveChatIdIn};