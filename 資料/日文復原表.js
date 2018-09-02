/**
 *  日文復原表
 *
 *  【包括】
 *    ・繁化表新字體交集表
 *    ・日文復原增補一對一表
 *    ・日文復原一對多表
 *
 *  【說明】
 *    ・「繁化表新字體交集表」即日本新字體和簡化字的交集
 *    ・「日文復原一對多表」即裁剪修改過的一簡多繁表，
 *    　其中若出現中文一對多而日文一對一的情況
 *    　則加入「日文復原增補一對一表」
 *    ・正異取捨表中日文標準與規範字不同的也會加入「日文復原增補一對一表」
 *
 */


var 繁化表新字體交集表 = {
  "医": "醫",
  "奥": "奧",
  "横": "橫",
  "欧": "歐",
  "殴": "毆",
  "黄": "黃",
  "画": "畫",
  "会": "會",
  "学": "學",
  "岳": "嶽",
  "却": "卻",
  "旧": "舊",
  "虚": "虛",
  "峡": "峽",
  "挟": "挾",
  "狭": "狹",
  "区": "區",
  "径": "徑",
  "携": "攜",
  "茎": "莖",
  "献": "獻",
  "恒": "恆",
  "号": "號",
  "国": "國",
  "掴": "摑",
  "惨": "慘",
  "蚕": "蠶",
  "残": "殘",
  "辞": "辭",
  "写": "寫",
  "寿": "壽",
  "将": "將",
  "称": "稱",
  "条": "條",
  "状": "狀",
  "嘱": "囑",
  "触": "觸",
  "寝": "寢",
  "晋": "晉",
  "随": "隨",
  "数": "數",
  "枢": "樞",
  "声": "聲",
  "静": "靜",
  "窃": "竊",
  "浅": "淺",
  "潜": "潛",
  "践": "踐",
  "禅": "禪",
  "壮": "壯",
  "争": "爭",
  "装": "裝",
  "属": "屬",
  "堕": "墮",
  "体": "體",
  "滞": "滯",
  "担": "擔",
  "胆": "膽",
  "断": "斷",
  "昼": "晝",
  "虫": "蟲",
  "点": "點",
  "盗": "盜",
  "灯": "燈",
  "独": "獨",
  "届": "屆",
  "麦": "麥",
  "蛮": "蠻",
  "秘": "祕",
  "彦": "彥",
  "宝": "寶",
  "没": "沒",
  "恋": "戀",
  "弥": "彌",
  "与": "與",
  "誉": "譽",
  "遥": "遙",
  "瑶": "瑤",
  "来": "來",
  "乱": "亂",
  "凛": "凜",
  "励": "勵",
  "礼": "禮",
  "炉": "爐",
  "楼": "樓",
  "禄": "祿",
  "亘": "亙",
  "湾": "灣"
}


var 日文復原增補一對一表 = {
  // 正異取捨，不在繁化表中
  "为": "為", // ため
  "伪": "偽", // にせ
  "阅": "閲", // 検閲
  "闲": "閑", // 閑暇
  "灶": "竈", // かまど
  "妆": "粧", // 化粧
  "线": "線", // 線路
  "鲶": "鯰", // なまず
  "腭": "顎", // あご
  "痹": "痺", // しびれ
  "众": "衆", // 民衆
  "钩": "鉤", // 鉤括弧
  "钵": "鉢", // はち
  "启": "啓", // 拝啓
  "沉": "沈", // 沈没
  "卫": "衛", // 衛生
  "赝": "贋", // 贋造
  // 一對多變一對一
  "卤": "鹵",
  "坛": "壇",
  "饥": "飢",
  "仆": "僕",
  "舍": "捨",
  "佣": "傭",
  "苏": "蘇",
  "别": "別",
  "哄": "鬨",
  "熏": "燻",
  "尝": "嘗",
  "烟": "煙",
  "柜": "櫃",
  "杰": "傑",
  "炼": "煉",
  "链": "鏈",
  "摆": "擺",
  "僵": "殭",
  "药": "葯",
  "仑": "崙",
  "帘": "簾",
  "夸": "誇",
  "袅": "嫋",
  "杆": "桿",
  "鑒": "鑑",
  "搜": "蒐",
  "铲": "鏟",
  "叹": "嘆",
  "哗": "嘩",
  "荫": "蔭",
  "迹": "跡",
  "宁": "寧",
  "咨": "諮"
}


