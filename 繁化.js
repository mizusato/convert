'use strict';


var 例詞數 = 3;


function 繁化選擇器生成(字位, 資料) {
  var 例詞表 = 資料.傳統漢字
  var 選項表 = map(
    Object.keys(例詞表),
    候選字 => new 選項(候選字,例詞表[候選字].slice(0, 例詞數))
  )
  return new 選擇器(字位, 選項表, 選項表[0].候選字, 資料.辨義)
}


var 繁化規則 = new 轉換規則(繁化表, 一簡多繁表, 繁化選擇器生成)


function 繁化(字串) {
  var 文 = new 文章(字串, 繁化規則)
  return 文
}


