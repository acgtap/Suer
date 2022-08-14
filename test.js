const fs= require('fs');
const _servant=require("./servant")
let upload=require('./upload')
let download=require('download')
let moment=require('moment')
async function start(){
  let filename = moment().format("X")+".png"
            let file_path='public/'+filename;
  fs.writeFileSync(file_path, await download("https://www.dmoe.cc/random.php"));
}
start()