var 日文復原一對多表 = {
  "只": {
    "對應字": {
      "只": [
        "ただ",
	"只今",
	"只見"
      ],
      "隻": [
        "せき",
	"一隻",
        "片言隻語"
      ]
    },
    "注解": "簡体字は助数詞の「隻」という字を「只」という字に統合した。"
  },
  "后": {
    "對應字": {
      "後": [
        "あと",
	"のち",
	"うしろ"
      ],
      "后": [
        "皇后",
	"后宫"
      ]
    },
    "注解": "簡体字には「後悔」の「後」は「皇后」の「后」に統合された。"
  },
  "复": {
    "對應字": {
      "復": [
        "回復",
        "復習"
      ],
      "複": [
        "複雑",
        "複数",
	"複写"
      ]
    },
    "注解": "簡体字は「往復」などを意味する「復」という字を「重なる」などを意味する「複」という字とともに「复(ふく)」という字に統合した。"
  },
  "尽": {
    "對應字": {
      "尽": [
        "つくす",
        "つきる"
      ],
      "儘": [
        "まま"
      ]
    },
    "注解": "「儘(まま)」という字は日本語の文章にあまり現れないが、もし現れれば簡体字に「尽」という字に統合されるので修正する必要がある。"
  },
  "干": {
    "對應字": {
      "干": [
        "ほす",
	"干害",
        "干渉",
        "干支"
      ],
      "乾": [
        "かわく",
        "乾燥",
	"乾物"
      ],
      "幹": [
        "幹部",
        "新幹線"
      ]
    },
    "注解": "簡体字にはこの３つの「かん」と読む字は全部「干」に統合された。"
  },
  "并": {
    "對應字": {
      "並": [
        "ならぶ",
	"なみ",
	"並行"
      ],
      "併": [
        "合併",
        "併記"
      ],
      "并": [
        "并州(地名)"
      ]
    },
    "注解": "簡体字にはこの３つの字は全部「并(へい)」という字に統合された。"
  },
  "志": {
    "對應字": {
      "志": [
        "こころざし"
      ],
      "誌": [
        "雜誌",
        "日誌"
      ]
    },
    "注解": "簡体字は「記録」「記事」などを意味する「誌」という字を「志」という字に統合した。"
  },
  "汇": {
    "對應字": {
      "彙": [
        "語彙",
        "彙報"
      ],
      "匯": [
        "匯滞",
        "匯兌",
        "徐家匯"
      ]
    },
    "注解": "「匯(わい)」という字は「水がめぐる」などを意味する。簡体字には「語彙」の「彙」という字とともに「汇(わい)」という字に統合された。"
  },
  "系": {
    "對應字": {
      "系": [
        "系統",
	"理系",
	"参考系"
      ],
      "係": [
        "係數",
        "関係"
      ],
      /*
      "繋": [
	"つなぐ" // 「繋」非「繫」
      ]
      */
    },
    "注解": "簡体字にはこの２つの「けい」と読む字は全部「系統」の「系」に統合された。"
  },
  "荡": {
    "對應字": {
      "蕩": [],
      "盪": []
    },
    "注解": "この２つの字は日本語にあまり区別されないが、習慣による使い分けはないとはいえない。簡体字には統合された。"
  },
  "获": {
    "對應字": {
      "獲": [
        "獲得"
      ],
      "穫": [
        "収穫"
      ]
    },
    "注解": "簡体字にはこの２つの「かく」と読む字は全部「获(かく)」という字に統合された。"
  },
  "采": {
    "對應字": {
      "采": [
	"風采",
	"采女",
	"采配"
      ],
      "採": [
        "採点",
        "採集"
      ]
    },
    "注解": "簡体字は「採集」などを意味する「採」という字を「風采」の「采」という字に統合した。"
  },
  "里": {
    "對應字": {
      "里": [
        "さと",
        "万里の長城"
      ],
      "裏": [
	"うら",
        "裏面"
      ]
    },
    "注解": "簡体字には「裏面」の「裏」は「万里」の「里」に統合された。"
  },
  "钟": {
    "對應字": {
      "鍾": [
        "鍾愛",
        "鍾乳石"
      ],
      "鐘": [
        "かね"
      ]
    },
    "注解": "簡体字は「鐘」という字を「あつめる」などを意味する「鍾(しょう)」という字とともに「钟(しょう)」という字に統合した。"
  },
  "丑": {
    "對應字": {
      "丑": [
        "丑の日"
      ],
      "醜": [
        "みにくい",
        "醜悪"
      ]
    },
    "注解": "簡体字は「醜」という字を十二支の二番目の「丑」という字に統合した。"
  },
  "了": {
    "對應字": {
      "了": [
        "完了",
        "了解"
      ],
      "瞭": [
        "明瞭",
        "一目瞭然"
      ]
    },
    "注解": "簡体字は「明瞭」などを意味する「瞭」という字を「完了」の「了」という字に統合した。"
  },
  "克": {
    "對應字": {
      "克": [
        "克服",
      ],
      "剋": [
        "相剋",
        "下剋上"
      ]
    },
    "注解": "簡体字は「剋」という「克」と通用する字を「克」に統合した。"
  },
  "准": {
    "對應字": {
      "准": [
        "准看護師",
	"批准"
      ],
      "準": [
        "準備",
        "標準"
      ]
    },
    "注解": "「准」と「準」はもともと同じ字だが、習慣による使い分けがある。簡体字には全部「准」に統合された。"
  },
  "制": {
    "對應字": {
      "制": [
        "制度",
        "制御"
      ],
      "製": [
        "製造"
      ]
    },
    "注解": "簡体字には「製造」の「製」は「制度」の「制」に統合された。"
  },
  "吊": {
    "對應字": {
      "吊": [
        "つる",
        "吊革"
      ],
      "弔": [
        "とむらう",
        "弔問"
      ]
    },
    "注解": "簡体字は「吊」という字を「弔」という字に統合した。"
  },
  "致": {
    "對應字": {
      "致": [
        "いたす",
        "拉致"
      ],
      "緻": [
        "細緻",
	"緻密"
      ]
    },
    "注解": "簡体字は「きめが細かい」などを意味する「緻」という字を「致」という字に統合した。"
  },
  "云": {
    "對應字": {
      "雲": [
        "くも",
	"飛行機雲"
      ],
      "云": [
	"いう",
        "云云"
      ]
    },
    "注解": "簡体字は「雲」という字を「云々」の「云」という字に統合した。"
  },
  "签": {
    "對應字": {
      "簽": [
        "題簽"
      ],
      "籖": [
	"くじ",
	"宝籤"
      ]
    },
    "注解": "簡体字は「籤(くじ)」という字を「題簽(だいせん)」の「簽」の簡体字「签」に統合した。"
  },
  "谷": {
    "對應字": {
      "谷": [
	"たに"
      ],
      "穀": [
        "穀物"
      ]
    },
    "注解": "簡体字は「穀物」の「穀」という字を「谷」という字に統合した。"
  },
  "辟": {
    "對應字": {
      "辟": [
        "辟易"
      ],
      "闢": [
        "開闢"
      ]
    },
    "注解": "簡体字は「天地開闢」の「闢」という字を「辟易」の「辟」という字に統合した。"
  },
  "奸": {
    "對應字": {
      "奸": [
        "奸臣",
        "奸計"
      ],
      "姦": [
	"強姦",
        "姦淫"
      ]
    },
    "注解": "簡体字にはこの２つの意味が近い字は全部「奸」に統合された。"
  },
  "游": {
    "對應字": {
      "游": [
        "およぐ",
        "游泳"
      ],
      "遊": [
        "あそぶ"
      ]
    },
    "注解": "簡体字は「遊」という字を「およぐ」を意味する「游」という字に統合した。"
  },
  "郁": {
    "對應字": {
      "郁": [
        "馥郁"
      ],
      "鬱": [
        "憂鬱"
      ]
    },
    "注解": "簡体字は「憂鬱」の「鬱」という字を「馥郁(ふくいく)」の「郁(いく)」という字に統合した。"
  },
  "征": {
    "對應字": {
      "征": [
        "征服",
        "征伐"
      ],
      "徵": [
        "特徵",
        "徴収"
      ]
    },
    "注解": "簡体字は「特徴」の「徴」という字を「征服」の「征」という字に統合した。"
  },
  "周": {
    "對應字": {
      "周": [
        "周囲",
        "周回"
      ],
      "週": [
        "週末",
        "週刊"
      ],
      /*
      "賙": [
        "賙濟" // 罕用
      ]
      */
    },
    "注解": "簡体字には「週末」の「週」は「周回」の「周」に統合された。"
  },
  "针": {
    "對應字": {
      "針": [
        "秒針",
        "針葉樹"
      ],
      "鍼": [
        "鍼灸",
        "鍼砭"
      ]
    },
    "注解": "簡体字には「鍼灸(しんきゅう)」の「鍼(しん)」は「秒針」の「針」に統合された。"
  },
  "托": {
    "對應字": {
      "托": [
        "一蓮托生"
      ],
      "託": [
        "たくす"
      ]
    },
    "注解": "簡体字は「託」という字を手偏の「托(たく)」という字に統合した。"
  },
  "栗": {
    "對應字": {
      "栗": [
        "くり"
      ],
      "慄": [
        "戰慄"
      ]
    },
    "注解": "簡体字は「戦慄」の「慄」という字を「栗」という字に統合した。"
  },
  "升": {
    "對應字": {
      "升": [
        "一升"
      ],
      "昇": [
	"のぼる",
	"昇華"
      ]
    },
    "注解": "簡体字は「昇」という字を体積の単位の「升」という字に統合した。"
  },
  "出": {
    "對應字": {
      "出": [
        "でる",
        "輸出"
      ],
      "齣": [
        "こま"
      ]
    },
    "注解": "簡体字は「四齣漫画」の「齣(こま)」という字を「出」という字に統合した。"
  },
  "漓": {
    "對應字": {
      "漓": [
        "淋漓",
        "澆漓"
      ],
      "灕": [
        "灕江",
        "灕水"
      ]
    },
    "注解": "簡体字は地名に用いる「灕(り)」という字を「淋漓」の「漓」という字に統合した。"
  },
  "术": {
    "對應字": {
      "術": [
        "すべ",
	"芸術"
      ],
      "朮": [
        "オケラ"
      ]
    },
    "注解": "簡体字は「術」という字を植物の「朮(オケラ)」という字とともに「术(じゅつ)」という字に統合した。"
  },
  "尸": {
    "對應字": {
      "屍": [
        "かばね",
	"屍柩",
	"死屍"
      ],
      "尸": [
        "尸位素餐"
      ]
    },
    "注解": "簡体字は「屍(し)」という字をその本字「尸(し)」に統合した。"
  },
  "筑": {
    "對應字": {
      "築": [
        "建築"
      ],
      "筑": [
	"筑波"
      ]
    },
    "注解": "簡体字は「建築」の「築」という字を「筑波」の「筑」という字に統合した。"
  },
  "暗": {
    "對應字": {
      "暗": [
        "くらい"
      ],
      "闇": [
        "やみ"
      ]
    },
    "注解": "簡体字は「暗」という字を「闇」という字に統合した。"
  },
  "冲": {
    "對應字": {
      "衝": [
        "衝突",
        "衝動"
      ],
      "沖": [
        "おき",
	"沖合"
      ]
    },
    "注解": "簡体字は「突き当たる」などを意味する「衝」という字を「沖」という字に統合した。"
  },
  "扣": {
    "對應字": {
      "扣": [
	"ひかえる"
      ],
      "釦": [
        "ボタン"
      ]
    },
    "注解": "簡体字は「扣(ひかえる)」という字を「衣服のボタン」を意味する「釦」という字に統合した。"
  },
  "念": {
    "對應字": {
      "念": [
	"記念",
        "思念",
        "念の為"
      ],
      "唸": [
        "うなり"
      ]
    },
    "注解": "簡体字は「記念」の「念」という字を「唸」という字に統合した。"
  },
  "泛": {
    "對應字": {
      "泛": [
	"泛泛",
        "泛藍連盟"
      ],
      "氾": [
        "氾濫"
      ]
    },
    "注解": "簡体字は「氾濫」の「氾」という字を「汎」を意味する「泛」という字に統合した。"
  },
  "巨": {
    "對應字": {
      "巨": [
	"巨大"
      ],
      "鉅": [
        "鉅鹿"
      ]
    },
    "注解": "簡体字は地名に用いる「鉅(きょ)」という字を「巨大」の「巨」という字に統合した。"
  },
  "咽": {
    "對應字": {
      "咽": [
        "のど",
	"咽喉"
      ],
      "嚥": [
        "誤嚥",
	"嚥下"
      ]
    },
    "注解": "簡体字は「咽喉」の「咽」という字を「嚥下」の「嚥」に統合した。"
  },
  "愈": {
    "對應字": {
      "愈": [
	"いよいよ",
	"ますます"
      ],
      "癒": [
        "いやす",
        "癒着"
      ]
    },
    "注解": "簡体字は「癒」という字を「愈(いよいよ)」という字に統合した。"
  },
  "苔": {
    "對應字": {
      "苔": [
        "こけ"
      ],
      "薹": [
        "薹が立つ"
      ]      
    },
    "注解": "簡体字は「薹が立つ」の「薹(とう)」という字を「苔」という字に統合した。"
  },
  "于": {
    "對應字": {    
      "于": [],
      "於": [
	"おいて"
      ],
    },
    "注解": "簡体字は「於」という字を「于」という名字に用いる字に統合した。"
  }, 
  "适": {
    "對應字": {
      "適": [
	"てきする",
	"適当"
      ],
      "适": [
	"李适",
	"南宫适"
      ]
    },
    "注解": "簡体字は「適」という字を「适(かつ)」という人名に用いる字に統合した。"
  },
  "叶": {
    "對應字": {
      "叶": [
	"かなう",
	"叶韻"
      ],
      "葉": [
	"は",
	"言葉",
	"紅葉"
      ]
    },
    "注解": "簡体字は「葉」という字を「叶」という字に統合した。"
  },
  "沈": {
    "對應字": {
      "沈": [
	"しずむ",
	"沈氏"
      ],
      "瀋": [
	"瀋陽"
      ]
    },
    "注解": "簡体字は「瀋陽(しんよう)」の「瀋」という字を「沈」という字に統合した。"
  },
  "范": {
    "對應字": {
      "范": [
	"范仲淹",
	"范陽"
      ],
      "範": [
	"規範"
      ]
    },
    "注解": "簡体字は「規範」の「範」という字を「范(はん)」という名字に用いる字に統合した。"
  },
  "种": {
    "對應字": {
      "種": [
	"種類"
      ],
      "种": [
	"种氏"
      ]
    },
    "注解": "簡体字は「種類」の「種」という字を「种(ちゅう)」という名字に用いる字に統合した。"
  },
  "涂": {
    "對應字": {
      "塗": [
	"ぬる"
      ],
      "涂": [
	"涂氏"
      ]
    },
    "注解": "簡体字は「塗」という字を「涂(と)」という名字に用いる字に統合した。"
  },
  "厘": {
    "對應字": {
      "厘": [
	"一分一厘"
      ],
      "釐": [
	"毫釐"
      ]
    },
    "注解": "簡体字は「小さい分量」を意味する「毫釐(ごうり)」の「釐」という字を単位の一つの「厘」という字に統合した。"
  },
  "涌": {
    "對應字": {
      "湧": [
	"わく",
	"湧出",
	"湧泉"
      ],
      "涌": [
	"河涌",
	"東涌",
	"鰂魚涌"
      ]
    },
    "注解": "簡体字は「湧」という字をその異体字「涌(ゆう)」に統合した。しかし同じ形を持つ「涌(ちゅう)」という字は広東や香港などでは地名にも用いられる。"
  }
}
