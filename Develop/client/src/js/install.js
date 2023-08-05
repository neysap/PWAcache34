const butInstall = document.getElementById('buttonInstall');

// Logic for installing the PWA
// TODO: Add an event handler to the `beforeinstallprompt` event
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  butInstall.style.display = 'block'; // Show install button
});
// TODO: Implement a click event handler on the `butInstall` element
butInstall.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the prompt
      const choiceResult = await deferredPrompt.userChoice; // Wait for user's response
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted installation');
      } else {
        console.log('User dismissed installation');
      }
      deferredPrompt = null;
      butInstall.style.display = 'none'; // Hide install button
    }
  });

// TODO: Add an handler for the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
    console.log('App was installed');
  });