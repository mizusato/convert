'use strict'


/**
 *  【檔名】
 *    ・轉換器.js
 *
 *  【描述說明】
 *    ・繁簡轉換器的主要程式檔，包含數個 class, 各司其職
 *
 *  【規範】
 *    ・如非特殊說明，所有屬性在 class 的定義之外均*假定*為 read only propertry
*/


class 轉換規則 {
  /**
   *  【描述說明】
   *    ・進行轉換的規則，由各種轉換表組成
   *
   *  【構造器】
   *    ・一對一表: hash<char> [原字->對應字]
   *    ・一對多表: hash<{對應字:hash<array>[對應字->例詞表], 辨義:string}>
   *    ・取捨表: hash<char> = {} [規範字->選取的正體字]
   *    ・地區表: hash<array<{用語,地區,...}>> = {} [被轉換地區用詞->對應詞表]
   *  
   *  【注】
   *    ・取捨表是會動態改變的，應看作引用
   *    ・而地區表是不變的，應看作值
   *  
   *  【屬性】
   *    ・構造器引數
   *  
   *  【方法】
   *    ・[private] 生成地區詞首字表 (void) -> void
   */
  constructor (一對一表, 一對多表, 取捨表 = {}, 地區表 = {}) {
    var 轉換規則 = this
    轉換規則.一對一表 = 一對一表
    轉換規則.一對多表 = 一對多表
    轉換規則.取捨表 = 取捨表
    轉換規則.地區表 = 地區表
    轉換規則.生成地區詞首字表()
  }

  生成地區詞首字表 () {
    // 用首字將地區詞分類，提高處理效率
    var 轉換規則 = this
    var 首字表 = {}
    for ( let 被轉換用語 of Object.keys(轉換規則.地區表) ) {
      let 對應詞列表 = 轉換規則.地區表[被轉換用語]
      let 首字 = 被轉換用語[0]
      if ( 首字表.不存在(首字) ) {
	首字表[首字] = {}
      }
      首字表[首字][被轉換用語] = 對應詞列表
    }
    for ( let 首字 of Object.keys(首字表) ) {
      let 最大詞長 = 0
      for ( let 被轉換用語 of Object.keys(首字表[首字]) ) {
	if ( 被轉換用語.length > 最大詞長 ) {
	  最大詞長 = 被轉換用語.length
	}
	首字表[首字].$最大詞長 = 最大詞長
      }
    }
    轉換規則.地區詞首字表 = 首字表
  }
  // END［轉換規則］
}


