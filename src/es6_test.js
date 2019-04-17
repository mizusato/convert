(function (window) {
    let { a } = { a: `1` }
    let b = [1,2,3]
    let c = [...b, 4]
    class A {}
    let d = new A()
    window.es6_ok = true
})(window)
