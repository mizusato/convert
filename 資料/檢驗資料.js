'use strict'


/**
 *
 *  【說明】檢驗資料之正確性，即:
 *    ・繁化表是一一對應，不能有兩個簡化字被指定給同一個繁體字
 *    ・不是一一對應的字，有以下幾種情況:
 *      ・一簡多繁
 *      ・一簡多異（正異取捨）
 *      ・一繁多簡
 *      ・類推簡化字不用或衝突
 *      其中，一繁多簡必由一簡多繁或一簡多異產生。
 *      這是因為，簡化字的方針是合併而非分化，
 *      不可能有一個字被簡化成兩個完全不相干的字。
 *      常見的情況是規範字採取了與傳統或港台不同的正異取捨方案或用字習慣，
 *
 *          例如:
 *
 *            链 -------- 鏈［鎖鏈］
 *               ＼
 *               　＼［項鍊］
 *               　　＼
 *               　　　＼
 *           *𫔀 -------> 鍊
 *               　　　／
 *               　　／
 *               　／［鍛鍊］
 *               ／
 *            炼 -------- 煉［修煉］
 *            
 *            著 -------- 著［著作］
 *               　　　／
 *               　　／
 *               　／［看著］（台灣習慣）
 *               ／
 *            着 -------- 着［看着］（香港習慣）
 *
 *      或是一個字只有部分義項被簡化了。
 *
 *          例如:
 *
 *            乾 -------- 乾［乾坤］
 *               　　　／
 *               　　／
 *               　／［乾燥］
 *               ／
 *            干 -------- 干［干涉］
 *               ＼
 *               　＼
 *               　　＼
 *               　　　＼
 *            　          幹［幹線］
 *
 *            徵 -------- 徵［宫商角徵羽］
 *               　　　／
 *               　　／
 *               　／［特徵］
 *               ／
 *            征 -------- 征［征途］
 *
 *      類推簡化字如果不被使用（在簡體習慣中不簡化），
 *      就產生了 簡->繁 單向轉換關係，
 *
 *          例如:
 *
 *           *㓥 -------> 劏（不類推簡化）
 *               　　　／
 *               　　／
 *               　／［劏房］
 *               ／
 *            劏 
 *
 *      而如果與一簡多繁或一一對應發生衝突，也會產生單向轉換關係，
 *
 *          例如:
 *
 *           *锺 -------> 鍾［鍾愛］［錢鍾書］
 *               　　　／
 *               　　／
 *               　／
 *               ／
 *            钟 -------- 鐘［鐘錶］［鐘鳴鼎食］
 *
 *           *𫔭 -------> 開［開啟］
 *               　　　／
 *               　　／
 *               　／
 *               ／
 *            开
 * 
 *      以上多種情況同時出現也是可能的，
 *
 *          例如:
 *
 *           *渖 -------> 瀋［瀋陽］ // 類推字
 *               　　　／
 *               　　／
 *               　／ //簡化合併
 *               ／ 
 *            沈 -------- 沈［姓沈］
 *               　　　／
 *               　　／
 *               　／ ［下沈］//正異取捨
 *               ／ 
 *            沉 -------- 沉［下沉］
 *
 *      雖然對應關係如此複雜，但每一個規範字的身份都是確定的，必為以下情況之一:
 *
 *        ・簡繁一一對應，記錄在【繁化表】中
 *        ・簡化+合併，記錄在【一簡多繁表】中
 *        ・規範字合併多種寫法，記錄在【正異取捨表】中
 *        ・不使用的類推簡化字，記錄在【單向繁化表】中
 *
 *      因此上述四張表中的簡化字/規範字是不能有交集的。
 *
 *      而對於繁體字來說，每個繁體字的身份就不像規範字那麽確定，
 *      同一個字可以出現在多個表中，但是【繁化表】中的繁體字是一一對應字，
 *      所以不會出現在其它各表中（單向繁化表除外，因為類推簡化不破壞一一對應）
 *
 */


function 檢驗資料 () {
  var 錯誤表 = []
  function 檢測衝突 (基準表, 比較表) {
    var 衝突元素表 = []
    for ( let 元素 of Object.keys(基準表) ) {
      if ( 比較表.存在(元素) ) {
	衝突元素表.push(元素)
      }
    }
    return 衝突元素表
  }
  // 確認繁化表為一一映射
  if ( 繁化表 ) {
    let 簡化表 = {}
    map(繁化表, function (簡化字, 繁體字) {
      if ( 簡化表.不存在(繁體字) ) {
	簡化表[繁體字] = []
      }
      簡化表[繁體字].push(簡化字)
      if ( 簡化字 == 繁體字 ) {
	錯誤表.push(`繁化表出現冗餘項: ${簡化字} -> ${繁體字}`)	
      }
    })
    map(簡化表, function (繁體字, 簡化字表) {
      if ( 簡化字表.length > 1 ) {
	錯誤表.push(`繁化表出現多簡對一繁: ${繁體字} -> [${簡化字表}]`)
      }
    })
  }
  // 同一簡化字（規範字）只出現在四表之一
  var 不可衝突表名 = ['繁化表', '一簡多繁表', '單向繁化表', '正異取捨表']
  for ( let i=0; i<不可衝突表名.length; i++ ) {
    for ( let j=i+1; j<不可衝突表名.length; j++ ) {
      if ( window.存在(不可衝突表名[i]) && window.存在(不可衝突表名[j]) ) {
	let 表1 = window[不可衝突表名[i]]
	let 表2 = window[不可衝突表名[j]]
	let 衝突簡化字表 = 檢測衝突(表1, 表2)
	if ( 衝突簡化字表.length > 0 ) {
	  錯誤表.push(
	    `${不可衝突表名[i]} 與 ${不可衝突表名[j]} 衝突: [${衝突簡化字表}]`
	  )
	}
      }
    }
  }
  // 一一對應的繁體字不出現在其它各表中
  var 非一一對應表名 = ['一簡多繁表', '一繁多簡表', '正異取捨表']
  var 一對一繁體字表 = gethash(map(繁化表, (簡化字, 繁體字) => 繁體字))
  for ( let 表名 of 非一一對應表名 ) {
    if ( window.存在(表名) ) {
      let 對比表 = window[表名]
      if ( 表名 == '一簡多繁表' ) {
	對比表 = gethash(
	  extract(map(values(對比表), 資訊 => Object.keys(資訊.對應字)))
	)
      } else if ( 表名 == '正異取捨表' ) {
	對比表 = gethash(
	  extract(map(
	    extract(values(對比表)),
	    字組 => map(字組, 字 => 字 != 字組[0]? 字: jump(0))
	  ))
	)
      }
      let 衝突繁體字表 = 檢測衝突(一對一繁體字表, 對比表)
      if ( 衝突繁體字表.length > 0 ) {
	錯誤表.push(
	  `${表名} 與 繁化表 衝突: [${衝突繁體字表}]`
	)
      }
    }
  }
  // 提示錯誤
  if ( 錯誤表.length > 0 ) {
    while ( true ) {
      alert(`資料錯誤:\n${錯誤表.join('\n')}`)
    }
  }
}


window.addEventListener('DOMContentLoaded', ev => 檢驗資料())


Object.prototype['存在'] = function (property) {
  return this.hasOwnProperty(property)
}
