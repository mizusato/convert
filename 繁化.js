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
  var 字表 = []
  var 索引;
  for(索引 = 0; 索引 < 字串.length; ) {
    // 暫不攷慮擴展區的字，直接取下標
    let 字 = 字串[索引]
    if ( 字串[索引+1] == '[' ) {
      let 已確定對應字 = 字串[索引+2]
      console.log(已確定對應字)
      if ( typeof 已確定對應字 != 'undefined' ) {
	if ( 一簡多繁表.存在(字) ) {
	  if ( 一簡多繁表[字].傳統漢字.存在(已確定對應字) ) {
	    字表.push({待轉換字: 字, 已確定對應字: 已確定對應字})
	    索引 += 4
	    continue
	  }
	}
      }
    }
    字表.push(字)
    索引 += 1
  }
  // --
  var 文 = new 文章(字表, 繁化規則)
  return 文
}


