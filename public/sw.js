self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    console.log(event.data.json(),123);
    const title = data.title || 'Notification';
    const url = data.data.url;

    const options = {
      body: data.body || 'You have a new notification!',
      icon: data.icon || '/icon.png',
      badge: data.icon || '/badge.png',
      data: { url: url || 'https://app.complex360.in' } // Ensure a default valid URL
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Handle notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    // Use the URL stored in the notification's `data` property
    const notificationData = event.notification.data;
    console.log('notificationData: ', notificationData);

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === notificationData.url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(notificationData.url);
            }
        })
    );
});