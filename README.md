# nature-remo-to-spreadsheet

Nature RemoのセンサーデータをGoogle Spread Sheetに書き続けるだけのGoogle App Scriptです。
これで取得した基礎データをグラフ化したりしてお楽しみください。

# How To Setup

1. Create New Google Spread Sheet.
1. Select [Tools]>[Script Editor]
1. Copy remo_to_spreadsheet.gs to your code.
1. Setting your code and enjoy logging!

```
// Please get your access token from https://home.nature.global/
var REMO_ACCESS_TOKEN = 'YourAccessToken';

// Please set your spreadsheet url.
var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/hogehoge/edit#gid=0'

// First, Exec this script to create new device sheet. Check new device sheet, and Set your device id.
var REMO_TARGET_DEVICE_ID = ['YourDeviceId1', 'YourDeviceId2', ...]

// Second, Exec this script. Check data sheet (default is "remo_logs"). if you can check your device data, Congratuation!
// Finaly, Set Triger on your project to exec every XXX minutes or hours.
```

# 謝辞
このスクリプトは tobi50 さんのリポジトリからフォークしました。
https://github.com/tobi50/nature-remo-to-spreadsheet
https://qiita.com/tobi50/items/6bbf6f53fe975f26f445
