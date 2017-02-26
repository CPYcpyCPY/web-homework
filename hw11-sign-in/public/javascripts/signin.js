/*
 * 登陆页面的表单检查
 * 主要用来提醒用户不要提交空表单
 */
window.onload = function() {
    var inputArea = document.getElementsByTagName("input");
    var errorArea = document.getElementsByClassName("error");
    inputArea[0].onblur = function() {
        if (!this.value)
            errorArea[0].textContent = "username can't be null.";
    };
    inputArea[1].onblur = function() {
        if (!this.value)
            errorArea[1].textContent = "password can't be null.";
    };
    inputArea[2].onclick = function() {
        inputArea[0].value = inputArea[1].value = "";
        errorArea[0].textContent = errorArea[1].textContent = "";
    };
    inputArea[3].onclick = function() {
        if (!inputArea[0].value || !inputArea[0].value)
            return false;
        return true;
    };
};