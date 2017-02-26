// 获取写在CSS文件里的CSS属性
function getStyle(ele) {
    var style = null;
    if(window.getComputedStyle) {
        style = window.getComputedStyle(ele, null);
    } else {// 兼容IE
        style = ele.currentStyle;
    }
    return style;
}

// 交换两个元素的类名
function SwapClassName(ele1, ele2) {
    var temp = ele1.className;
    ele1.className = ele2.className;
    ele2.className = temp;
}
//////////////////////////////////////////////////////////////////////////////
// 拼图游戏类
function FifteenPuzzle() {
    this.gameArea = document.getElementById("game-area");
    this.timeInfo = document.getElementById("timer");
    this.stepInfo = document.getElementById("steps");
    this.fullImg = document.getElementById("full-img");
    this.clickMe = document.getElementById("click-me");
    this.imgBlocks = [];// 存储每个图片块
    this.playing = false;// 记录游戏开始||结束
    this.times = 0;// 记录游戏时间
    this.steps = 0;// 记录玩家走过的步数
    this.timeCount = null;// 游戏计时器
    this.bg = "bg-0";// 记录当前背景图片，便于后面切换
}

// 创建图片小块
FifteenPuzzle.prototype.createImgBlock = function() {
    for (var i = 0; i < 16; ++i) {
        this.imgBlocks.push(document.createElement("div"));
        this.imgBlocks[i].id = "block-" + i;
        this.gameArea.appendChild(this.imgBlocks[i]);
    }
}

// 改变图片块位置
FifteenPuzzle.prototype.randomPosition = function(notExample) {
    // 图片初始化位置(简单示例的图片位置)
    var map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 12, 13, 14, 11];
    this.clickMe.className = "show";
    if (notExample) {// 如果不是简单示例则随机打乱图片顺序
        this.clickMe.className = "hide";
        // 随机走的步数
        var moveStep = Math.floor(Math.random()*400);
        var blank = 11, move = null;
        /* 随机选空白块相邻的块，0,1,2,3分别代表上下左右
         * 每次还需判断所选择的块是否合法，比如若空白块在第一行则其上没有相邻的块
         * 需要判断的情况：第一行上方没有块，最后一行下方没有块，
           左右移动必须在同一行内进行，最左一列左方没有块，最右一列右方没有块
         * 如果本次所选方向非法则将move指向空白块，即不移动
         * 此过程相当于模拟在一个顺序正确的拼图上随机点击的过程，按照逆向顺序即可解除拼图 */
        for (var i = 0; i < moveStep; ++i) {
            var dir = Math.floor(Math.random()*4);
            if (dir == 0 && blank-4 >= 0) {
                move = blank-4;
            } else if (dir == 1 && blank+4 < 16) {
                move = blank+4;
            } else if (dir == 2 && blank-1 >= 0
            && parseInt((blank-1)/4) == parseInt((blank/4))) {
                move = blank-1;
            } else if (dir == 3 && blank+1 < 16
            && parseInt((blank+1)/4) == parseInt((blank/4))) {
                move = blank+1;
            } else {
                move = blank;
            }
            // 移动即交换两个块
            var temp = map[blank];
            map[blank] = map[move];
            map[move] = temp;
            // 记录空白块的新位置
            blank = move;
        }
    }
    // 根据map中模拟的位置调整图片块位置
    for (var i = 0; i < 16; ++i) {
        this.imgBlocks[map[i]].className = "img-block " + this.bg + " row-"
                                        + parseInt(i/4) + " col-" + parseInt(i%4);
    }
}

// 更新时间
FifteenPuzzle.prototype.refreshTime = function() {
    this.timeInfo.innerHTML = "time: " + this.times;
}

// 更新步数
FifteenPuzzle.prototype.refreshStep = function() {
    this.stepInfo.innerHTML = "step: " + this.steps;
}

// 检查是否完成拼图
FifteenPuzzle.prototype.check = function() {
    this.playing = false;
    for (var i = 0; i < this.imgBlocks.length; ++i) {
        // 如果完成拼图，图片块的位置满足 id == 4*row+col
        // 根据类名和id即可进行判断, imgBlocks根据id顺序存储，用i即可
        var pos = this.imgBlocks[i].className;
        if (parseInt(pos[19])*4+parseInt(pos[25]) != i)
            this.playing = true;
    }
    if (!this.playing) {// 完成拼图，游戏结束
        clearInterval(this.timeCount);
        this.timeCount = null;
        alert("恭喜你在" + this.times + "秒内用了" + this.steps + "步完成了拼图.");
        this.fullImg.className = this.bg + " not-move";
        this.clickMe.className = "hide";
    }
}

// 给每个图片块(除了空白块)添加点击事件
FifteenPuzzle.prototype.addClickEvent = function() {
    var that = this;
    for (var i = 0; i < this.imgBlocks.length-1; ++i) {
        this.imgBlocks[i].onclick = function () {
            var top = getStyle(this)["top"];
            var left = getStyle(this)["left"];
            var blank_top = getStyle(that.imgBlocks[15])["top"];
            var blank_left = getStyle(that.imgBlocks[15])["left"];
            // 通过位置，往上下左右四个方向判断是否与空白块相邻
            // 若与空白块相邻则移动至空白块的位置，即交换位置
            if (parseInt(top) - 100 + "px" == blank_top && left == blank_left) {
                SwapClassName(this, that.imgBlocks[15]);
            } else if (parseInt(top) + 100 + "px" == blank_top && left == blank_left) {
                SwapClassName(this, that.imgBlocks[15]);
            } else if (parseInt(left) - 100 + "px" == blank_left && top == blank_top) {
                SwapClassName(this, that.imgBlocks[15]);
            } else if (parseInt(left) + 100 + "px" == blank_left && top == blank_top) {
                SwapClassName(this, that.imgBlocks[15]);
            } else {// 若未移动，步数减1防止后面多加1步
                that.steps -= 1;
            }
            // 移动完之后更新步数并检查是否完成了拼图
            that.steps += 1;
            that.refreshStep();
            that.check();
        }
    }
}

// 游戏开始
FifteenPuzzle.prototype.startGame = function() {
    this.fullImg.className = this.bg + " move";
    this.playing = true;
    this.times = 0;
    this.steps = 0;
    this.refreshTime();
    this.refreshStep();
    if (!this.timeCount) {
        var that = this;
        this.timeCount = setInterval(function() {
            that.times += 1;
            that.refreshTime();
        }, 1000);
    }
}

// 改变游戏图片
FifteenPuzzle.prototype.changeImage = function() {
    this.bg = "bg-" + (parseInt(this.bg[3]) + 1) % 10;
    for (var i = 0; i < 16; ++i) {
        var oldClassName = this.imgBlocks[i].className;
        this.imgBlocks[i].className = oldClassName.replace(/bg-\d/, this.bg);
    }
    if (this.playing)
        this.fullImg.className = this.bg + " move";
    else
        this.fullImg.className = this.bg + " not-move";
}

window.onload = function() {
    var game = new FifteenPuzzle();
    game.createImgBlock();
    game.addClickEvent();
    var example = document.getElementById("example");
    var start = document.getElementById("start");
    var changeImg = document.getElementById("change-img");
    example.onclick = function() {
        game.randomPosition(false);
        game.startGame();
    }
    start.onclick = function() {
        game.randomPosition(true);
        game.startGame();
    }
    changeImg.onclick = function() {
        game.changeImage();
    }
}
