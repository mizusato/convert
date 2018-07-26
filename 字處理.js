'use strict';


class 轉換規則 {
  /**
   *  【構造器】
   *    ・一對一表: hash<char>
   *    ・一對多表: hash<資料[1]:object>
   *    ・選擇器生成函數: (字位: 字位, 資料: 資料[1]) => 選擇器: 選擇器
   *    ・取捨表: hash<char>
   *    ・地區表: hash<char>
   */
  constructor (一對一表, 一對多表, 選擇器生成函數, 取捨表 = {}, 地區表 = {}) {
    var 轉換規則 = this
    轉換規則.一對一表 = 一對一表
    轉換規則.一對多表 = 一對多表
    轉換規則.選擇器生成函數 = 選擇器生成函數
    轉換規則.取捨表 = 取捨表
    轉換規則.地區表 = 地區表
    轉換規則.生成地區詞首字表()
  }

  生成地區詞首字表 () {
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
  
}


class 文章 extends CompatEventTarget {
  constructor (待轉換字表, 轉換規則) {
    super()
    var 文章 = this
    文章.待轉換字表 = 待轉換字表
    文章.轉換規則 = 轉換規則
    文章.字位表 = map(
      待轉換字表, function (字) {
	var 此字位;
	if ( typeof 字 == 'string' ) {
	  此字位 = new 字位(字, 文章)
	} else {
	  此字位 = new 字位(字.待轉換字, 文章, 字.已確定對應字)
	}
	此字位.addEventListener(
	  '狀態更新',
	  ()=>文章.dispatchEvent(new Event('狀態更新'))
	)
	return 此字位
      }
    )
    文章.地區詞分組表 = 文章.生成地區詞分組表()
    文章.介面 = 文章.生成介面()
  }

  生成地區詞分組表 () {
    /**
     * 如果兩個或多個可能被轉換的地區詞發生的重疊，
     * 就把它們分成一組，在同一個提示位中處理。
     */
    var 文章 = this
    var 首字表 = 文章.轉換規則.地區詞首字表
    // 待轉列表中或存在已定一對多，把它們 map 回原字
    var 待轉換字元表 = map(
      文章.待轉換字表,
      字 => (typeof 字 == 'string') && 字 || 字.待轉換字
    )
    var 線性表 = [] // Array of 地區詞選項 order by 起點位置
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
		  // 原詞, 對應詞, 起點位置, 終點位置, 附加資訊
		  原詞, 對應詞資訊['用語'], 索引, 索引+偏移量,
		  copy1except(對應詞資訊, '用語')
		)
	      ) // 添加到線性表
	    } // 遍歷對應詞
	  } // [索引, 索引+偏移量) 確實是地區詞
	} // 遍歷偏移量
      } // 首字表有此字
    } // 遍歷字表索引
    var 分組 = {} // 分組: hash<選項的索引@線性表, 本組最靠前選項的索引@線性表>
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
    // 最終的表，以各個組中最靠前的區間的起始位置為組號
    var 分組選項表 = {}
    for ( let I=0; I<線性表.length; I++ ) {
      let 組號 = 線性表[分組[I]].起點位置
      if ( 分組選項表.不存在(組號) ) {
	分組選項表[組號] = []
      }
      分組選項表[組號].push(線性表[I])      
    }
    return 分組選項表
  } 

  取得原文 () {
    var 文章 = this
    return map(文章.字位表, 字位 => 字位.待轉換字).join('')
  }

  取得修飾原文 () {
    var 文章 = this
    return map(文章.字位表, function (字位) {
      if ( 字位.類型 == '一對多字' && 字位.狀態 == '已選擇' ) {
	return `${字位.待轉換字}[${字位.取得顯示字()}]`
      }
      return 字位.待轉換字
    }).join('')
  }

  取得轉換文 () {
    var 文章 = this
    return map(文章.字位表, 字位 => 字位.取得顯示字()).join('')
  }

  生成介面 () {
    var 文章 = this
    return create({
      tag: 'div', className: '文章',
      style: { position: 'relative' },
      children: concat(
	map(文章.字位表, 字位 => 字位.介面),
	map(文章.字位表, 字位 => 字位.選擇器 && 字位.選擇器.介面)
      ),
      handlers: {
	click: ev => 選擇器.隠藏全部(),
	contextmenu: ev => 選擇器.隠藏全部()
      }
    })
  }
}



