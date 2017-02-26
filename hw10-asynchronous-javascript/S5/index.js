/*
 * 按照王老师在wiki评论区说的不能共享代码，连在不同事件处理器调用同一个函数都不行，
   于是我将每个handler的代码都单独写了，没有函数调用，代码量略多，有很多重复，
   所以评论者可以看handlerA，后面B-E的逻辑基本都一样
 */

/*
 * 事件处理器
 * 参数event主要用于占位，在鼠标单独点击A触发点击事件时接收jq给该函数传的一个jq对象，
   便于后面该handler能适应用户单独点击A按钮事件和点击@+按钮的自动事件的两种不同逻辑
 */
function handlerA(event, error, currentSum, callbackIndex, callback) {
    /*
     * 如果error，则说明该函数的callee出现了异常，
       显示异常消息，再重新调用callee
     * setTimeout只是为了用户能看清楚界面消息显示和按钮激活的变化效果，
       防止看都没看清楚就立马被下一个函数刷掉
     */
    if (!!error) {
        $("#some-messages").text(error);
        setTimeout(function() {
            callback[callbackIndex](null, null, currentSum, callbackIndex+1, callback);
        }, 700);
    }
    /*
     * 如果没有异常则是该函数自己要执行的逻辑
     */
    else {
        var button = $(".mask");
        // 灭活其他按钮
        $(".button").each(function(i) {
            if (i != button.index()) {
                $(this).removeClass("enable").addClass("disable");
            }
        });
        // 检查小红点是否存在，不存在再添加，
        // 防止因为乱点按钮而添加过多的小红点
        if (button.find(".unread").length == 0)
            button.append("<span class=\"unread\">...</span>");
        // 向服务器请求数据
        $.get("/", function(data) {
            // 激活其他按钮
            $(".button").each(function() {
                if ($(this).find(".unread").length == 0) {
                    $(this).removeClass("disable").addClass("enable");
                }
            });
            /*
             * 如果callback存在表示由于点击@+而启动的自动点击事件
             */
            if (!!callback) {
                if (!!Math.round(Math.random())) {// 随机失败模拟异常
                    // 异常交由该函数的caller处理，setTimeout的作用同上
                    setTimeout(function() {
                        // 如果currentIndex-2 < 0则说明这是第一个被按的按钮，
                        // 往上已经没有handler了，因此继续调用该按钮的handler
                        var caller = callbackIndex-2 < 0 ? 0 : callbackIndex-2;
                        callback[caller](null, "这不是个天大的秘密", currentSum, callbackIndex-1, callback);
                    }, 700);
                } else {
                    // 如果不产生异常则显示数据灭活当前按钮,显示消息并将数字加到currentSum
                    button.removeClass("enable").addClass("disable").find(".unread").text(data);
                    $("#some-messages").text("这是个天大的秘密");
                    currentSum += parseInt(data);
                    // 如果可以求和则激活大气泡
                    if (callbackIndex == 5)
                        $("#info-bar").removeClass("disable").addClass("enable");
                    // 调用下一个handler
                    setTimeout(function() {
                        callback[callbackIndex](null, null, currentSum, callbackIndex+1, callback);
                    }, 700);
                }
            }
            /*
             * 如果callback不存在则是用户单独点击A按钮的事件
             */
            else {
                // 显示数据，灭活当前按钮
                button.removeClass("enable").addClass("disable").find(".unread").text(data);
                $("#some-messages").text("这是个天大的秘密");
                // 检查是否可以求和，可以则激活大气泡
                var isOk = true;
                $(".button").each(function() {
                    var num = $(this).find(".unread").text();
                    if (!num || num == "...")
                        isOk = false;
                });
                if (isOk) $("#info-bar").removeClass("disable").addClass("enable");
            }
        });
    }
}

/*
 * 后面handlerB、C、D、E的逻辑都如同handlerA，不作多余注释
 */
function handlerB(event, error, currentSum, callbackIndex, callback) {
    if (!!error) {
        $("#some-messages").text(error);
        setTimeout(function() {
            callback[callbackIndex](null, null, currentSum, callbackIndex+1, callback);
        }, 700);
    } else {
        var button = $(".history");
        $(".button").each(function(i) {
            if (i != button.index()) {
                $(this).removeClass("enable").addClass("disable");
            }
        });
        if (button.find(".unread").length == 0)
            button.append("<span class=\"unread\">...</span>");
        $.get("/", function(data) {
            $(".button").each(function() {
                if ($(this).find(".unread").length == 0) {
                    $(this).removeClass("disable").addClass("enable");
                }
            });
            if (!!callback) {
                if (!!Math.round(Math.random())) {
                    setTimeout(function() {
                        var caller = callbackIndex-2 < 0 ? 0 : callbackIndex-2;
                        callback[caller](null, "我知道", currentSum, callbackIndex-1, callback);
                    }, 700);
                } else {
                    button.removeClass("enable").addClass("disable").find(".unread").text(data);
                    $("#some-messages").text("我不知道");
                    currentSum += parseInt(data);
                    if (callbackIndex == 5)
                        $("#info-bar").removeClass("disable").addClass("enable");
                    setTimeout(function() {
                        callback[callbackIndex](null, null, currentSum, callbackIndex+1, callback);
                    }, 700);
                }
            } else {
                button.removeClass("enable").addClass("disable").find(".unread").text(data);
                $("#some-messages").text("我不知道");
                var isOk = true;
                $(".button").each(function() {
                    var num = $(this).find(".unread").text();
                    if (!num || num == "...")
                        isOk = false;
                });
                if (isOk) $("#info-bar").removeClass("disable").addClass("enable");
            }
        });
    }
}

