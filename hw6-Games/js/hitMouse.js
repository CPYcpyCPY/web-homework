window.onload = function() {
    // 游戏开始结束按钮
    var start = document.getElementById("start");
    var stop = document.getElementById("stop");
    var isPlaying = false;

    // 游戏状态信息
    var gameInfo = document.getElementById("game-info");
    var timeInfo = document.getElementById("time-info");
    var scoreInfo = document.getElementById("score-info");
    var time = 30;
    var score = 0;

    // 创建老鼠洞
    var gameBody = document.getElementById("game-body");
    var holes = [];
    for (var i = 0; i < 60; ++i) {
        holes.push(document.createElement("div"));
        holes[i].className = "hole";
        gameBody.appendChild(holes[i]);
    }

    // 记录哪个洞有老鼠
    var mouse = 0;
    // 计时器
    var timeCount;

    // 点击开始游戏时随机出现地鼠并开始计时
    start.onclick = function() {
        if (!isPlaying) {
            time = 30;
            score = 0;
            timeInfo.innerHTML = time;
            scoreInfo.innerHTML = score;
            gameInfo.innerHTML = "Playing...";
            mouse = Math.floor(Math.random()*60);
            holes[mouse].className = "hole mouse";
            isPlaying = true;
            timeCount = setInterval(function() {
                time -= 1;
                timeInfo.innerHTML = time;
                if (time == 0) {
                    holes[mouse].className = "hole";
                    gameInfo.innerHTML = "Game Over";
                    isPlaying = false;
                    clearInterval(timeCount);
                }
            }, 1000);
        }
    }

    // 点击结束游戏时停止计时
    stop.onclick = function() {
        holes[mouse].className = "hole";
        gameInfo.innerHTML = "Game Over";
        isPlaying = false;
        clearInterval(timeCount);
    }
    
    // 点击地鼠时随机出现另外的地鼠
    // 打中时加分并重新出现地鼠，打错时扣分
    for (var i = 0; i < 60; ++i) {
        holes[i].onclick = function() {
            if (isPlaying) {// 仅当游戏开始时才做下面的判断
                if (this.className == "hole") {
                    --score;
                } else {
                    ++score;
                    this.className = "hole";
                    var lastMouse = mouse;
                    // 防止连续两次出现在同一个洞
                    while (mouse == lastMouse) {
                        mouse = Math.floor(Math.random()*60);
                    }
                    holes[mouse].className = "hole mouse";
                }
                scoreInfo.innerHTML = score;
            }
        }
    }
}
