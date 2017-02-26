window.onload = function() {
    // 迷宫主要元素
    var start = document.getElementById("start");
    var end = document.getElementById("end");
    var checkCheat = document.getElementById("check-cheat");
    var walls = document.getElementsByClassName("wall");
    // 判断游戏开始
    var isGameBegin = false;
    // 判断作弊
    var cheat = false;
    // 游戏信息
    var info = document.getElementById("info");

    // 游戏开始
    start.onmouseover = function() {
        cheat = false;
        for (var i = 0; i < walls.length; ++i) {
            walls[i].className = "wall";
        }
        info.innerHTML = "Game Begin!";
        isGameBegin = true;
    }

    // 到达终点
    end.onmouseover = function() {
        if (isGameBegin) {
            if (!cheat) {
                info.innerHTML = "You Win!";
            } else {
                info.innerHTML =
                "Dont's cheat, you should start from the 'S' and move to the 'E' inside the maze!";
            }
            isGameBegin = false;
            cheat = false;
        } else {
            info.innerHTML = "The game does not begin!";
        }
    }

    // 判断作弊
    checkCheat.onmouseover = function() {
        if (isGameBegin) {
            cheat = true;
        }
    }

    // 撞墙处理
    for (var i = 0; i < walls.length; ++i) {
        walls[i].onmouseover = function() {
            if (isGameBegin) {// 只有游戏开始，才有所谓的撞墙
                console.log("hover");
                this.className = "wall break-wall";
                isGameBegin = false;
                info.innerHTML = "You Lose.";
            }
        }
    }
}
