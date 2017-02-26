$(function() {
    var enable = true;
    var buttons = $(".button");
    var bigBubble = $("#info-bar");
    var isChainAction = false;

    /*
     * 按钮点击事件
     */
    buttons.click(function() {
        // 判断是否可以点击，如果用户乱点了不可以点击的按钮则不作处理
        if ($(this).find(".unread").length == 0 && enable) {
            enable = false;
            var index = $(this).index(), that = $(this);
            // 灭活其他按钮后添加小红点
            shutDownOtherButtons(buttons, index);
            that.append("<span class=\"unread\">...</span>");
            // 向服务器请求数据
            $.get("/", function(data) {
                // 显示数据并灭活当前按钮再激活其他按钮
                that.find(".unread").text(data);
                enable = true;
                that.removeClass("enable").addClass("disable");
                activateOtherButtons(buttons);
                // 如果5个数据齐全则激活大气泡
                if (checkAndCalculate(buttons).isOk) {
                    bigBubble.removeClass("disable").addClass("enable");
                }
                // 如果是点击@+启动的自动点击事件则自动点击下一个应该点击的内容
                if (isChainAction) {
                    if (index == 4) {// 最后一个按钮点击后自动点击大气泡求和
                        setTimeout(function() {
                            bigBubble.click();
                        }, 500);
                    } else {
                        setTimeout(function() {
                            $(buttons[index+1]).click();
                        }, 500);
                    }
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
        if (ch.isOk) {// 可以求和则显示求和结果并灭活大气泡
            $(this).text(ch.sum);
            bigBubble.removeClass("enable").addClass("disable");
            isChainAction = false;
        }
    });

    /*
     * @+点击事件
     */
    $(".icon").click(function() {
        isChainAction = true;
        $(buttons[0]).click();
    });

    /*
     * 鼠标离开计算器后重置所有内容
     */
    $("#button").mouseleave(function() {
        buttons.removeClass("disable").addClass("enable");
        $(".unread").remove();
        bigBubble.text("");
        isChainAction = false;
        enable = true;
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