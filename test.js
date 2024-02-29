const fs=require('fs')
const Axios = require('axios')
const s = fs.readFileSync('/Users/DemonRay/Desktop/img/86.png', 'b')


let formData = new FormData();
      formData.append("files", s);
    return Axios({
      url: `https://mumblefe.cn/d2c/api/process`,
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        "Origin": "https://mumblefe.cn/"
      },
    }).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })