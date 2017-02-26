/*
 * 本模块用于读取和存储网站数据，提供相应的接口和数据
 * 由于本次作业数据量较小，应此本模块在操作过程中先将所有数据读入到内存
   以避免多次读写文件造成效率低下
 */

var fs = require('fs');

module.exports = {
  /*
   * 网站数据(出了用户数据还包括HTML模板和相应的CSS,JS,图片等静态文件)
   */
  student    : {},
  signupPage : "",
  mainPage   : "",
  signupCss  : "",
  signupJs   : "",
  mainCss    : "",
  bgImage    : null,

  /*
   * 加载数据函数
   * 将文件中的数据加载到内存
   */
  load : function() {
    var _this = this;
    fs.readFile(__dirname + '/../data/student.json', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        _this.student = JSON.parse(data);
      }
    });
    fs.readFile(__dirname + '/../views/signup.html', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        _this.signupPage = data.toString();
      }
    });
    fs.readFile(__dirname + '/../views/index.html', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        _this.mainPage = data.toString();
      }
    });
    fs.readFile(__dirname + '/../public/js/signup.js', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        _this.signupJs = data.toString();
      }
    });
    fs.readFile(__dirname + '/../public/css/signup.css', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        _this.signupCss = data.toString();
      }
    });
    fs.readFile(__dirname + '/../public/css/index.css', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        _this.mainCss = data.toString();
      }
    });
    fs.readFile(__dirname + '/../public/img/bg.jpg', 'binary', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        _this.bgImage = data;
      }
    });
  },

  /*
   * 添加数据函数
   * 用于用户注册时向studentData添加新成员，同时写入到文件
   */
  add : function(data) {
    this.student[data.username] = data;
    fs.writeFile(__dirname + "/../data/student.json", JSON.stringify(this.student));
  }
};