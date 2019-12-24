let connectButton = document.getElementById('conectar_bluetooth');
let disconnectButton = document.getElementById('desconectar_bluetooth');
let deviceCache = null;

//Conect
connectButton.addEventListener('click', function(){
    connect();
    // Sincronizar con arduino
});

//disconect
disconnectButton.addEventListener('click', function(){
    disconnect();
    //Desconectar de arduino
});

// Launch Bluetooth device chooser and connect to the selected
function connect() {

    return (deviceCache ? Promise.resolve(deviceCache) :
      requestBluetoothDevice()).
      then(device => connectDeviceAndCacheCharacteristic(device)).
      then(characteristic => startNotifications(characteristic)).
      catch(error => Console.log(error));
  }
  
// Disconnect from the connected device
function disconnect() {
//
}

function requestBluetoothDevice() {
    //Busca a partir de la API -> navigator.bluetooth.requestDevice
    // el disopsitivo con service 0xFFE0 identificacion unica
    Console.log('Requesting bluetooth device...');

    return navigator.bluetooth.requestDevice({
        filters: [{services: [0xFFE0]}],
    }).
      then(device => {
        Console.log('"' + device.name + '" bluetooth device selected');
        deviceCache = device;
        return deviceCache;
      });
  }
  
  // Connect to the device specified, get service and characteristic
  function connectDeviceAndCacheCharacteristic(device) {
    if (device.gatt.connected && characteristicCache) {
        return Promise.resolve(characteristicCache);
      }
    
      Console.log('Connecting to GATT server...');
    
      return device.gatt.connect().
          then(server => {
            Console.log('GATT server connected, getting service...');
            return server.getPrimaryService(0xFFE0);
          }).
          then(service => {
            Console.log('Service found, getting characteristic...');
            return service.getCharacteristic(0xFFE1);
          }).
          then(characteristic => {
            Console.log('Characteristic found');
            characteristicCache = characteristic;
            return characteristicCache;
          });
  }
  
  // Enable the characteristic changes notification
  function startNotifications(characteristic) {
    Console.log('Starting notifications...');
    return characteristic.startNotifications().
      then(() => {
        Console.log('Notifications started');
      });
  }
|