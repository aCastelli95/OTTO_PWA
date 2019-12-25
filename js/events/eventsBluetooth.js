var connectButton = document.getElementById('conectar_bluetooth');
var disconnectButton = document.getElementById('desconectar_bluetooth');
let terminalContainer = document.getElementById('terminal');
var deviceCache = null;

//Conect
connectButton.addEventListener("click", function(){
    console.log("Tocaste el bluetooth che!!");
    connect();
    // Sincronizar con arduino
});

//disconect
disconnectButton.addEventListener("click", function(){
    console.log("Tocaste el bluetooth che!!");
    //disconnect();
    //Desconectar de arduino
});

// Launch Bluetooth device chooser and connect to the selected
function connect() {

    return (deviceCache ? Promise.resolve(deviceCache) :
      requestBluetoothDevice()).
      then(device => connectDeviceAndCacheCharacteristic(device)).
      then(characteristic => startNotifications(characteristic)).
      catch(error => console.log(error));
  }
  
// Disconnect from the connected device
function disconnect() {
//
}

function requestBluetoothDevice() {
    //Busca a partir de la API -> navigator.bluetooth.requestDevice
    // el disopsitivo con service 0xFFE0 identificacion unica
    console.log('Requesting bluetooth device...');

    return navigator.bluetooth.requestDevice({
        filters: [{services: [0xFFE0]}],
    }).
      then(device => {
        console.log('"' + device.name + '" bluetooth device selected');
        deviceCache = device;
        deviceCache.addEventListener('gattserverdisconnected',
        handleDisconnection);
        return deviceCache;
      });
  }

  // Va tratar de reconectarse
  function handleDisconnection(event) {
    let device = event.target;
  
    console.log('"' + device.name +
        '" bluetooth device disconnected, trying to reconnect...');
  
    connectDeviceAndCacheCharacteristic(device).
        then(characteristic => startNotifications(characteristic)).
        catch(error => console.log(error));
  }
  
  // Connect to the device specified, get service and characteristic
  function connectDeviceAndCacheCharacteristic(device) {
    if (device.gatt.connected && characteristicCache) {
        return Promise.resolve(characteristicCache);
      }
    
      console.log('Connecting to GATT server...');
    
      return device.gatt.connect().
          then(server => {
            console.log('GATT server connected, getting service...');
            return server.getPrimaryService(0xFFE0);
          }).
          then(service => {
            console.log('Service found, getting characteristic...');
            return service.getCharacteristic(0xFFE1);
          }).
          then(characteristic => {
            console.log('Characteristic found');
            characteristicCache = characteristic;
            return characteristicCache;
          });
  }
  
  // Enable the characteristic changes notification
  function startNotifications(characteristic) {
    console.log('Starting notifications...');
    return characteristic.startNotifications().
      then(() => {
        console.log('Notifications started');
      });
  }

  function log(data, type = '') {
    terminalContainer.insertAdjacentHTML('beforeend',
        '<div' + (type ? ' class="' + type + '"' : '') + '>' + data + '</div>');
  }
