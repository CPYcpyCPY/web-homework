/*
 * 检验器，用于检验用户输入的信息是否合法
 */
function Checker() {
    this.regExp = {
        username : /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/,
        id : /^[1-9][0-9]{7}$/,
        phone : /^[1-9][0-9]{10}$/,
        email : /^[a-zA-Z0-9_]+@[a-z0-9]{2,8}\.[a-z]{2,4}$/
    };
    this.errorMessage = ["Invalid username",
                        "Invalid id", "Invalid phone", "Invalid email"];
    this.nullMessage = ["username can't be null",
                        "id can't be null", "phone can't be null",
                        "email can't be null"];
    this.inputArea = document.getElementsByTagName("input");
    this.errorArea = document.getElementsByClassName("error");
}

/*
 * 添加检验事件，输入框失去焦点时对框内的内容进行检验
 * 若内容非法，给出errorMessage中对应的提醒消息
 * 若内容为空，给出nullMessage中对应的提醒消息
 */
Checker.prototype.addChecker = function() {
    for (var i = 0; i < 4; ++i) {
        var that = this;
        this.inputArea[i].onblur = (function(index) {
            return function() {
                if (!this.value) {
                    that.errorArea[index].textContent = that.nullMessage[index];
                } else if (!that.regExp[this.name].test(this.value)) {
                    that.errorArea[index].textContent = that.errorMessage[index];
                } else {
                    that.errorArea[index].textContent = "";
                }
            };
        })(i);
    }
};

/*
 * 重置输入框之后还应清空错误提醒区的消息
 */
Checker.prototype.afterReset = function() {
    var that = this;
    this.inputArea[4].onclick = function() {
        for (var i = 0; i < 4; ++i) {
            that.errorArea[i].textContent = "";
        }
    };
};

window.onload = function() {
    checker = new Checker();
    checker.addChecker();
    checker.afterReset();
};