class 字位 extends CompatEventTarget {
  /**
   *  【物件說明】
   *    被轉換的單個字的抽象化
   *
   *  【構造器】
   *    ・待轉換字: char
   *    ・文章: 文章
   *
   *  【屬性】
   *    ・類型: enum {一對一字, 一對多字, 無對應字}
   *    【一對一字】
   *      ・對應字: char 
   *    【一對多字】
   *      ・狀態: enum {未選擇, 已選擇}
   *      ・選擇器: 選擇器
   *      ・當前選擇的對應字: char
   *
   *  【方法】
   *    ・變更對應字: (新字: char) => void
   *    ・使用預設字: (void) => void
   *    ・取得顯示字: (void) => char
   *    ・生成介面: [private]
   *    ・更新介面: [private]
   */
  constructor ( 待轉換字, 文章, 已確定對應字='' ) {
    super()
    var 字位 = this
    字位.待轉換字 = 待轉換字
    字位.文章 = 文章
    var 一對一表 = 文章.轉換規則.一對一表
    var 一對多表 = 文章.轉換規則.一對多表
    var 取捨表 = 文章.轉換規則.取捨表
    var 選擇器生成函數 = 文章.轉換規則.選擇器生成函數
    if ( 取捨表.存在(待轉換字) ) {
      字位.類型 = '一對一字'
      字位.對應字 = 取捨表[待轉換字]
    } else if ( 一對一表.存在(待轉換字) ) {
      字位.類型 = '一對一字'
      字位.對應字 = 一對一表[待轉換字]
    } else if ( 一對多表.存在(待轉換字) ) {
      字位.類型 = '一對多字'
      字位.選擇器 = 選擇器生成函數(字位, 一對多表[待轉換字])
      字位.當前選擇的對應字 = 字位.選擇器.預設選項
      字位.狀態 = '未選擇'
    } else {
      字位.類型 = '無對應字'
    }
    字位.介面 = 字位.生成介面()
    if ( 已確定對應字 != '' ) {
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
    字位.dispatchEvent(new Event('狀態更新'))
  }

  使用預設字 () {
    var 字位 = this
    確認( 字位.類型 == '一對多字' )
    字位.狀態 = '已選擇'
    字位.更新介面()
    字位.dispatchEvent(new Event('狀態更新'))
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
	tag: 'br', classList: ['字位', 字位.類型]
      })
    } else {
      return create({
	tag: 'span', classList: ['字位', 字位.類型],
	dataset: { 狀態: field('狀態', 字位.狀態) },
	textContent: field('顯示字', 字位.取得顯示字()),	
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
      狀態: 字位.狀態,
      顯示字: 字位.取得顯示字()
    })
  }
}


class 選項 {
  constructor ( 候選字, 例詞表 ) {
    var 選項 = this
    選項.候選字 = 候選字
    選項.例詞表 = 例詞表
  }
}


class 選擇器 {
  constructor ( 字位, 選項表, 預設選項, 注解 ) {
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
      { tag: 'div', className: '選擇面板',
	style: {
	  position: 'absolute',
	  left: field('x'),
	  top: field('y'),
	  display: field('display', 'none')
	},
	children: [
	{ tag: 'div', className: '選項列表', children: map(
	  選擇器.選項表, 選項 =>
	    ({ tag: 'div', className: '選項', children: [
	      { tag: 'span', className: '候選字', textContent: 選項.候選字 },
	      { tag: 'span', className: '例詞表', children: map(
		選項.例詞表, 例詞 =>
		  ({ tag: 'span', className: '例詞', textContent: 例詞 })
	      ) }
	    ], handlers: {
	      click: ev =>
		選擇器.字位.變更對應字(選項.候選字) + 選擇器.隠藏介面()
	    } })
	) },
	  { tag: 'div', className: '注解', textContent: 選擇器.注解,
	    handlers: { click: ev => ev.stopPropagation() } }
      ] }
    );
  }

  顯示介面 () {
    var 選擇器 = this
    var 字位介面 = 選擇器.字位.介面
    this.constructor.隠藏全部()
    update(選擇器.介面, {
      x: 字位介面.offsetLeft + 'px',
      y: (字位介面.offsetTop + 字位介面.offsetHeight) + 'px',
      display: ''
    })
  }

  隠藏介面 () {
    var 選擇器 = this
    update(選擇器.介面, {display: 'none'})
  }

  切換介面 () {
    var 選擇器 = this
    if ( read(選擇器.介面, 'display') == 'none' ) {
      選擇器.顯示介面();
    } else {
      選擇器.隠藏介面();
    }
  }

  static 隠藏全部() {
    map(
      $$('.選擇面板'),
      介面 => update(介面, {display: 'none'})
    )
  }
}


class 地區詞選項 {
  /**
   *  【構造器】
   *    ・原詞: string // 被轉換的詞，如「操作系统」
   *    ・對應詞: string // 對應的詞，如「作業系統」
   *    ・起點位置: int // 被轉換詞的第一個字元在文章中的索引
   *    ・終點位置: int // 被轉換詞的最後一個字元在文章中的索引 + 1
   *    ・附加資訊: hash // 如 {'英文': 'Operating System'}
   *   // 注：左閉右開區間 [起點位置, 終點位置) 表示原詞在文章中的位置
   */
  constructor ( 原詞, 對應詞, 起點位置, 終點位置, 附加資訊 = {} ) {
    var 地區詞選項 = this
    確認 ( 起點位置 <= 終點位置 )
    地區詞選項.原詞 = 原詞
    地區詞選項.對應詞 = 對應詞
    地區詞選項.起點位置 = 起點位置
    地區詞選項.終點位置 = 終點位置
    地區詞選項.附加資訊 = 附加資訊    
  }

  static 有重合 (選項一, 選項二) {
    // 原詞所在區間有非空交集之意
    return (
      選項一.終點位置 > 選項二.起點位置 && 選項一.起點位置 < 選項二.終點位置
    )
  }
}


class 地區詞提示位 {

}


function 確認(bool_value) {
  if(!bool_value) return "Assertion Error";
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