class 文章 extends CompatEventTarget {
  /**
   *  【描述說明】
   *    ・被轉換文章的抽象，保存各種資訊，有 Controller 的作用
   *
   *  【構造器】
   *    ・待轉換字表: array<{待轉換字,(已確定對應字,預設地區詞)}>
   *    ・轉換規則: 轉換規則
   *
   *  【注】
   *    ・這裡的引數「待轉換字表」指的是「字表」，即一種結構化資料
   *    ・轉換字串需先用 static 生成字表 (字串, 轉換規則) 將字串轉為字表
   *
   *  【屬性】
   *    ・構造器引數
   *    ・字位表: array<字位> // 與待轉換字表構成一一對應
   *    ・地區詞表: {分組表, 線性表, 起點表} // 詳見 生成地區詞表()
   *    ・地區詞提示位表: array<地區詞提示位> // 與分組表之每一組對應
   *    ・擴展字位表: array<字位 or 地區詞提示位> // 所有可能顯示的字或提示位
   *    ・介面: HTMLElement
   *
   *  【注】
   *    ・字位表中每一個字位同待轉換字表中的字對應，對於其中的一對多字，
   *    ・可以選擇不同的字；而擴展字位表包含了所有可能顯示的字位和提示位，
   *    ・其中有些字位是地區詞的對應詞所含字，在未選擇對應地區詞時處於
   *    ・隠藏狀態。提示位是指地區詞提示位，詳見其 class 定義。
   *
   *  【例】
   *    ・字位表: [字位<应>, 字位<用>, 字位<程>, 字位<序>]
   *    ・擴展字位表: [
   *                    字位<应>, 字位<用>,
   *                    地區詞提示位,
   *                    字位<程,disabled>, 字位<式,disabled>,
   *                    字位<程>, 字位<序>
   *                  ]
   *
   *  【方法】
   *    ・取得原文 (void) => string // 原文
   *    ・取得修飾原文 (void) => string // 修飾過的原文用於保存狀態
   *    ・取得轉換結果 (void) => string // 轉換結果
   *    ・[static] 生成字表 (字串, 轉換規則) => @constructor<待轉換字表>
   *    ・[private] 生成地區詞表 (void) => @property<地區詞表>
   *    ・[private] 生成擴展字位表 (void) => @property<擴展字位表>
   *    ・[private] 生成介面 (void) => HTMLElement
   *
   *  【事件】
   *    ・選項更改 // 當一對多選字更改或地區詞選詞更改時觸發
   */
  constructor (待轉換字表, 轉換規則) {
    super()
    var 文章 = this
    文章.待轉換字表 = 待轉換字表
    文章.轉換規則 = 轉換規則
    文章.字位表 = map(
      待轉換字表, function (字) {
	let 此字位 = new 字位(字.待轉換字, 文章, 字.已確定對應字)
	此字位.addEventListener(
	  '選字更改',
	  ev => 文章.dispatchEvent(new Event('選項更改'))
	)
	return 此字位
      }
    )
    文章.地區詞表 = 文章.生成地區詞表()
    for ( let 選項 of 文章.地區詞表.線性表 ) {
      if ( 待轉換字表[選項.起點位置].存在('預設地區詞') ) {
	let 預設 = 待轉換字表[選項.起點位置].預設地區詞
	// 此處找不到選項與預設值對應也不會報錯
	// 不經過 生成字表() 而直接構造 待轉換字表 時請加以註意
	if ( 選項.原詞 == 預設.原詞 && 選項.對應詞 == 預設.對應詞 ) {
	  選項.選擇此項()
	}
      }
    }
    文章.地區詞提示位表 = map(
      文章.地區詞表.分組表, function (選項表) {
	var 提示位 = new 地區詞提示位(選項表)
	提示位.addEventListener(
	  '選詞更改',
	  ev => 文章.dispatchEvent(new Event('選項更改'))
	)
	return 提示位
      }
    )
    文章.擴展字位表 = 文章.生成擴展字位表()
    文章.介面 = 文章.生成介面()
  }

  生成地區詞表 () {
    /**
     * 如果兩個或多個可能被轉換的地區詞發生重疊，
     * 就把它們分成一組，在同一個提示位中處理。
     */
    var 文章 = this
    var 首字表 = 文章.轉換規則.地區詞首字表
    // 待轉列表中或存在已定一對多，把它們 map 回原字
    var 待轉換字元表 = map(
      文章.待轉換字表,
      字 => 字.待轉換字
    )
    var 線性表 = [] // array<地區詞選項> order by 起點位置
    for ( let 索引=0; 索引<待轉換字元表.length; 索引++ ) {
      let 字元 = 待轉換字元表[索引]
      if ( 首字表.存在(字元) ) {
	let 最大詞長 = 首字表[字元].$最大詞長
	for ( let 偏移量=1; 偏移量<=最大詞長; 偏移量++ ) {
	  let 原詞 = 待轉換字元表.slice(索引, 索引+偏移量).join('')
	  if ( 首字表[字元].存在(原詞) ) {
	    for ( let 對應詞資訊 of  首字表[字元][原詞] ) {
	      線性表.push(
		new 地區詞選項(
		  // 原詞, 對應詞, 起點位置, 終點位置, 文章, 附加資訊
		  原詞, 對應詞資訊['用語'], 索引, 索引+偏移量,
		  文章, copy1except(對應詞資訊, '用語')
		)
	      ) // 添加到線性表
	    } // 遍歷對應詞
	  } // [索引, 索引+偏移量) 確實是地區詞
	} // 遍歷偏移量
      } // 首字表有此字
    } // 遍歷字表索引
    var 分組 = {} // hash [選項的索引@線性表 -> 本組最靠前選項的索引@線性表]
    // 初始化，先假設每個選項的區間都不重合
    for ( let I=0; I<線性表.length; I++ ) {
      分組[I] = I
    }
    // 从前往後遍歷每個區間，再从它往後比對該區間之後的區間是否與其重合
    for ( let I=0; I<線性表.length; I++ ) { // 當前區間
      for ( let J=I+1; I<J && J<線性表.length; J++ ) { // 比對的區間
	// 如果比對的區間已經越過當前區間的尾部，後面的比對已經沒有意義
	if ( 線性表[J].起點位置 >= 線性表[I].終點位置 ) {	  
	  break
	}
	// 如果重合，則加到當前區間這一組
	if ( 地區詞選項.有重合(線性表[I], 線性表[J]) ) {
	  分組[J] = 分組[I]
	}
      }
    }
    // 分組表，以各個組中最靠前的區間的起始位置為組號
    var 分組表 = {} // hash<array<地區詞選項>> [組號->地區詞選項表]
    for ( let I=0; I<線性表.length; I++ ) {
      let 組號 = 線性表[分組[I]].起點位置
      if ( 分組表.不存在(組號) ) {
	分組表[組號] = []
      }
      分組表[組號].push(線性表[I])
    }
    var 起點表 = {} // hash<array<地區詞選項>> [起點位置->地區詞選項表]
    for ( let 選項 of 線性表 ) {
	if ( 起點表.不存在(選項.起點位置) ) {
	  起點表[選項.起點位置] = []
	}
	起點表[選項.起點位置].push(選項)
    }
    var 總表 = {}
    總表['分組表'] = 分組表
    總表['線性表'] = 線性表
    總表['起點表'] = 起點表
    return 總表
  }

