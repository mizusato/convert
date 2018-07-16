'use strict';


class 轉換規則 {
  /**
   *  【構造器】
   *    ・一對一表: hash<char>
   *    ・一對多表: hash<資料[1]:object>
   *    ・選擇器生成函數: (字位: 字位, 資料: 資料[1]) => 選擇器: 選擇器
   */
  constructor (一對一表, 一對多表, 選擇器生成函數) {
    var 轉換規則 = this
    轉換規則.一對一表 = 一對一表
    轉換規則.一對多表 = 一對多表
    轉換規則.選擇器生成函數 = 選擇器生成函數
  }
}


class 文章 {
  constructor (待轉換字串, 轉換規則) {
    var 文章 = this
    文章.待轉換字串 = 待轉換字串
    文章.轉換規則 = 轉換規則
    文章.字位表 = map(
      待轉換字串, (字 => new 字位(字, 文章))
    )
    文章.介面 = 文章.生成介面()
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



class 字位 {
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
  constructor ( 待轉換字, 文章 ) {
    var 字位 = this
    字位.待轉換字 = 待轉換字
    字位.文章 = 文章
    var 一對一表 = 文章.轉換規則.一對一表
    var 一對多表 = 文章.轉換規則.一對多表
    var 選擇器生成函數 = 文章.轉換規則.選擇器生成函數
    if ( 一對一表.存在(待轉換字) ) {
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
  }

  // TODO: 狀態

  變更對應字 ( 新字 ) {
    var 字位 = this
    確認( 字位.類型 == '一對多字' )
    確認( 字位.選擇器.存在候選字(新字) )
    字位.當前選擇的對應字 = 新字
    字位.狀態 = '已選擇'
    字位.更新介面()
  }

  使用預設字 () {
    var 字位 = this
    確認( 字位.類型 == '一對多字' )
    字位.狀態 = '已選擇'
    字位.更新介面()
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


function 確認(bool_value) {
  if(!bool_value) return "Assertion Error";
}
Object.prototype['存在'] = function (property) {
  return this.hasOwnProperty(property)
};
