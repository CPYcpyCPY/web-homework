$(function() {
    var enable = true;
    var buttons = $(".button");
    var bigBubble = $("#info-bar");
    var isChainAction = false;
    var clickOrder = ['A', 'B', 'C', 'D', 'E'];
    var clickWhich = 0;

    /*
     * 按钮点击事件
     */
    buttons.click(function() {
        // 判断是否可以点击，如果用户乱点了不可以点击的按钮则不作处理
        if ($(this).find(".unread").length == 0 && enable) {
            enable = false;
            var index = $(this).index(), that = $(this);
            // 灭活其他按钮
            shutDownOtherButtons(buttons, index);
            // 添加小红点
            that.append("<span class=\"unread\">...</span>");
            // 向服务器请求数据
            $.get("/", function(data) {
                // 显示数据
                that.find(".unread").text(data);
                enable = true;
                // 灭活当前按钮并激活其他按钮
                that.removeClass("enable").addClass("disable");
                activateOtherButtons(buttons);
                // 检查是否可以求和
                var ch = checkAndCalculate(buttons);
                if (ch.isOk) {
                    // 如果5个数据都齐全可以求和则激活大气泡
                    bigBubble.removeClass("disable").addClass("enable");
                    if (isChainAction) {
                        /*
                         * 如果是点击@+启动的自动点击事件就自动点击大气泡求和
                         * setTimeout作用只是延迟下一个函数的执行便于用户看到按钮激活灭活的变化效果，
                           防止还没看清楚就立马被下一个函数刷掉
                         */
                        setTimeout(function() {
                            bigBubble.click();
                        }, 500);
                    }
                }
                /*
                 * 如果是点击@+启动的自动点击事件，那么点完该按钮还需自动点击下一个按钮
                 * setTimeout作用同上
                 */
                if (isChainAction) {
                    clickWhich += 1;
                    setTimeout(function() {
                        $(buttons[clickOrder[clickWhich].charCodeAt(0)-'A'.charCodeAt(0)]).click();
                    }, 500);
                }
            });
        }
    });

    /*
     * 大气泡点击事件
     */
    bigBubble.click(function() {
        // 检查是否可以求和
        var ch = checkAndCalculate(buttons);
        if (ch.isOk) {// 可以求和则显示求和结果同时灭活大气泡
            bigBubble.text(ch.sum);
            bigBubble.removeClass("enable").addClass("disable");
            isChainAction = false;
            clickWhich = 0;
        }
    });

    /*
     * @+点击事件
     */
    $(".icon").click(function() {
        // 判断 !isChainAction 防止用户重复点击@+而重新打乱顺序影响正在执行的自动点击事件
        if (!isChainAction) {
            // 随机打乱点击顺序
            randomOrder(clickOrder);
            isChainAction = true;
            clickWhich = 0;
            // 大气泡上方显示点击顺序
            $("#some-messages").text(clickOrder.toString());
            // 开始自动点击
            $(buttons[clickOrder[clickWhich].charCodeAt(0)-'A'.charCodeAt(0)]).click();
        }
    });

    /*
     * 鼠标离开计算器时重置所有内容
     */
    $("#button").mouseleave(function() {
        buttons.removeClass("disable").addClass("enable");
        $(".unread").remove();
        $("#some-messages").text("");
        bigBubble.text("");
        enable = true;
        isChainAction = false;
    });
});

/*
 * 灭活其他按钮
 */
function shutDownOtherButtons(buttons, buttonIndex) {
    buttons.each(function(i) {
        if (i != buttonIndex) {
            $(this).removeClass("enable").addClass("disable");
        }
    });
}

/*
 * 激活其他按钮
 * 只有找不到小红点的按钮即还未点击过的按钮才可以激活
 */
function activateOtherButtons(buttons) {
    buttons.each(function() {
        if ($(this).find(".unread").length == 0) {
            $(this).removeClass("disable").addClass("enable");
        }
    });
}

/*
 * 检查是否可以求和，同时计算出求和结果
 */
function checkAndCalculate(buttons) {
    var isOk = true, sum = 0;
    buttons.each(function() {
        var num = $(this).find(".unread").text();
        if (!!num && num != "...") sum += parseInt(num);
        else isOk = false;
    });
    return { isOk:isOk, sum:sum };
}

/*
 * 随机打乱点击顺序
 */
function randomOrder(clickOrder) {
    var swapTimes = Math.floor(Math.random()*10);
    for (var i = 0; i < swapTimes; ++i) {
        var j = Math.floor(Math.random()*5);
        var k = Math.floor(Math.random()*5);
        var temp = clickOrder[j];
        clickOrder[j] = clickOrder[k];
        clickOrder[k] = temp;
    }
}