'use strict';


var 標記 = {
  不轉換: '{}',
  預設: '[]'
}


function test () {
  var 中文繁化表 = Object.assign({}, 繁化表, 單向繁化表)
  var 繁化表交集 = {}
  map(日本新字體繁化表, function (新字體, 舊字體) {
    if ( 中文繁化表.存在(新字體) && 中文繁化表[新字體] == 舊字體 ) {
      繁化表交集[新字體] = 舊字體
    }
  })
  
}


/*
var 繁化規則 = new 轉換規則(
  Object.assign({}, 繁化表, 單向繁化表), 一簡多繁表, 取捨表, 地區表
)

function 繁化(字串) {
  var 文 = new 文章(文章.生成字表(字串, 繁化規則, 標記), 繁化規則)
  return 文
}
*/

