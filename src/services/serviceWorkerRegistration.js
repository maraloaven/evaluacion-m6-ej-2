export function register() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        const swUrl = '/service-worker.js';
  
        navigator.serviceWorker
          .register(swUrl)
          .then(registration => {
            console.log('Service Worker registrado con éxito:', registration);
            
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker == null) {
                return;
              }
              
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('Nuevo contenido disponible');
                  } else {
                    console.log('El contenido se ha almacenado en caché.');
                  }
                }
              };
            };
          })
          .catch(error => {
            console.error('Error durante el registro del Service Worker:', error);
          });
      });
    }
  }

  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(registration => {
          registration.unregister();
        })
        .catch(error => {
          console.error(error.message);
        });
    }
  }
  
  export function update() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(registration => {
          registration.update();
        })
        .catch(error => {
          console.error('Error al actualizar el Service Worker:', error);
        });
    }
  }
  
  export function sendMessageToSW(message) {
    return new Promise((resolve, reject) => {
      if (!navigator.serviceWorker.controller) {
        reject(new Error('No hay un Service Worker activo.'));
        return;
      }
  
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = event => {
        if (event.data.error) {
          reject(event.data.error);
        } else {
          resolve(event.data);
        }
      };
  
      navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
    });
  }