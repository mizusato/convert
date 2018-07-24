'use strict';


var 例詞數 = 3
var 取捨表 = {}
var 地區表 = {}


function 繁化選擇器生成(字位, 資料) {
  var 例詞表 = 資料.傳統漢字
  var 選項表 = map(
    Object.keys(例詞表),
    候選字 => new 選項(候選字,例詞表[候選字].slice(0, 例詞數))
  )
  return new 選擇器(字位, 選項表, 選項表[0].候選字, 資料.辨義)
}


var 繁化規則 = new 轉換規則(繁化表, 一簡多繁表, 繁化選擇器生成, 取捨表)


function 生成地區表 () {
  const 中國大陸 = '中'
  const 香港 = '港'
  const 台灣 = '台'
  const 英語原文 = '英'
  地區表 = {}
  function 生成用語列表 (字串或列表) {
    if ( typeof 字串或列表 == 'string' ) {
      return [字串或列表]
    } else {
      return 字串或列表
    }
  }
  for ( let 類別 of Object.keys(地區用詞表) ) {
    for ( let 用語 of 地區用詞表[類別] ) {
      let 內地用語表 = 生成用語列表(用語[中國大陸])
      for ( let 內地用語 of 內地用語表 ) {
	if ( typeof 地區表[內地用語] == 'undefined' ) {
	  地區表[內地用語] = []
	}
	for ( let 其它地區 of [台灣, 香港] ) {
	  if ( typeof 用語[其它地區] != 'undefined' ) {
	    let 對應用語表 = 生成用語列表(用語[其它地區])
	    for ( let 對應用語 of 對應用語表 ) {
	      地區表[內地用語].添加({
		'用語': 對應用語,
		'地區': 其它地區,
		'英文': 用語[英語原文],
		'類別': 類別
	      }) // 添加之
	    } // 遍歷對應用語
	  } // 有對應？
	} // 遍歷其它地區
      } // 遍歷內地用語
    } // 遍歷用語條目
  } // 遍歷分表
}


function 生成取捨表 (取捨設定) {
  for ( let 簡化字 of Object.keys(取捨表) ) {
    delete 取捨表[簡化字]
  }
  for ( let 條目 of Object.keys(正異取捨表) ) {
    var 字組表 = 正異取捨表[條目]
    let 條目字 = 字組表[0][0]
    let 選項 = 字組表[0] // 下標從 1 開始有效, 目前只設 1, 2 兩選項
    let 取字 = 1
    if ( 取捨設定[條目字] && 取捨設定[條目字] == 選項[2] ) {
      取字 = 2
    }
    for ( let 字組 of 字組表 ) {
      let 簡化字 = 字組[0]
      取捨表[簡化字] = 字組[取字]
    }
  }
}


function 生成取捨設定介面() {
  var 取捨設定 = load_config('取捨設定')
  return create(
    { tag: 'div', className: '正異取捨設定', children: map (
      Object.keys(正異取捨表), function 生成選項介面 (條目) {
	var 字組表 = 正異取捨表[條目]
	var 條目字 = 字組表[0][0]
	var 選項 = 字組表[0] // 同上
	var 取字 = 1
	if ( 取捨設定[條目字] && 取捨設定[條目字] == 選項[2] ) {
	  取字 = 2
	}
	function 更改選擇 (新取字) {
	  取捨設定[條目字] = 選項[新取字]
	  生成取捨表(取捨設定)
	  save_config('取捨設定', 取捨設定)	    
	}
	return {
	  tag: 'div', className: '正異條目', children: map(
	    [1,2], 選項號 => ({
	      tag: 'span', classList: ['正異選項', 選項號],
	      dataset: { selected: field('已選標記', 取字==選項號) },
	      textContent: 選項[選項號],
	      handlers: {
		click: function (ev) {
		  update( this.parentElement, {已選標記: String(false)} )
		  update( this, {已選標記: String(true)} )
		  更改選擇(選項號)
		  this.dispatchEvent(new Event('設定更改', {bubbles:true}))
		}
	      }
	    }) // 選項
	  ) // 選項列表
	} // 條目
      } // 生成條目
    ) } // 條目列表
  )
}


function 繁化(字串) {
  // 保證取捨設定能在轉換之前讀進取捨表
  if ( Object.keys(取捨表).length == 0 ) {
    生成取捨表(load_config('取捨設定'))
  }
  var 字表 = []
  var 索引;
  for(索引 = 0; 索引 < 字串.length; ) {
    // 暫不攷慮擴展區的字，直接取下標
    let 字 = 字串[索引]
    if ( 字串[索引+1] == '[' ) {
      let 已確定對應字 = 字串[索引+2]
      //console.log(已確定對應字)
      if ( typeof 已確定對應字 != 'undefined' ) {
	if ( 一簡多繁表.存在(字) ) {
	  if ( 一簡多繁表[字].傳統漢字.存在(已確定對應字) ) {
	    字表.添加({待轉換字: 字, 已確定對應字: 已確定對應字})
	    索引 += 4
	    continue
	  }
	}
      }
    }
    字表.添加(字)
    索引 += 1
  }
  // --
  var 文 = new 文章(字表, 繁化規則)
  return 文
}


Array.prototype['添加'] = function (項目) { return this.push(項目) }
