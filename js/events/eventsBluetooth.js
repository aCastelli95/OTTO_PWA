var connectButton = document.getElementById('bluetooth');  // conectar_bluetooth
var disconnectButton = document.getElementById('desconectar_bluetooth');
var deviceCache = null;
let characteristicCache = null;

// Conect
connectButton.addEventListener('click', e => {
  console.log('Activaste el bluetooth!!');
  e.waitUntil(new Promise(connect()));
  // Sincronizar con arduino
});

// Desconectar de arduino
disconnectButton.addEventListener('click', e => {
  console.log('Desconectar el bluetooth!!');
  e.waitUntil(new Promise(disconnect()));
  // Desconectar de arduino
});

// Launch Bluetooth device chooser and connect to the selected
function connect() {
  return (deviceCache ? Promise.resolve(deviceCache) : requestBluetoothDevice())
      .then(device => connectDeviceAndCacheCharacteristic(device))
      .then(characteristic => startNotifications(characteristic))
      .catch(error => console.log(error));
}

// Disconnect from the connected device
function disconnect() {
  title = 'Desconectando';
  if (deviceCache) {
    descripcion = 'Desconectando device de Cachee "' + deviceCache.name +
        '" bluetooth device...';
    notificationWarning(title, descripcion);
    deviceCache.removeEventListener(
        'gattserverdisconnected', handleDisconnection);

    if (deviceCache.gatt.connected) {
      deviceCache.gatt.disconnect();
      descripcion =
          '"' + deviceCache.name + '" dispositivo Bluetooth desconectado!!"';
      notificationWarning(title, descripcion);
    } else {
      description = '"' + deviceCache.name +
          '" El dispositivo ya se encuentra desconectado';
      notificationWarning(title, descripcion);
    }
  }

  if (characteristicCache) {
    characteristicCache.removeEventListener(
        'characteristicvaluechanged', handleCharacteristicValueChanged);
    characteristicCache = null;
  }

  deviceCache = null;
}

function requestBluetoothDevice() {
  // Busca a partir de la API -> navigator.bluetooth.requestDevice
  // el disopsitivo con service 0xFFE0 identificacion unica
  console.log('Requesting bluetooth device...');

  return navigator.bluetooth
      .requestDevice({
        filters: [{services: [0xFFE0]}],
      })
      .then(device => {
        console.log('"' + device.name + '" bluetooth device selected');
        deviceCache = device;
        deviceCache.addEventListener(
            'gattserverdisconnected', handleDisconnection);
        return deviceCache;
      });
}

// Reconexion al mismo dispositivo anterior
function handleDisconnection(event) {
  let device = event.target;

  console.log(
      '"' + device.name +
      '" bluetooth device disconnected, trying to reconnect...');

  connectDeviceAndCacheCharacteristic(device)
      .then(characteristic => startNotifications(characteristic))
      .catch(error => console.log(error));
}

// Conexión al dispositivo Bluetooth
function connectDeviceAndCacheCharacteristic(device) {
  if (device.gatt.connected && characteristicCache) {
    return Promise.resolve(characteristicCache);
  }

  console.log('Connecting to GATT server...');

  return device.gatt.connect()
      .then(server => {
        console.log('GATT server connected, getting service...');
        return server.getPrimaryService(0xFFE0);
      })
      .then(service => {
        console.log('Service found, getting characteristic...');
        return service.getCharacteristic(0xFFE1);
      })
      .then(characteristic => {
        console.log('Characteristic found');
        characteristicCache = characteristic;
        return characteristicCache;
      });
}

// Enable the characteristic changes notification
/**Funcion para realizar notificado - sincronizado los dispositivos */
function startNotifications(characteristic) {
  console.log('Starting notifications...');
  return characteristic.startNotifications().then(() => {
    title = 'Bluetooth - Conectado';
    description = 'Conectado con Fabiotto';
    notificationSucces(title, description);
    characteristic.addEventListener(
        'characteristicvaluechanged', handleCharacteristicValueChanged);
  });
}


// Data receiving
function handleCharacteristicValueChanged(event) {
  let value = new TextDecoder().decode(event.target.value);
  console.log(value);
}
