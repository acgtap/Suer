const request = require('request');
const path = require('path');
const fs= require('fs');
const moment= require('moment');
async function getMediaid(files){
        /**
         *上传本地
         */
        console.log(files)
        const file = files.file;
        const allow = ["jpg", "png", "jpeg","gif"];
        let ext = file.name.split('.')[1]
        if(allow.indexOf(ext)<0){
            //super.APIErr('1004', "上传格式不被允许")
        }
        // let reader = fs.createReadStream(file.path);
        // let newFilename = moment().format("X") + '.' + file.name.split('.')[1];
        // //先上传图⽚到本机服务器
        // const upStream = fs.createWriteStream(path.join(__dirname+`/public/media`, newFilename));
        // reader.pipe(upStream);
        // let file_path = path.resolve(__dirname, "public/media/"+newFilename);
        let file_path = file.path
        //let accesstoken = await this.getAccessToken();
        let api = 'http://api.weixin.qq.com/cgi-bin/media/upload?type=image'
        return new Promise((resolve, reject) => { 
            request.post({
                url:api,
                headers : { 'Content-Type' : 'multipart/form-data' },
                formData: {
                    media: {
                        value: fs.readFileSync(file_path),
                        options: {
                            filename: '1.png',
                            'content-type': 'image/png',
                        }
                    }
                }
            },(err, httpResponse, body) =>{
                if (err) {
                    reject(err)
                }
                console.log("ok"+body+","+err)
                resolve(JSON.parse(body))
            });
        })
    } 
async function start(){

    let json=await getMediaid({
        file:{
            name:"1.jpg",
            path:"1.jpg"
        }
    })
console.log("ok"+json)
}
module.exports=getMediaid;