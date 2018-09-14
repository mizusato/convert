#!/usr/bin/env python3


# 【抓取中文維基百科 CGroup 之內容】


import re
import sys
import json
from bs4 import BeautifulSoup
import urllib.request
from urllib.parse import quote
from opencc import OpenCC


原文 = '原'
中國大陸 = '中'
香港 = '港'
台灣 = '台'


BASE_URL = 'https://zh.wikipedia.org/wiki/' + quote('模块') + ':CGroup/'
INDEX_LIST = ['原文', '大陆', '香港', '台灣']
INDEX_CONVERT = {'原文': 原文, '大陆': 中國大陸, '香港': 香港, '台灣': 台灣}


cc = OpenCC('t2s')


def info(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)


def 簡化(字串):
    return cc.convert(字串)


def 取得文檔(類別名):
    url = BASE_URL + quote(類別名)
    info('[GET] %s' % url)
    response = urllib.request.urlopen(url)
    return BeautifulSoup(response.read(), 'lxml')


def 取得條目表(文檔):
    條目表 = []
    wrapper = 文檔.find(id='mw-content-text')
    for ul in wrapper.find_all('ul'):
        for li in ul.find_all('li'):
            # 例: 原文：Abidal；大陆：阿比达尔；台灣：阿比達；香港：艾比度
            字串 = ''.join(li.stripped_strings)
            if 字串 is None:
                continue
            info('[String] %s' % 字串)
            分項表 = 字串.split('；')
            條目 = {}
            簡体 = ''
            for 分項 in 分項表:
                切分 = 分項.split('：')
                if len(切分) == 2:
                    if 切分[0] == '简体':
                        簡体 = 切分[1]
                    if 切分[0] in INDEX_LIST:
                        條目[INDEX_CONVERT[切分[0]]] = 切分[1]
            if not 條目.get(中國大陸) and 簡体:
                條目[中國大陸] = 簡体
            if len(條目) > 0 and 條目.get(中國大陸):
                for 地區名 in [香港, 台灣]:
                    if 條目.get(地區名):
                        if 簡化(條目[地區名]) == 條目[中國大陸]:
                            del 條目[地區名]
                if 條目.get(香港) or 條目.get(台灣):
                    if 條目.get(香港) and 條目.get(香港) == 條目.get(台灣):
                        del 條目[香港]
                    條目表.append(條目)
            if 條目.get(原文):
                表示式字串表 = ['[^;]*;(.*)', '[^,]*,(.*)', '[^\(]*\((.*)\)']
                表示式列表 = [re.compile(字串) for 字串 in 表示式字串表]
                for 表示式 in 表示式列表:
                    match = 表示式.match(條目[原文])
                    if match:
                        groups = match.groups()
                        if len(groups) == 1:
                            條目[原文] = groups[0].strip()
    return 條目表


def main():
    條目表 = []
    for i in range(1, len(sys.argv)):
        類別 = sys.argv[i]
        文檔 = 取得文檔(類別)
        條目表 += 取得條目表(文檔)
    print(json.dumps(條目表, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
