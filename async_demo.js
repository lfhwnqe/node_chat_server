function foo(params, callback) {
    setTimeout(() => {
        callback(null, 'done')
    }, 2000)
}

function asyncFoo(params) {
    return new Promise((rsv, rej) => {
        foo(params, (err, result) => {
            if (err) rej(err)
            else rsv(result)
        })
    })
}

(async () => {

    const val = await asyncFoo({}) // val是asyncFoo返回的resolve值
    console.log('val==>>', val)


})().then(r => {}).catch(e => {})

// async返回的是一个promise
// async就是把promise包装成async的方式，让代码看起来更像同步代码
// 自己实现一个promise


function foo(params, callback) {
    setTimeout(() => {
        callback(params)
    }, 1000)
}

const foo = (params) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let data = params
            resolve(data)
        }, 1000)
    })
}

foo(100).then(r => {
    console.log('r in promise.then==>>', r)
})


//** 实现async  **//
// function _asyncToGenerator(fn) {
//     return function () {
//         var gen = fn.apply(this, arguments);
//         return new Promise(function (resolve, reject) {
//             function step(key, arg) {
//                 try {
//                     var info = gen[key](arg);
//                     var value = info.value;
//                 } catch (error) {
//                     reject(error);
//                     return;
//                 }
//                 if (info.done) {
//                     resolve(value);
//                 } else {
//                     return Promise.resolve(value).then(function (value) {
//                         step("next", value);
//                     }, function (err) {
//                         step("throw", err);
//                     });
//                 }
//             }
//             return step("next");
//         });
//     };
// }

// _asyncToGenerator( /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
//     return regeneratorRuntime.wrap(function _callee$(_context) {
//         while (1) {
//             switch (_context.prev = _context.next) {
//                 case 0:
//                 case "end":
//                     return _context.stop();
//             }
//         }
//     }, _callee, undefined);
// }))().then(function (res) {
//     console.log(res);
// }).catch(function (e) {
//     console.log(e);
// });