  生成擴展字位表 () {
    var 文章 = this
    return getlist((function* generator (){
      var 起點分組表 = 文章.地區詞表.起點表
      for ( let 索引=0; 索引<文章.字位表.length; 索引++) {
	if ( 文章.地區詞提示位表.存在(索引) ) {
	  yield 文章.地區詞提示位表[索引]
	}
	if ( 起點分組表.存在(索引) ) {
	  for ( let 地區詞選項 of 起點分組表[索引] ) {
	    for ( let 字位 of 地區詞選項.字位組 ) {
	      yield 字位
	    }
	  }
	}
	//文章.字位表[索引].$原索引 = 索引
	yield 文章.字位表[索引]
      }	  
    })())
  }

  取得原文 () {
    var 文章 = this
    return map(文章.字位表, 字位 => 字位.待轉換字).join('')
  }

  取得修飾原文 () {
    var 文章 = this
    var 起點表 = 文章.地區詞表.起點表
    return (map(文章.字位表, function (字位, 索引) {
      if ( 起點表.存在(索引) && exists(起點表[索引], 選項 => 選項.被選擇) ) {
	for ( let 地區詞選項 of 起點表[索引] ) {
	  if ( 地區詞選項.被選擇 ) {
	    return jump(
	      (地區詞選項.原詞.length - 1), // 覆寫原詞，加入括弧
	      `[${地區詞選項.原詞}:${地區詞選項.對應詞}]`
	    )
	  }
	}
      } else {
	if ( 字位.類型 == '一對多字' && 字位.狀態 == '已選擇' ) {
	  return `${字位.待轉換字}[${字位.取得顯示字()}]`
	}
	return 字位.待轉換字
      }
    })).join('')
  }

  取得轉換結果 () {
    var 文章 = this
    return (map(文章.擴展字位表, function (字位或提示位) {
      if ( 字位或提示位 instanceof 字位 ) {
	let 字位 = 字位或提示位
	if (字位.enabled) {
	  return 字位.取得顯示字()
	} else {
	  return ''
	}
      } else {
	return ''
      }
    })).join('')
  }

  生成介面 () {
    var 文章 = this
    return create({
      tag: 'div', className: '文章',
      style: { position: 'relative' },
      children: concat(
	map(文章.擴展字位表, 字位或提示位 => 字位或提示位.介面),
	map(文章.字位表, 字位 => 字位.選擇器 && 字位.選擇器.介面),
	map(values(文章.地區詞提示位表), 提示位 => 提示位.選單.介面)
      ),
      handlers: {
	click: ev => 選擇面板.隠藏全部(),
	contextmenu: ev => 選擇面板.隠藏全部()
      }
    })
  }

