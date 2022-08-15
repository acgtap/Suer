const fs = require('fs');
 
// directory path
const dir = './public';
 
// list all files in the directory
let basepath= 'public/biaoqingbao/';

const files = fs.readdirSync(basepath);
console.log(randomArray(files))
function randomArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }