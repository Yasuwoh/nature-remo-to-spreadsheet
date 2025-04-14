// Please get your access token from https://home.nature.global/
var REMO_ACCESS_TOKEN = 'YourAccessToken';

// Please set your spreadsheet url.
var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/hogehoge/edit#gid=0'

// First, Exec this script to create new device sheet. Check new device sheet, and Set your device id.
var REMO_TARGET_DEVICE_IDS = [
  'YourDeviceId1',
  'YourDeviceId2',
]

// Second, Exec this script. Check data sheet (default is "remo_logs"). if you can check your device data, Congratuation!
// Finaly, Set Triger on your project to exec every XXX minutes or hours.



const EVENT_KINDS = [['te','Temperature'], ['hu','Humidity'], ['il','Illumination'], ['mo','Movement']]
var REMO_BASE_URL = 'https://api.nature.global/1/'
var SPREADSHEET_DATA_SHEET_NAME = 'remo_logs'

function get_sensor_data(){
  // fetch Nature Remo API
  const params = {
    "method" : "get",
    'headers': {'authorization': "Bearer " + REMO_ACCESS_TOKEN}
  };
  try {
    var response = UrlFetchApp.fetch(REMO_BASE_URL + '/devices', params);
  } catch(e){
    Logger.log("failed to connect.Check your Nature Remo Access Token Setting");
    Browser.msgBox("failed to connect.Check your Nature Remo Access Token Setting");
    return;
  }
  
  // parse fetched JSON
  try {
    var all_devices = JSON.parse(response);
  } catch (e) {
    Logger.log("failed to parse response: " + response);
    Browser.msgBox("failed to parse response: " + response);
    return;
  }
  // leave only devices which defined in REMO_TARGET_DEVICE_IDS
  var devices = all_devices.filter(function(device){
    return REMO_TARGET_DEVICE_IDS.includes(device.id)
  })
  // open spread sheet
  var sheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  // list all devices if devices list is empty
  if (devices.length <= 0) {
    all_devices.forEach( function( device ) {
      var device_sheet_name = 'device_info_'+device.id
      var device_sheet = sheet.getSheetByName(device_sheet_name)
      if(!device_sheet){
        var device_list = [];
        for (var key in device) {
          device_list.unshift([key,device[key]]);
        };
        var new_device_sheet = sheet.insertSheet(device_sheet_name)
        new_device_sheet.getRange("A1:B"+device_list.length.toString(10)).setValues(device_list)
      }
    })
    
    Logger.log("failed to find target device. Please check device sheet and setting target device id.");
    Browser.msgBox("failed to find target device. Please check device sheet and setting target device id.");
    return;
  }
  // sort order by REMO_TARGET_DEVICE_IDS
  devices.sort(function(a,b){
    var index_a = REMO_TARGET_DEVICE_IDS.indexOf(a.id)
    var index_b = REMO_TARGET_DEVICE_IDS.indexOf(b.id)
    if (index_a == -1 && index_b == -1) return 0
    if (index_a == -1 && index_b != -1) return 1
    if (index_a != -1 && index_b == -1) return -1
    return index_a - index_b
  })

  // create sheet if not exists
  var data_sheet = sheet.getSheetByName(SPREADSHEET_DATA_SHEET_NAME)
  if(!data_sheet){
    var new_data_sheet = sheet.insertSheet(SPREADSHEET_DATA_SHEET_NAME)
    var row = ["get_time"]
    for (var device of devices) {
      for (var t of EVENT_KINDS) {
        if (t[0] in device.newest_events){
          row.push(device.name+":"+t[1]+"_Created_at", device.name+":"+t[1])
        }
      }
    }
    new_data_sheet.appendRow(row)
    data_sheet = new_data_sheet
  }

  // write data
  var row = [new Date()]
  for (var device of devices) {
    for (var t of EVENT_KINDS) {
      if (t[0] in device.newest_events) {
        row.push(
          _get_jst_datetime(device.newest_events[t[0]].created_at),
          device.newest_events[t[0]].val
        )
      }
    }
  }
  data_sheet.appendRow(row)
}

function _get_jst_datetime(datetime){
  date = new Date(datetime);
  return date
}