  static 生成字表 (字串, 轉換規則) {
    var 字表 = []
    for ( let 索引=0; 索引<字串.length; ) {
      // 暫不攷慮擴展區的字，直接取下標
      let 字 = 字串[索引]
      if ( 字串[索引+1] == '[' && 字串[索引+3] == ']' ) {
	let 已確定對應字 = 字串[索引+2]
	if ( typeof 已確定對應字 != 'undefined' ) {
	  if ( 轉換規則.一對多表.存在(字) ) {
	    if ( 轉換規則.一對多表[字].對應字.存在(已確定對應字) ) {
	      字表.添加({待轉換字: 字, 已確定對應字: 已確定對應字})
	      索引 += 4
	      continue
	    }
	  }
	}
      }
      字表.添加({待轉換字:字})
      索引 += 1
    }
    var 括弧內 = false
    var 括弧位置 = -1
    var 括弧內容 = {} // 左括弧索引 -> '[content]'
    for ( let 索引=0; 索引<字表.length; 索引++ ) {
      if ( 字表[索引].待轉換字 == ']' ) {
	括弧內 = false
      }
      if ( 括弧內 ) {
	if ( 括弧內容.不存在(括弧位置) ) {
	  括弧內容[括弧位置] = ''
	}
	括弧內容[括弧位置] += 字表[索引].待轉換字
      }
      if ( 字表[索引].待轉換字 == '[' ) {
	括弧內 = true
	括弧位置 = 索引 // 左括弧的索引
      }
    }
    var 淨字表 = [] // 處理掉預設地區詞之後的字表
    for ( let 索引=0; 索引<字表.length; ) {
      if ( 括弧內容.存在(索引) ) {
	let 內容 = 括弧內容[索引]
	let 原詞 = 內容.split(':')[0]
	let 對應詞 = 內容.split(':')[1]
	if ( 轉換規則.地區表.存在(原詞) ) {
	  if ( exists(轉換規則.地區表[原詞], 條目 => 條目.用語 == 對應詞) ) {
	    字表[索引+1]['預設地區詞'] = { 原詞: 原詞, 對應詞: 對應詞 }
	    // [abcd:efg]
	    // 0123456789
	    //  1   1+l 
	    //       1+l+1
	    //          1+l+1+l'
	    //           1+l+1+l'+1
	    map(字表.slice(索引+1, 索引+1+原詞.length), 字=>淨字表.push(字))
	    索引 = (索引+1) + 原詞.length + 1 + 對應詞.length + 1
	    continue
	  }
	}
      }
      淨字表.push(字表[索引])
      索引++
    }
    return 淨字表
  }
  // END［文章］
}



