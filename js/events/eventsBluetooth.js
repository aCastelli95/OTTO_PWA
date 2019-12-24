var connectButton = document.getElementById('conectar_bluetooth');
var disconnectButton = document.getElementById('desconectar_bluetooth');
var deviceCache = null;

//Conect
connectButton.addEventListener("click", function(){
    window.alert("Tocaste el bluetooth che!!");
    connect();
    // Sincronizar con arduino
});

//disconect
disconnectButton.addEventListener("click", function(){
    window.alert("Tocaste el bluetooth che!!");
    //disconnect();
    //Desconectar de arduino
});

// Launch Bluetooth device chooser and connect to the selected
function connect() {

    return (deviceCache ? Promise.resolve(deviceCache) :
      requestBluetoothDevice()).
      then(device => connectDeviceAndCacheCharacteristic(device)).
      then(characteristic => startNotifications(characteristic)).
      catch(error => window.alert(error));
  }
  
// Disconnect from the connected device
function disconnect() {
//
}

function requestBluetoothDevice() {
    //Busca a partir de la API -> navigator.bluetooth.requestDevice
    // el disopsitivo con service 0xFFE0 identificacion unica
    window.alert('Requesting bluetooth device...');

    return navigator.bluetooth.requestDevice({
        filters: [{services: [0xFFE0]}],
    }).
      then(device => {
        window.alert('"' + device.name + '" bluetooth device selected');
        deviceCache = device;
        return deviceCache;
      });
  }
  
  // Connect to the device specified, get service and characteristic
  function connectDeviceAndCacheCharacteristic(device) {
    if (device.gatt.connected && characteristicCache) {
        return Promise.resolve(characteristicCache);
      }
    
      window.alert('Connecting to GATT server...');
    
      return device.gatt.connect().
          then(server => {
            window.alert('GATT server connected, getting service...');
            return server.getPrimaryService(0xFFE0);
          }).
          then(service => {
            window.alert('Service found, getting characteristic...');
            return service.getCharacteristic(0xFFE1);
          }).
          then(characteristic => {
            window.alert('Characteristic found');
            characteristicCache = characteristic;
            return characteristicCache;
          });
  }
  
  // Enable the characteristic changes notification
  function startNotifications(characteristic) {
    window.alert('Starting notifications...');
    return characteristic.startNotifications().
      then(() => {
        window.alert('Notifications started');
      });
  }
