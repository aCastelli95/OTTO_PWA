var connectButton = document.getElementById('bluetooth'); //conectar_bluetooth
var disconnectButton = document.getElementById('desconectar_bluetooth');
var deviceCache = null;
let characteristicCache = null;

//Conect
connectButton.addEventListener("click", function(){
    console.log("Tocaste el bluetooth!!");
    connect();
    // Sincronizar con arduino
});

//Desconectar de arduino
disconnectButton.addEventListener("click", function(){
    console.log("Desconectar el bluetooth!!");
    disconnect();
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
    if (deviceCache) {
        console.log('Disconnecting from "' + deviceCache.name + '" bluetooth device...');
        deviceCache.removeEventListener('gattserverdisconnected',
            handleDisconnection);
    
        if (deviceCache.gatt.connected) {
          deviceCache.gatt.disconnect();
          console.log('"' + deviceCache.name + '" bluetooth device disconnected');
        }
        else {
            console.log('"' + deviceCache.name +
              '" bluetooth device is already disconnected');
        }
      }
    
      if (characteristicCache) {
        characteristicCache.removeEventListener('characteristicvaluechanged',
            handleCharacteristicValueChanged);
        characteristicCache = null;
      }

      deviceCache = null;

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

  //Reconexion al mismo dispositivo anteriors
  function handleDisconnection(event) {
    let device = event.target;
  
    console.log('"' + device.name +
        '" bluetooth device disconnected, trying to reconnect...');
  
    connectDeviceAndCacheCharacteristic(device).
        then(characteristic => startNotifications(characteristic)).
        catch(error => console.log(error));
  }
  
  // Conexión al dispositivo Bluetooth
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
  /**Funcion para realizar notificado - sincronizado los dispositivos */
  function startNotifications(characteristic) {
    console.log('Starting notifications...');
    return characteristic.startNotifications().
      then(() => {
        console.log('Notifications started');
        characteristic.addEventListener('characteristicvaluechanged',
            handleCharacteristicValueChanged);
      });
  }

  
// Data receiving
function handleCharacteristicValueChanged(event) {
    let value = new TextDecoder().decode(event.target.value);
    console.log(value);
  }