class 字位 extends CompatEventTarget {
  /**
   *  【描述說明】
   *    被轉換的單個字的抽象化
   *
   *  【構造器】
   *    ・待轉換字: char
   *    ・文章: 文章
   *    ・已確定對應字: char = undefined
   *    ・附加字: bool = false
   *
   *  【屬性】
   *    ・類型: enum {一對一字, 一對多字, 無對應字, 附加字}
   *    ・enabled: bool
   *    【一對一字】
   *      ・對應字: char 
   *    【一對多字】
   *      ・狀態: enum {未選擇, 已選擇}
   *      ・選擇器: 選擇器
   *      ・當前選擇的對應字: char
   *
   *  【方法】
   *    ・變更對應字: (新字: char) => void ［一對多字］
   *    ・使用預設字: (void) => void ［一對多字］
   *    ・取得顯示字: (void) => char
   *    ・enable: (void) => void
   *    ・disable: (void) => void
   *    ・[private] 生成介面 (void) => HTMLElement
   *    ・[private] 更新介面 (void) => void
   *
   *  【事件】
   *    ・選字更改: 一對多選詞更改時觸發
   */
  constructor ( 待轉換字, 文章, 已確定對應字=undefined, 附加字=false ) {
    super()
    var 字位 = this
    字位.待轉換字 = 待轉換字
    字位.文章 = 文章
    var 一對一表 = 文章.轉換規則.一對一表
    var 一對多表 = 文章.轉換規則.一對多表
    var 取捨表 = 文章.轉換規則.取捨表
    if ( 附加字 == false ) {
      if ( 取捨表.存在(待轉換字) ) {
	字位.類型 = '一對一字'
	字位.對應字 = 取捨表[待轉換字]
      } else if ( 一對一表.存在(待轉換字) ) {
	字位.類型 = '一對一字'
	字位.對應字 = 一對一表[待轉換字]
      } else if ( 一對多表.存在(待轉換字) ) {
	字位.類型 = '一對多字'
	字位.選擇器 = (function (字位, 資料) {
	  const 例詞數 = 3
	  var 例詞表 = 資料.對應字
	  var 選項表 = map(
	    Object.keys(例詞表),
	    候選字 => new 選項(候選字,例詞表[候選字].slice(0, 例詞數))
	  )
	  return new 選擇器(字位, 選項表, 選項表[0].候選字, 資料.辨義)
	})(字位, 一對多表[待轉換字])
	字位.當前選擇的對應字 = 字位.選擇器.預設選項
	字位.狀態 = '未選擇'
      } else {
	字位.類型 = '無對應字'
      }
      字位.enabled = true
    } else {
      字位.類型 = '附加字'
      字位.enabled = false
    }
    字位.介面 = 字位.生成介面()
    if ( typeof 已確定對應字 == 'string' ) {
      確認( 字位.類型 == '一對多字' )
      字位.變更對應字(已確定對應字)
    }
  }

  變更對應字 ( 新字 ) {
    var 字位 = this
    確認( 字位.類型 == '一對多字' )
    確認( 字位.選擇器.存在候選字(新字) )
    字位.當前選擇的對應字 = 新字
    字位.狀態 = '已選擇'
    字位.更新介面()
    字位.dispatchEvent(new Event('選字更改'))
  }

  使用預設字 () {
    var 字位 = this
    確認( 字位.類型 == '一對多字' )
    字位.狀態 = '已選擇'
    字位.更新介面()
    字位.dispatchEvent(new Event('選字更改'))
  }

  取得顯示字 () {
    var 字位 = this
    if ( 字位.類型 == '一對一字' ) {
      return 字位.對應字
    } else if ( 字位.類型 == '一對多字' ) {
      return 字位.當前選擇的對應字
    } else {
      return 字位.待轉換字
    }
  }

  生成介面 () {
    var 字位 = this
    var 一對多 = ( 字位.類型 == '一對多字' )
    if ( 字位.待轉換字 == '\n' ) {
      return create({
//	tag: 'br', classList: ['字位', 字位.類型]
	tag: 'span', classList: ['字位', 字位.類型, '格子']
      })
    } else {
      return create({
	tag: 'span', classList: ['字位', 字位.類型, '格子'],
	textContent: field('顯示字', 字位.取得顯示字()),	
	dataset: {
	  狀態: field('狀態', 字位.狀態),
	  enabled: field('enabled', 字位.enabled)
	},
	handlers: {
	  click: ev => 一對多 && 字位.選擇器.切換介面() + ev.stopPropagation(),
	  contextmenu: ev => 一對多 && 字位.使用預設字() + ev.preventDefault()
	}
      })
    }
  }

  更新介面 () {
    var 字位 = this
    update(字位.介面, {
      顯示字: 字位.取得顯示字(),
      狀態: 字位.狀態,
      enabled: 字位.enabled
    })
  }

  enable () {
    var 字位 = this
    字位.enabled = true
    字位.更新介面()
  }

  disable () {
    var 字位 = this
    字位.enabled = false
    字位.更新介面()
  }
  // END［字位］
}


class 選項 {
  // only a data structure
  constructor ( 候選字, 例詞表 ) {
    var 選項 = this
    選項.候選字 = 候選字
    選項.例詞表 = 例詞表
  }
}