function handlerC(event, error, currentSum, callbackIndex, callback) {
    if (!!error) {
        $("#some-messages").text(error);
        setTimeout(function() {
            callback[callbackIndex](null, null, currentSum, callbackIndex+1, callback);
        }, 700);
    } else {
        var button = $(".message");
        $(".button").each(function(i) {
            if (i != button.index()) {
                $(this).removeClass("enable").addClass("disable");
            }
        });
        if (button.find(".unread").length == 0)
            button.append("<span class=\"unread\">...</span>");
        $.get("/", function(data) {
            $(".button").each(function() {
                if ($(this).find(".unread").length == 0) {
                    $(this).removeClass("disable").addClass("enable");
                }
            });
            if (!!callback) {
                if (!!Math.round(Math.random())) {
                    setTimeout(function() {
                        var caller = callbackIndex-2 < 0 ? 0 : callbackIndex-2;
                        callback[caller](null, "你知道", currentSum, callbackIndex-1, callback);
                    }, 700);
                } else {
                    button.removeClass("enable").addClass("disable").find(".unread").text(data);
                    $("#some-messages").text("你不知道");
                    currentSum += parseInt(data);
                    if (callbackIndex == 5)
                        $("#info-bar").removeClass("disable").addClass("enable");
                    setTimeout(function() {
                        callback[callbackIndex](null, null, currentSum, callbackIndex+1, callback);
                    }, 700);
                }
            } else {
                button.removeClass("enable").addClass("disable").find(".unread").text(data);
                $("#some-messages").text("你不知道");
                var isOk = true;
                $(".button").each(function() {
                    var num = $(this).find(".unread").text();
                    if (!num || num == "...")
                        isOk = false;
                });
                if (isOk) $("#info-bar").removeClass("disable").addClass("enable");
            }
        });
    }
}

function handlerD(event, error, currentSum, callbackIndex, callback) {
    if (!!error) {
        $("#some-messages").text(error);
        setTimeout(function() {
            callback[callbackIndex](null, null, currentSum, callbackIndex+1, callback);
        }, 700);
    } else {
        var button = $(".setting");
        $(".button").each(function(i) {
            if (i != button.index()) {
                $(this).removeClass("enable").addClass("disable");
            }
        });
        if (button.find(".unread").length == 0)
            button.append("<span class=\"unread\">...</span>");
        $.get("/", function(data) {
            $(".button").each(function() {
                if ($(this).find(".unread").length == 0) {
                    $(this).removeClass("disable").addClass("enable");
                }
            });
            if (!!callback) {
                if (!!Math.round(Math.random())) {
                    setTimeout(function() {
                        var caller = callbackIndex-2 < 0 ? 0 : callbackIndex-2;
                        callback[caller](null, "他知道", currentSum, callbackIndex-1, callback);
                    }, 700);
                } else {
                    button.removeClass("enable").addClass("disable").find(".unread").text(data);
                    $("#some-messages").text("他不知道");
                    currentSum += parseInt(data);
                    if (callbackIndex == 5)
                        $("#info-bar").removeClass("disable").addClass("enable");
                    setTimeout(function() {
                        callback[callbackIndex](null, null, currentSum, callbackIndex+1, callback);
                    }, 700);
                }
            } else {
                button.removeClass("enable").addClass("disable").find(".unread").text(data);
                $("#some-messages").text("他不知道");
                var isOk = true;
                $(".button").each(function() {
                    var num = $(this).find(".unread").text();
                    if (!num || num == "...")
                        isOk = false;
                });
                if (isOk) $("#info-bar").removeClass("disable").addClass("enable");
            }
        });
    }
}

