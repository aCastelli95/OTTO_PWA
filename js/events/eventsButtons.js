var b1 = document.getElementById('botonX1');
var b2 = document.getElementById('botonX2');
/*var b3 = document.getElementById('botonX3');
var b4 = document.getElementById('botonX4');
var b5 = document.getElementById('botonX5');
var b6 = document.getElementById('botonX6');
var b7 = document.getElementById('botonX7');
var b8 = document.getElementById('botonX8');
var b9 = document.getElementById('botonX9');
var b10 = document.getElementById('botonX10');
* */

var laFunc = function windowsAlertText(event){
  console.log(event);
  window.alert('Tocaste el boton' + event.path[0].id);
  sendCommand(); //send mensaje de device a otto

  // aca tiene que ir cuando esta conectado ya el bluetooth, sino ventana emergente
};

window.onload = function() {
    
  b1.addEventListener("click", laFunc );
  b2.addEventListener("click", laFunc );
  /**b3.addEventListener("click", laFunc );
  b4.addEventListener("click", laFunc );
  b5.addEventListener("click", laFunc );
  b6.addEventListener("click", laFunc );
  b7.addEventListener("click", laFunc );
  b8.addEventListener("click", laFunc );
  b9.addEventListener("click", laFunc );
  b10.addEventListener("click", laFunc );
 */
};

function sendCommand(){
  
}