class 選擇面板 {
  /**
   *  【描述說明】
   *    ・地區詞選單 和 （一對多）選擇器 的 base class
   *    ・實現切換顯示和隠藏的功能
   *
   *  【構造器】
   *    ・定位基準取得函式: Function (void) => HTMLElement
   *
   *  【注】
   *    ・顯示的面板需要依附在一個指定的元素旁邊，這個元素即是定位基準
   *
   *  【屬性】
   *    ・取得基準: @constructor<定位基準取得函式>
   *
   *  【方法】
   *    ・顯示介面: (void) => void
   *    ・隠藏介面: (void) => void
   *    ・切換介面: (void) => void // toggle
   *    ・[static] 隠藏全部: (void) => void
   */
  constructor (定位基準取得函式) {
    var 選擇面板 = this
    選擇面板.取得基準 = 定位基準取得函式
  }
  
  顯示介面 () {
    var 選擇面板 = this
    var 基準 = 選擇面板.取得基準()
    this.constructor.隠藏全部()
    update(選擇面板.介面, {
      x: 基準.offsetLeft + 'px',
      y: (基準.offsetTop + 基準.offsetHeight) + 'px',
      display: ''
    })
  }

  隠藏介面 () {
    var 選擇面板 = this
    update(選擇面板.介面, {display: 'none'})
  }

  切換介面 () {
    var 選擇面板 = this
    if ( read(選擇面板.介面, 'display') == 'none' ) {
      選擇面板.顯示介面();
    } else {
      選擇面板.隠藏介面();
    }
  }

  static 隠藏全部() {
    map(
      $$('.選擇面板'),
      介面 => update(介面, {display: 'none'})
    )
  }
  // END［選擇面板］
}


class 選擇器 extends 選擇面板 {
  /**
   *  【描述說明】
   *    ・一對多選字器，用於存儲資訊和生成介面
   *
   *  【構造器】
   *    ・字位: 字位 // 所屬的字位
   *    ・選項表: array<選項>
   *    ・預設選項: char // 預設對應字
   *    ・注解: string
   *
   *  【方法】
   *    ・存在候選字: (候選字) => bool
   *    ・[private] 生成介面: (void) => HTMLElement
   */
  constructor ( 字位, 選項表, 預設選項, 注解 ) {
    super(() => 字位.介面)
    var 選擇器 = this
    選擇器.字位 = 字位
    選擇器.選項表 = 選項表
    選擇器.預設選項 = 預設選項    
    選擇器.注解 = 注解
    選擇器.介面 = 選擇器.生成介面()
  }

  存在候選字 ( 候選字 ) {
    var 選擇器 = this
    for(let 選項 of 選擇器.選項表) {
      if(選項.候選字 == 候選字) {
	return true;
      }
    }
    return false;
  }

  生成介面 () {
    var 選擇器 = this
    return create(
      { tag: 'div', classList: ['選擇器', '選擇面板'],
	style: {
	  position: 'absolute',
	  left: field('x'),
	  top: field('y'),
	  display: field('display', 'none')
	},
	children: [
	  { tag: 'div', className: '選項列表', children: map(
	    選擇器.選項表, 選項 =>
	      ({ tag: 'div', classList: ['一對多選項', '選項'], children: [
		{ tag: 'span', className: '候選字', textContent: 選項.候選字 },
		{ tag: 'span', className: '例詞表', children: map(
		  選項.例詞表, 例詞 =>
		    ({ tag: 'span', className: '例詞', textContent: 例詞 })
		) }
	      ], handlers: {
		click: ev =>
		  選擇器.字位.變更對應字(選項.候選字)
		  + 選擇器.隠藏介面()
	      } })
	  ) },
	  { tag: 'div', className: '注解', textContent: 選擇器.注解,
	    handlers: { click: ev => ev.stopPropagation() } }
      ] }
    );
  }
  // END［選擇器］
}


