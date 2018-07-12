'use strict';


class 字位 {
  /**
   *  【物件說明】
   *    被轉換的單個字的抽象化
   *
   *  【構造器】
   *    ・待轉換字: char
   *    ・一對一表: hash<char>
   *    ・一對多表: hash<資料[1]:object>
   *    ・選擇器生成函數: (字位: 字位, 資料: 資料[1]) => 選擇器: 選擇器
   *   // 注: 後三個參數決定了轉換的規則
   *
   *  【屬性】
   *    ・類型: enum {一對一字, 一對多字, 無對應字}
   *    【一對一字】
   *      ・對應字: char 
   *    【一對多字】
   *      ・選擇器: 選擇器
   *      ・當前選擇的對應字: char
   *
   *  【方法】
   *    ・變更對應字: (新字: char) => void
   */
  constructor ( 待轉換字, 一對一表, 一對多表, 選擇器生成函數 ) {
    var 字位 = this
    字位.待轉換字 = 待轉換字
    if ( 一對一表.存在(待轉換字) ) {
      字位.類型 = '一對一字'
      字位.對應字 = 一對一表[待轉換字]
    } else if ( 一對多表.存在(待轉換字) ) {
      字位.類型 = '一對多字'
      字位.選擇器 = 選擇器生成函數(字位, 一對多表[待轉換字])
      字位.當前選擇的對應字 = 字位.選擇器.預設選項
    } else {
      字位.類型 = '無對應字'
    }
    字位.介面 = 字位.生成介面()
  }

  // TODO: 狀態

  變更對應字 ( 新字 ) {
    var 字位 = this
    確認( 字位.類型 == '一對多字' )
    確認( 選擇器.存在候選字(新字) )
    字位.當前選擇的對應字 = 新字
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
    return create(
      { tag: 'span', className: '字位', textContent: 字位.取得顯示字(),
	handlers: { click: ev => 字位.選擇器.顯示介面() } }
    )
  }

  更新介面 () {
    var 字位 = this
    字位.介面.textContent = 字位.取得顯示字()
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
      { tag: 'div', className: '選擇面板', children: [
	{ tag: 'div', className: '選項列表', children: map(
	  選擇器.選項表, 選項 =>
	    { tag: 'div', className: '選項', children: [
	      { tag: 'span', className: '候選字', textContent: 選項.候選字 },
	      { tag: 'span', className: '例詞表', children: map(
		選項.例詞表, 例詞 =>
		  { tag: 'span', className: '例詞', textContent: 例詞 }
	      ) }
	    ], handlers: {
	      click: ev => 選擇器.字位.變更對應字(選項.候選字)
	    } }
	) },
	{ tag: 'div', className: '注解', textContent: 選擇器.注解 }
      ] }
    );
  }

  顯示介面 () {

  }
}


function 確認(bool_value) { if(!bool_value) return "Assertion Error"; }
Object.prototype['存在'] = property => this.hasOwnProperty(property)
