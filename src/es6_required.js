function es6_not_ok_action () {
    alert(
        '檢測到您的瀏覧器不支援 ECMAScript 2015 (ES6), 請更新您的瀏覧器，否則將無法正常使用本程式。\n\n' +
        '残念ですが、あなたのブラウザは ECMAScript 2015 (ES6) に対応していません。なので、このプログラムの利用は出来ません。利用できるように、ブラウザをアップデートしてください。'
    )
}


if (!window.es6_ok) {
     es6_not_ok_action()
} else {
    console.log('ES2015 Check Passed')
}
