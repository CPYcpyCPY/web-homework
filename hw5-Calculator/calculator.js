// 计算器类
function Calculator() {
    this.expression = "";
    this.ans = "";
    this.keys = {
        "one"           : '1',
        "two"           : '2',
        "three"         : '3',
        "four"          : '4',
        "five"          : '5',
        "six"           : '6',
        "seven"         : '7',
        "eight"         : '8',
        "nine"          : '9',
        "zero"          : '0',
        "add"           : '+',
        "subtract"      : '-',
        "multiply"      : '*',
        "divide"        : '/',
        "point"         : '.',
        "left-bracket"  : '(',
        "right-bracket" : ')'
    };
    this.buttons = document.getElementsByTagName("button");
    this.myScreen = document.getElementById("screen");
    this.justCalculated = false;
}

// 计算器类成员方法

/*
 * 更新显示屏内容
 */
Calculator.prototype.refresh =  function(content) {
    this.myScreen.innerHTML = content;
}

/*
 * 处理可以加入表达式的字符
 * 如果刚进行过一次运算，则expression中保存用户上次计算的答案。
   此时用户输入如果是运算符，表示他想继续用这个答案做运算，
   如果输入不是运算符，则应清空上一次计算的答案，以表示重新
   开始另一次运算。
 */
Calculator.prototype.process = function(id) {
    if (this.justCalculated) {
        if (id != "add" && id != "subtract"
            && id != "multiply" && id != "divide") {
            this.expression = "";
        }
        this.justCalculated = false;
    }

    this.expression += this.keys[id];
    // 更新显示屏前对表达式长度进行判断
    // 长度超过显示屏长度时仅显示表达式的后面部分
    if (this.expression.length < 35) {
        this.refresh(this.expression);
    } else {
        this.refresh(this.expression.substring(this.expression.length-35,
            this.expression.length));
    }
}

/*
 * 删除表达式中全部或最后一个字符
 * 如果刚进行过一次计算，再次按删除最后字符时
   应该是清空重新开始
 */
Calculator.prototype.deleteEntry = function(id) {
    if (id == "clear-all") {
        this.expression = "";
    } else if (id == "delete") {
        if (this.justCalculated) {
            this.expression = "";
            this.justCalculated = false;
        } else {
            this.expression = this.expression.substring(0,
                                this.expression.length-1);
        }
    }

    this.refresh(this.expression);
}

/*
 * 给出计算答案
 * 如果表达式合法，计算之后保存答案在expression中
   以便后面用户想继续用这个答案做下一步计算
 * 如果表达式非法则清空表达式，提示错误信息
 */
Calculator.prototype.answer = function() {
    try {
        this.ans = eval(this.expression);
        if (this.ans == undefined || this.ans == Infinity) {
            // 当用户输入不合法而eval不会抛异常时
            // 比如输入表达式为"()"或者"1/0"。这里需要抛一个异常
            throw "Invalid expression";
        }
        if (typeof(this.expression) == "string" &&
            this.expression.indexOf("//") != -1) {
            // 当用户输入的运算符包含"//"时，eval不会抛异常
            // 此时需要抛一个异常
            throw "Invalid expression";
        }
        this.justCalculated = true;
    } catch (Exception) {
        alert("Invalid expression !");
        this.ans = "";
    }

    this.expression = this.ans;
    this.refresh(this.ans);
}

/*
 * 处理点击事件
 * 根据按键的id判断该执行对应的函数
 */
window.onload = function() {
    var calculator = new Calculator();
    for (var i = 0; i < calculator.buttons.length; ++i) {
        calculator.buttons[i].onclick = function() {
            if (this.id == "equal") {
                calculator.answer();
            } else if (this.id == "clear-all" || this.id == "delete") {
                calculator.deleteEntry(this.id);
            } else {
                calculator.process(this.id);
            }
        };
    }
}
