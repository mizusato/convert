'use strict';


var 標記 = {
  不轉換: '{}',
  預設: '[]'
}


var 取捨表 = {
  /**
   *  【格式】
   *    ・規範字［众］-> 選取的正字［眾］
   */
}


var 地區表 = {
  /**
   *  【格式】
   *    ・索引: 中國大陸用語 -> [{     ［网络］
   *      ・用語: 對應用語             ［網路］
   *      ・地區: 港/台                ［台］
   *      ・原文: 英文/日文原詞        ［network］
   *      ・類別: 「地區用詞表」之索引 ［電腦］
   *    }]
   */
}


function 生成地區表 () {
  // 該函式只會被調用一次
  const 中國大陸 = '中'
  const 香港 = '港'
  const 台灣 = '台'
  const 原文 = '原'
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
        if ( 地區表.不存在(內地用語) ) {
          地區表[內地用語] = []
        }
        for ( let 其它地區 of [台灣, 香港] ) {
          if ( 用語.存在(其它地區) ) {
            let 對應用語表 = 生成用語列表(用語[其它地區])
            for ( let 對應用語 of 對應用語表 ) {
              地區表[內地用語].添加({
                '用語': 對應用語,
                '地區': 其它地區,
                '原文': 用語[原文],
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
  // 該函式可因設定更改被調用多次
  for ( let 規範字 of Object.keys(取捨表) ) {
    delete 取捨表[規範字]
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
      let 規範字 = 字組[0]
      取捨表[規範字] = 字組[取字]
    }
  }
}


function 生成取捨設定介面 () {
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


// 以下語句需要保證在轉換之前能够執行
生成取捨表(load_config('取捨設定'))
生成地區表()
var 繁化規則 = new 轉換規則(
  Object.assign({}, 繁化表, 單向繁化表), 一簡多繁表, 取捨表, 地區表
)


function 繁化(字串) {
  var 文 = new 文章(文章.生成字表(字串, 繁化規則, 標記), 繁化規則)
  return 文
}