class 地區詞選項 {
  /**
   *  【描述說明】
   *    ・地區詞轉換的一個選項（一種可能）
   *    ・與具體文章綁定
   *
   *  【構造器】
   *    ・原詞: string // 被轉換的詞，如「操作系统」
   *    ・對應詞: string // 對應的詞，如「作業系統」
   *    ・起點位置: int // 被轉換詞的第一個字元在文章中的索引
   *    ・終點位置: int // 被轉換詞的最後一個字元在文章中的索引 + 1
   *    ・文章: 文章 // 被轉換的當前文章
   *    ・附加資訊: hash // 如 {'原文': 'Operating System'}
   *
   *  【注】
   *    ・左閉右開區間 [起點位置, 終點位置) 表示原詞在文章中的位置
   *
   *  【屬性】
   *    ・構造器引數
   *    ・被選擇: bool // 表示該選項是否被使用者選擇（或是預設值）
   *    ・字位組: array<字位> // 對應詞的字位（類型=附加字）
   *
   *  【方法】
   *    ・選擇此項: (void) => void
   *    ・取消選擇: (void) => void
   *    ・[private] 生成字位組: (void) => @constructor<字位組>
   *    ・[static] 有重合: (選項一, 選項二) => bool // 判斷衝突
   */
  constructor ( 原詞, 對應詞, 起點位置, 終點位置, 文章, 附加資訊 = {} ) {
    var 地區詞選項 = this
    確認 ( 起點位置 <= 終點位置 )
    地區詞選項.原詞 = 原詞
    地區詞選項.對應詞 = 對應詞
    地區詞選項.起點位置 = 起點位置
    地區詞選項.終點位置 = 終點位置
    地區詞選項.文章 = 文章
    地區詞選項.附加資訊 = 附加資訊
    地區詞選項.被選擇 = false
    地區詞選項.字位組 = 地區詞選項.生成字位組()
  }

  生成字位組 () {
    var 地區詞選項 = this
    return map(
      地區詞選項.對應詞,
      字 => new 字位(字, 地區詞選項.文章, undefined, true)
      // constructor (待轉換字, 文章, 已確定對應字, 附加字)
    )
  }

  選擇此項 () {
    var 地區詞選項 = this
    map(
      地區詞選項.字位組,
      字位 => 確認( 字位.enabled == false ) + 字位.enable()
    )
    for ( let 索引=地區詞選項.起點位置; 索引<地區詞選項.終點位置; 索引++ ) {
      確認 ( 地區詞選項.文章.字位表[索引].enabled == true )
      地區詞選項.文章.字位表[索引].disable()
    }
    地區詞選項.被選擇 = true
  }

  取消選擇 () {
    var 地區詞選項 = this
    map(
      地區詞選項.字位組,
      字位 => 字位.disable()
    )
    for ( let 索引=地區詞選項.起點位置; 索引<地區詞選項.終點位置; 索引++ ) {
      地區詞選項.文章.字位表[索引].enable()
    }
    地區詞選項.被選擇 = false
  }

  static 有重合 (選項一, 選項二) {
    // 原詞所在區間有非空交集之意
    return (
      選項一.終點位置 > 選項二.起點位置 && 選項一.起點位置 < 選項二.終點位置
    )
  }
  // END［地區詞選項］
}


class 地區詞提示位 extends CompatEventTarget {
  /**
   *  【描述說明】
   *    ・插入文章之中的標記，提示此處有地區詞選項，點選之可彈出選單
   *
   *  【構造器】
   *    ・地區詞選項表: array<地區詞選項>
   *
   *  【屬性】
   *    ・選項表: @constructor<地區詞選項表>
   *    ・選單: 地區詞選單
   *    ・介面: HTMLElement
   *
   *  【方法】
   *    ・[private] 生成介面: (void) => HTMLElement
   *
   *  【事件】
   *    ・選詞更改: 用選單改變選詞時觸發
   */
  constructor ( 地區詞選項表 ) {
    super()
    var 地區詞提示位 = this
    確認 ( 地區詞選項表.length > 0 )
    地區詞提示位.選項表 = 地區詞選項表
    地區詞提示位.選單 = new 地區詞選單(地區詞提示位)
    地區詞提示位.介面 = 地區詞提示位.生成介面()
  }

  生成介面 () {
    var 地區詞提示位 = this
    var 類別列表 = map(地區詞提示位.選項表, 選項 => 選項.附加資訊.類別)
    var 單一類別 = any(類別列表, 類別 => 類別 == 類別列表[0])
    return create({
      tag: 'span', classList: ['地區詞提示位', '格子'],
      dataset: {
	單一類別: 單一類別? 類別列表[0]: undefined
      },
      textContent: '▲', handlers: {
	click: ev => 地區詞提示位.選單.切換介面() + ev.stopPropagation()
      } 
    })
  }
  // END［地區詞提示位］
}

