var connectButton = document.getElementById('conectar_bluetooth');
var disconnectButton = document.getElementById('desconectar_bluetooth');
let terminalContainer = document.getElementById('terminal');
var deviceCache = null;

//Conect
connectButton.addEventListener("click", function(){
    console.log("Tocaste el bluetooth!!");
    connect();
    // Sincronizar con arduino
});

//disconect
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
        log('Disconnecting from "' + deviceCache.name + '" bluetooth device...');
        deviceCache.removeEventListener('gattserverdisconnected',
            handleDisconnection);
    
        if (deviceCache.gatt.connected) {
          deviceCache.gatt.disconnect();
          log('"' + deviceCache.name + '" bluetooth device disconnected');
        }
        else {
          log('"' + deviceCache.name +
              '" bluetooth device is already disconnected');
        }
      }
    
      characteristicCache = null;
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
      });
  }

  /**En caso de tener una terminal, o un div con terminal, esto
   * iria realizando un debug de la aplicacion con su conexion bluetooth
   */
  function log(data, type = '') {
    terminalContainer.insertAdjacentHTML('beforeend',
        '<div' + (type ? ' class="' + type + '"' : '') + '>' + data + '</div>');
  }
