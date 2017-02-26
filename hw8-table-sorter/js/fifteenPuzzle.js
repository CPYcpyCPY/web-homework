/*
 * gameInfo 存储拼图游戏的相关信息
 */
var gameInfo = {"times":0, "steps":0, "playing":false, "timeCount":null, "bg":"bg-0"};

/*
 * 在#game-area中创建16个图片小块
 * 给每个图片小块标记上id和类名
 * 返回this便于后面链式调用其他$.fn里面的函数
 */
$.fn.createPuzzle = function() {
    _.times(16, function(i) {
        $("#game-area").append("<div id=\"block-"+i+"\" class=\"img-block\"></div>");
    });
    return this;
};

/*
 * 交换两个DOM元素的类名
 * 用于实现图片小块的移动(即交换要移动的图片块与空白块的行和列)
 */
$.fn.SwapClassName = function(ele1, ele2) {
    var c = ele1.className;
    ele1.className = ele2.className;
    ele2.className = c;
    return this;
};

/*
 * 给每个图片小块添加点击事件
 */
$.fn.addClickEvent = function() {
    $(".img-block").click(function () {
        // 获取当前图片块与空白块的坐标
        var top = parseInt($(this).css("top")), left = parseInt($(this).css("left")),
        blank_top = parseInt($("#block-15").css("top")), blank_left = parseInt($("#block-15").css("left"));
        // 向上下左右四个相邻方向进行判断
        // 若向某一个方向移动后与空白块坐标重合，则表示该块与空白块相邻
        // 若与空白块相邻，则通过交换类名实现移动
        // 成功移动则更新步数信息并检查是否完成拼图
        if ((top-100 == blank_top && left == blank_left) || (top+100 == blank_top && left == blank_left)
        || (left-100== blank_left && top == blank_top) || (left+100 == blank_left && top == blank_top)) {
            $.fn.SwapClassName(this, $("#block-15").get(0)).refresh("#steps", "steps: " + (++gameInfo["steps"])).check();
        }
    });
};

/*
 * 根据给定空白块位置和移动方向移动模拟地图中的图片块
 * dir给定随机方向使得向上下左右四个方向随机移动
 * 若dir给出方向非法(比如第一行的不能向上移动)，则不移动，return blank
 */
$.fn.moveToWhere = function(dir, blank) {
    if (dir == 0 && blank-4 >= 0) return blank-4;
    if (dir == 1 && blank+4 < 16) return blank+4;
    if (dir == 2 && blank-1 >= 0 && parseInt((blank-1)/4) == parseInt((blank/4))) return blank-1;
    if (dir == 3 && blank+1 < 16 && parseInt((blank+1)/4) == parseInt((blank/4))) return blank+1;
    return blank;
};

/*
 * 根据给定步数将模拟地图中的空白块随机移动steps步，实现随机打乱拼图
 * 由于根据空白块可以与相邻的图片块交换位置(相当于点击空白块附近的某图片块)
   因此能确保图片打乱之后有解
 */
$.fn.randomMap = function(map, steps, blank) {
    _.times(steps, function() {
        // 获取随机向上下左右某一方向移动后的位置
        var move = $.fn.moveToWhere(_.random(0, 3), blank);
        // 交换两个块，即移动过去
        var temp = map[blank];
        map[blank] = map[move];
        map[move] = temp;
        // 更新空白块位置
        blank = move;
    });
};

/*
 * 给出模拟地图，随机打乱模拟地图，再根据模拟地图来定位拼图游戏各个小块的位置
 * 如果用户点击的是示例按钮则无须过多地打乱拼图，移动一块即可，
   同时显示“点我点我”的提示语
 */
$.fn.randomPosition = function(notExample) {
    // 模拟图片位置的地图
    var map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 12, 13, 14, 11];
    $("#click-me").addClass("show");
    if (notExample) {// 若用户点击(重新)开始
        $("#click-me").removeClass("show");
        // 随机打乱拼图
        $.fn.randomMap(map, _.random(50, 400), 11);
    }
    // 根据模拟地图定位图片小块及空白块位置
    _.times(16, function(i) {
        $(".img-block").get(map[i]).className = "img-block "+gameInfo["bg"]+" row-"+parseInt(i/4)+" col-"+parseInt(i%4);
    });
    // 返回this便于后面链式调用$.fn里面的函数
    return this;
};

/*
 * 用于更新时间或者步数
 * 返回this便于后面链式调用$.fn里面的函数
 */
$.fn.refresh = function(what, info) {
    $(what).text(info);
    return this;
};

/*
 * 用于切换游戏图片
 * 切换图片时要同时更改图片小块和完整图，并保存新背景图至gameInfo
 */
$.fn.changeImg = function() {
    var oldBg = gameInfo["bg"];
    gameInfo["bg"] = "bg-"+(parseInt(oldBg[3])+1)%10;
    $(".img-block").removeClass(oldBg).addClass(gameInfo["bg"]);
    $("#full-img").removeClass(oldBg).addClass(gameInfo["bg"]);
};

/*
 * 游戏开始
 */
$.fn.startGame = function() {
    // 移开完整图现出图片小块
    $("#full-img").removeClass("not-move").addClass("move");
    gameInfo["playing"] = true;
    gameInfo["times"] = gameInfo["steps"] = 0;
    $.fn.refresh("#timer", "time: 0").refresh("#steps", "steps: 0");
    if (!gameInfo["timeCount"]) {// 设置计时器
        gameInfo["timeCount"] = setInterval(function() {
            $.fn.refresh("#timer", "time: " + (++gameInfo["times"]));
        }, 1000);
    }
};

/*
 * 检查拼图是否完成
 * 若拼图完成则调用gameOver结束游戏
 */
$.fn.check = function() {
    gameInfo["playing"] = false;
    // 对每个图片小块进行检测
    // 根据本游戏的图片小块放置方式，最后拼图完成时各个小块满足以下关系：
    // id编号 = 4 * 行坐标 + 列坐标
    _.times(16, function(i) {
        var pos = $(".img-block").get(i).className;
        if (parseInt(pos[19])*4+parseInt(pos[25]) != i) gameInfo["playing"] = true;
    });
    if (!gameInfo["playing"]) $.fn.gameOver();
};

/*
 * 游戏结束时的相关操作
 * 清楚计时器，弹出提示，移回完整图
 * 如果是示例模式还需将“点我点我”的提示隐藏
 */
$.fn.gameOver = function() {
    clearInterval(gameInfo["timeCount"]);
    gameInfo["timeCount"] = null;
    $("#full-img").removeClass("move").addClass("not-move").next().removeClass("show");
    alert("恭喜你在" + gameInfo["times"] + "秒内用了" + gameInfo["steps"] + "步完成了拼图.");
};

/*
 * 文档加载完毕后创建图片小块并添加点击事件(包括按钮点击事件)
 */
$(document).ready(function() {
    $.fn.createPuzzle().addClickEvent();
    $("#example").click(function() {
        $.fn.randomPosition(false).startGame();
    }).next().click(function() {
        $.fn.randomPosition(true).startGame();
    }).next().click(function() {
        $.fn.changeImg();
    });
});
