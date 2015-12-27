
# DarkestDungeonWayaku　DarkestDungeon 和訳 tool

## 参考

[日本語化作業所](https://docs.google.com/spreadsheets/d/1QuP833eJSERcQVba322ye1OfCt2l0lb2KWfqMpoYQDQ/edit#gid=1191296723)

[日本語化手順等](http://ch.nicovideo.jp/fuckomglol)


## Quick Start XML 変換作業

### Step 1 ) Zip ファイルをダウンロード
ZIPファイルをダウンロードして任意の場所に保存してください。

### Step 2 ) nw.exeを起動
フォルダ内のnw.exeを起動してください。

### Step 3 ) Darkest Dungeon インストールフォルダを設定

### Step 4 ) XMLファイル出力フォルダを設定

### Step 5 ) 変換ボタンを押す

![Step 5](/doc/image.gif "Step 5")

### Step 6 ) Darkest DungeonのXMLファイルを上書きする

SteamLibrary\steamapps\common\DarkestDungeon\localization内のファイルを上書きする

fonts内のファイルは Darkest Dungeon 日本語化作業 のファイルを使用してください。

### Step 7 ) localization.batを実行する

## Quick Start Fonts 変換作業

一部い機能を更新  
実行前にTTXをインストールし、環境変数を設定してください  
日本語化作業所の対応表を元にCMAPの置換が行われます。
[windows installer](http://sourceforge.net/projects/fonttools/files/2.0b1/)

### Step 1 ) fonts タブに移動する

### Step 2 ) fontsファイルを選択する

### Step 3 ) 変換ボタンを押す

### Step 4 ) fontsファイルを選択ディレクトリに*_new.ttfが出力されます

fontをインストールして置換が行われていることを確認してください

### Step 5 ) fontファイルを元にBMfontでTGAファイルを生成してください

## 	under development

### fonts変換の自動化（一部更新）
対応表が更新された時に、fontsを更新するのが手間だ。  
fontsファイルの変換はTTXでcmapを置換すれば対応できそうだ。  
fontsファイルの自動化が進めば濁点等の分割をして、対応漢字を増やすことも検討できそうだ。
