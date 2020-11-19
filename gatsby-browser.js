require('./src/global.scss')

export function onServiceWorkerUpdateReady(){
  window.location.reload();
}