function handlerE(event, error, currentSum, callbackIndex, callback) {
    if (!!error) {
        $("#some-messages").text(error);
        setTimeout(function() {
            callback[callbackIndex](null, null, currentSum, callbackIndex+1, callback);
        }, 700);
    } else {
        var button = $(".sign");
        $(".button").each(function(i) {
            if (i != button.index()) {
                $(this).removeClass("enable").addClass("disable");
            }
        });
        if (button.find(".unread").length == 0)
            button.append("<span class=\"unread\">...</span>");
        $.get("/", function(data) {
            $(".button").each(function() {
                if ($(this).find(".unread").length == 0) {
                    $(this).removeClass("disable").addClass("enable");
                }
            });
            if (!!callback) {
                if (!!Math.round(Math.random())) {
                    setTimeout(function() {
                        var caller = callbackIndex-2 < 0 ? 0 : callbackIndex-2;
                        callback[caller](null, "不才怪", currentSum, callbackIndex-1, callback);
                    }, 700);
                } else {
                    button.removeClass("enable").addClass("disable").find(".unread").text(data);
                    $("#some-messages").text("才怪");
                    currentSum += parseInt(data);
                    if (callbackIndex == 5)
                        $("#info-bar").removeClass("disable").addClass("enable");
                    setTimeout(function() {
                        callback[callbackIndex](null, null, currentSum, callbackIndex+1, callback);
                    }, 700);
                }
            } else {
                button.removeClass("enable").addClass("disable").find(".unread").text(data);
                $("#some-messages").text("才怪");
                var isOk = true;
                $(".button").each(function() {
                    var num = $(this).find(".unread").text();
                    if (!num || num == "...")
                        isOk = false;
                });
                if (isOk) $("#info-bar").removeClass("disable").addClass("enable");
            }
        });
    }
}

/*
 * 大气泡事件处理函数
 * event参数作用与前面handler一样
 */
function handlerS(event, error, currentSum, callbackIndex, callback) {
    /*
     * 如果callback不存在则是普通的单独点击大气泡事件
     */
    if (!callback) {
        // 判断5个数据是否齐全是否可以求和
        var isOk = true, sum = 0;
        $(".button").each(function() {
            var num = $(this).find(".unread").text();
            if (!!num && num != "...") sum += parseInt(num);
            else isOk = false;
        });
        // 可以求和则显示求和结果并灭活大气泡
        if (isOk) {
            $("#some-messages").text("楼主异步调用战斗力感人，目测不超过" + sum);
            $("#info-bar").text(sum).removeClass("enable").addClass("disable");
        }
    }
    /*
     * 如果callback存在则说明是由点击@+启动的自动点击事件，执行相应的逻辑
     * 该handler不需处理callee传过来的error，因为求和是最后一个调用的函数，
       没有再调用下一个函数
     */
    else {
        if (!!Math.round(Math.random())) {// 随机失败模拟异常
            // 异常交由该函数的caller处理
            setTimeout(function() {
                callback[callbackIndex-2](null, "楼主异步调用战斗力渣渣，目测超过" + currentSum, currentSum, callbackIndex-1, callback);
            }, 700);
        } else {// 没有异常则显示消息和求和结果并灭活大气泡
            $("#some-messages").text("楼主异步调用战斗力感人，目测不超过" + currentSum);
            $("#info-bar").text(currentSum).removeClass("enable").addClass("disable");
        }
    }
}

$(function() {
    // 添加按钮点击事件相应的处理
    $(".mask").click(handlerA);
    $(".history").click(handlerB);
    $(".message").click(handlerC);
    $(".setting").click(handlerD);
    $(".sign").click(handlerE);
    $("#info-bar").click(handlerS);

    // 鼠标离开计算器之后重置所有内容
    $("#button").mouseleave(function() {
        $(".unread").remove();
        $("#info-bar").text("").removeClass("enable").addClass("disable");
        $("#some-messages").text("");
        $(".button").removeClass("disable").addClass("enable");
    });

    // 添加@+点击事件的相应逻辑
    $(".icon").click(function() {
        // 随机打乱点击顺序
        var clickOrder = ['A', 'B', 'C', 'D', 'E'];
        var swapTimes = Math.floor(Math.random()*10);
        for (var i = 0; i < swapTimes; ++i) {
            var j = Math.floor(Math.random()*5);
            var k = Math.floor(Math.random()*5);
            var temp = clickOrder[j];
            clickOrder[j] = clickOrder[k];
            clickOrder[k] = temp;
        }
        // 大气泡上方显示点击顺序
        $("#some-messages").text(clickOrder.toString());
        console.log(clickOrder.toString());
        // 加入回调函数
        var callback = [];
        for (var i = 0; i < 5; ++i) {
            switch (clickOrder[i]) {
                case 'A' :
                    callback.push(handlerA);
                    break;
                case 'B' :
                    callback.push(handlerB);
                    break;
                case 'C' :
                    callback.push(handlerC);
                    break;
                case 'D' :
                    callback.push(handlerD);
                    break;
                case 'E' :
                    callback.push(handlerE);
                    break;
            }
        }
        // 最后加入大气泡的事件处理函数显示求和结果
        callback.push(handlerS);
        // 开始执行自动点击
        callback[0](null, null, 0, 1, callback);
    });
});
