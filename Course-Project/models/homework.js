// 用于随机打乱数组的函数
function randomSort(a, b) {
    return Math.random()>.5 ? -1 : 1;
}

module.exports = function(db) {
    var homeworks = db.collection("homeworks");
    var ObjectId = require('mongodb').ObjectID;
    // 两个班的小组记录，便于在发布作业的同时生成随机互评顺序
    var groupsNum = [5, 20];
    var groupsA = [], groupsB = [];
    for (var i = 1; i <= groupsNum[0]; ++i)
        groupsA.push(i);
    for (var i = 1; i <= groupsNum[1]; ++i)
        groupsB.push(i);
    // 作业管理
    var homeworkManager = {
        // 发布作业, 同时随机生成本次作业未来的互评顺序
        addHomework: function(homeworkData) {
            homeworkData.groups = {
                A: groupsA.sort(randomSort),
                B: groupsB.sort(randomSort)
            };
            homeworkData.status = '0';
            return homeworks.insert(homeworkData);
        },

        // 查看当前已发布的全部作业
        getAllHomework: function() {
            return new Promise(function (resolve, reject) {
                homeworks.find({}).toArray(function (err, docs) {
                    resolve(docs);
                });
            });
        },

        // 改变作业状态(未开始0->开始1->结束2)
        changeStatus: function(homeworkId) {
            return homeworks.findOne({_id: new ObjectId(homeworkId)})
            .then(function (result) {
                if (!result) {
                    return 0;
                } else if (result.status == '0') {
                    homeworks.findOneAndUpdate({
                        _id: new ObjectId(homeworkId)
                    }, {
                        $set: {status: '1'}
                    });
                    return 1;
                } else if (result.status == '1') {
                    homeworks.findOneAndUpdate({
                        _id: new ObjectId(homeworkId)
                    }, {
                        $set: {status: '2'}
                    });
                    return 2;
                } else {
                    homeworks.findOneAndUpdate({
                        _id: new ObjectId(homeworkId)
                    }, {
                        $set: {status: '0'}
                    });
                    return 0;
                }
            });
        },

        // 获取某次作业的互评组合
        getRemarkGroup: function(homeworkId, group, whichClass) {
            return homeworks.findOne({_id: new ObjectId(homeworkId)})
            .then(function (result) {
                if (!result) {
                    return 0;
                } else {
                    var groups = null;
                    if (whichClass == 'A')
                        groups = result.groups.A;
                    else
                        groups = result.groups.B;
                    groups = eval(groups);
                    groups.push(groups[0]);
                    for (var i = 0; i < groups.length-1; ++i) {
                        if (groups[i] == group)
                            return groups[i+1].toString();
                    }
                }
            });
        }
    };

    return homeworkManager;
};