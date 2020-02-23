function windowsAlertText(event) {
  console.log(event);
  sendCommand(characteristicCache,event); //send mensaje de device a otto
};

function sendCommand(characteristic,value) {
  data = "0001|03|" + value + "|200000000";
  characteristic.writeValue(new TextEncoder().encode(data));
}


