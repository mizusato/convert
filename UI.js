'use strict'


var 轉換器; // instanceof 文章


function 初始化 (轉換函式, 輸入介面, 輸出介面, 轉換器介面, 功能) {
  轉換器介面 = replaceable(轉換器介面)
  function 輸入更新 () {
    localStorage['輸入字串'] = 輸入介面.value
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
    localStorage['輸入字串'] = 修飾原文
  }
  if ( localStorage['輸入字串'] ) {
    輸入介面.value = localStorage['輸入字串']
    輸入更新()
  }
  輸入介面.addEventListener('change', ev => 輸入更新())
  document.body.addEventListener('click', ev => 選擇面板.隠藏全部())
  if ( 功能['取捨設定'] ) {
    replace(功能.取捨設定.介面, 生成取捨設定介面())
    功能.取捨設定.介面.addEventListener('設定更改', ev => 輸入更新())
  }
  if ( 功能['地區詞設定'] ) {
    replace(功能.地區詞設定.介面, 生成地區詞設定介面())
    地區詞設定更新() // load saved settings
  }
}


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


function 生成地區詞設定介面 () {
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
	    { tag: 'div', className: '類別名', textContent: 類別 }
	  ]
	}
      }
    )
  })
}