class 地區詞選單 extends 選擇面板 {
  /**
   *  【描述說明】
   *    ・地區詞選擇器，基本只用於生成介面
   *
   *  【構造器】
   *    ・地區詞提示位: 地區詞提示位
   *
   *  【屬性】
   *    ・提示位: @constructor<地區詞提示位>
   *    ・選項表: @constructor<地區詞提示位.選項表>
   *     ・介面: HTMLElement
   *
   *  【方法】
   *    ・[private] 清除選項 (void) => void
   *    ・[private] 生成介面 (void) => HTMLElement
   */
  constructor ( 地區詞提示位 ) {
    super(() => 地區詞提示位.介面)
    var 地區詞選單 = this
    地區詞選單.提示位 = 地區詞提示位
    地區詞選單.選項表 = 地區詞提示位.選項表
    地區詞選單.介面 = 地區詞選單.生成介面()
  }

  清除選項 () {
    var 地區詞選單 = this
    map(
      地區詞選單.選項表,
      選項 => 選項.取消選擇()
    )    
  }

  生成介面 () {
    var 地區詞選單 = this
    var 選項表 = 地區詞選單.選項表
    return create(
      {
	tag: 'div', classList: ['地區詞選單', '選擇面板'],
	style: {
	  position: 'absolute',
	  left: field('x'),
	  top: field('y'),
	  display: field('display', 'none')
	},
	children: concat(
	  [{
	    tag: 'div', classList: ['地區詞選項', '選項'],
	    dataset: {
	      selected: field(
		'selected', !exists(選項表, 選項 => 選項.被選擇)
	      )
	    },
	    children: [
	      { tag: 'span', className:'條目名', textContent: '不轉換' }
	    ],
	    handlers: {
	      click: function (ev) {
		地區詞選單.清除選項()
		update(地區詞選單.介面, {selected: false})
		update(this, {selected: true})
		地區詞選單.隠藏介面()
		地區詞選單.提示位.dispatchEvent(new Event('選詞更改'))
	      }
	    }
	  }],
	  map(
	    選項表,
	    選項 => ({
	      tag: 'div', classList: [
		'選項',
		'地區詞選項'
	      ],
	      dataset: {
		selected: field('selected', 選項.被選擇),
		地區: 選項.附加資訊['地區'],
		類別: 選項.附加資訊['類別']
	      },
	      children: [
		{ tag: 'div', className: '上', children: [
		  { tag: 'span', className: '條目名', children: [
		    { tag: 'span', className: '原詞', textContent: 選項.原詞 },
		    { tag: 'span', className: '箭頭', textContent: ' ⇢ ' },
		    { tag: 'span', className: '對應詞',
		      textContent: 選項.對應詞 },
		  ] },
		  { tag: 'span', className: '類別',
		    textContent: '［' + 選項.附加資訊['類別'] + '］' },
		] },
		{ tag: 'div', className: '下', children: [
		  { tag: 'span', className: '原文',
		    textContent: 選項.附加資訊['原文'] }
		] }
	      ], handlers: {
		click: function (ev) {
		  地區詞選單.清除選項()
		  選項.選擇此項()
		  update(地區詞選單.介面, {selected: false})
		  update(this, {selected: true})
		  地區詞選單.隠藏介面()
		  地區詞選單.提示位.dispatchEvent(new Event('選詞更改'))
		}
	      }
	    })
	  ) // map
	) // concat
      } // root
    ) // create
  }
  // END［地區詞選單］
}


function 確認(bool_value) {
  if(!bool_value) throw "Assertion Error";
}
Object.prototype['存在'] = function (property) {
  return this.hasOwnProperty(property)
}
Object.prototype['不存在'] = function (property) {
  return !this.hasOwnProperty(property)
}
Array.prototype['添加'] = function (item) {
  return this.push(item)
}
// deep copy 1 layer except
function copy1except(object, except_key) {
  var result = {}
  for ( let key of Object.keys(object) ) {
    if ( key != except_key ) {
      result[key] = object[key]
    }
  }
  return result
}
