'use strict'


var 轉換器; // instance of 文章


/**
 *  【引數】
 *    ・轉換函式: Function: 待轉換字串 => 文章
 *    ・輸入介面: HTMLTextAreaElement
 *    ・輸出介面: HTMLTextAreaElement
 *    ・轉換器介面: HTMLElement (placeholder)
 *    ・功能: hash: 功能名 -> { 介面: 該功能對應的介面 (placeholder) }
 */
function 初始化 (轉換函式, 輸入介面, 輸出介面, 轉換器介面, 功能 = {}) {
  var 函式名 = 轉換函式.name
  轉換器介面 = replaceable(轉換器介面)
  function 輸入更新 () {
    localStorage[`輸入字串-${函式名}`] = 輸入介面.value
    轉換器 = 轉換函式(輸入介面.value)
    轉換器介面.update(轉換器.介面)
    輸出介面.value = 轉換器.取得轉換結果()
    轉換器.addEventListener('選項更改', ev => 選項更改())
  }
  function 選項更改 () {
    var 修飾原文 = 轉換器.取得修飾原文()
    var 轉換文 = 轉換器.取得轉換結果()
    輸入介面.value = 修飾原文
    輸出介面.value = 轉換文
    localStorage[`輸入字串-${函式名}`] = 修飾原文
  }
  if ( localStorage[`輸入字串-${函式名}`] ) {
    輸入介面.value = localStorage[`輸入字串-${函式名}`]
    輸入更新()
  }
  輸入介面.addEventListener('change', ev => 輸入更新())
  document.body.addEventListener('click', ev => 選擇面板.隠藏全部())
  var 介面文字轉換 = 功能.存在('介面文字轉換')? 功能['介面文字轉換']: x=>x
  if ( 功能['取捨設定'] ) {
    let 取捨設定介面 = 生成取捨設定介面()
    replace(功能.取捨設定.介面, 取捨設定介面)
    取捨設定介面.addEventListener('設定更改', ev => 輸入更新())
  }
  if ( 功能['地區詞設定'] ) {
    replace(功能.地區詞設定.介面, 生成地區詞設定介面(介面文字轉換))
    地區詞設定更新() // load saved settings
  }
}


/**
 *  添加樣式使設定為 disabled 的類別之中的地區詞不再干擾轉換
 *  地區詞設定更新時被調用，可算一個 handler 函式
 *  在系統初始化時亦會被調用
 *  (void) => void
 */
function 地區詞設定更新 () {
  var 地區詞分類開關 = load_config('地區詞分類開關')
  inject_style('地區詞設定樣式', create_style(
    map(地區詞分類開關, (類別, 開關) => [
      [
      `.地區詞提示位[data-單一類別=${類別}]`,
      `.地區詞選項[data-類別=${類別}]`
      ],
      {
	      display: (開關 == 'disabled')? 'none': undefined
      }
    ])
  ))
}


/**
 *  生成包含每個類別的開關的介面
 *  只調用一次
 *  引數:
 *    ・類別名轉換:Function<(String)=>String> => HTMLElement
 */
function 生成地區詞設定介面 (類別名轉換 = x=>x) {
  var 地區詞分類開關 = load_config('地區詞分類開關')
  return create({
    tag: 'div', className: '地區詞設定', children: map (
      Object.keys(地區用詞表), function 生成選項介面 (類別) {
        var enabled = ( 地區詞分類開關[類別] != 'disabled' )
        function 切換開關 () {
          enabled = !enabled
          this.dataset.enabled = enabled
          地區詞分類開關[類別] = enabled? 'enabled': 'disabled'
          save_config('地區詞分類開關', 地區詞分類開關)
          地區詞設定更新()
        }
        return {
          tag: 'div',
          className: '地區詞設定條目',
          dataset: { enabled: enabled },
          handlers: { click: function (ev) { 切換開關.call(this) } },
          children: [
            { tag: 'div', className: '啟用標記', textContent: '✓' },
            { tag: 'div', className: '類別名', textContent: 類別名轉換(類別) }
          ]
        }
      }
    )
  })
}


