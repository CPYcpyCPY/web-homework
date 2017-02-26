/*
 * 获取表格的内容存到数组rows中，参数cols为表格的列数
 */
$.fn.getTableElement = function(whichTable, rows, cols) {
    $(whichTable).find("td").each(function(i) {
        rows[parseInt(i/cols)].push(this.textContent);
    });
    return this;
};

/*
 * 对数组rows中存的表格每一行的内容根据要排序的列col进行排序
 * 排序之后更新表格内容
 * 参数cols为表格总列数，col为要排序的列，isAsend判断增降序
 */
$.fn.sortAndRefresh = function(whichTable, rows, cols, col, isAscend) {
    rows.sort(function(a, b) {
        return isAscend ? (a[col] > b[col] ? 1 : -1) : (a[col] < b[col] ? 1 : -1);
    });
    $(whichTable).find("td").each(function(j) {
        this.textContent = rows[parseInt(j/cols)][parseInt(j%cols)];
    });
};

/*
 * 根据点击排序之后应该按哪种顺序排序对表格内容进行排序
 */
$.fn.changeOrder = function(that, whichTable, rows, cols) {
    if (that.className == "ascend") {
        that.className = "descend";
        $.fn.sortAndRefresh(whichTable, rows, cols, that.cellIndex, false);
    } else {
        $(whichTable).find("th").removeClass();
        that.className = "ascend";
        $.fn.sortAndRefresh(whichTable, rows, cols, that.cellIndex, true);
    }
};

/*
 * 给表头每一栏都添加点击排序事件
 */
$.fn.tableSorter = function(whichTable, rows, cols) {
    $(whichTable).find("th").click(function() {
        $.fn.changeOrder(this, whichTable, rows, cols);
    });
};

/*
 * table1, table2存储todo和staff的表格内容
 */
$(document).ready(function() {
    var table1 = [[], [], []], table2 = [[], [], []];
    $.fn.getTableElement("#todo", table1, 3).tableSorter("#todo", table1, 3);
    $.fn.getTableElement("#staff", table2, 3).tableSorter("#staff", table2, 3);
});
