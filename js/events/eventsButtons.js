var b0 = document.getElementById("walkFordward");
var b1 = document.getElementById("walkBackground");
var b2 = document.getElementById("shakeLeg");
var b3 = document.getElementById("moonWalker");
var b4 = document.getElementById("crusaito");
var b5 = document.getElementById("flapping");
var b6 = document.getElementById("tiptoeSwing");
var b7 = document.getElementById("jitter");
var b8 = document.getElementById("happy");
var b9 = document.getElementById("love");
var b10 = document.getElementById("fart");
var b11 = document.getElementById("end");

var laFunc = function windowsAlertText(event) {
  console.log(event);
  sendCommand(); //send mensaje de device a otto
};

window.onload = function() {
  this.b0.addEventListener("click", laFunc(0));
  this.b1.addEventListener("click", laFunc(1));
  this.b2.addEventListener("click", laFunc(2));
  this.b3.addEventListener("click", laFunc(3));
  this.b4.addEventListener("click", laFunc(4));
  this.b5.addEventListener("click", laFunc(5));
  this.b6.addEventListener("click", laFunc(6));
  this.b7.addEventListener("click", laFunc(7));
  this.b8.addEventListener("click", laFunc(8));
  this.b9.addEventListener("click", laFunc(9));
  this.b10.addEventListener("click", laFunc(10));
  this.b11.addEventListener("click", laFunc(11));
};

function sendCommand(value) {
  data = "0001|03|" + value + "|200000000";

  if (!data || !characteristicCache) {
    return;
  }

  writeToCharacteristic(characteristicCache, data);
  console.log(data);
}

function writeToCharacteristic(characteristic, data) {
  characteristic.writeValue(new TextEncoder().encode(data));
}
