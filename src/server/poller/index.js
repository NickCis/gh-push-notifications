import firebase from '../firebase';
import { Tokens } from '../firebase/collections';
import checkNotifications from './checkNotifications';

async function process(doc) {
  const { gh, device, since } = doc.data();
  const notifications = await checkNotifications(gh, since);

  if (notifications.data.length) {
    // send notifications
    await Promise.all(
      notifications.data.map(notification =>
        firebase
          .messaging()
          .send({
            data: {
              title: notification.subject.title,
              icon: 'push-icon.png',
              body: `${notification.subject.type} in ${notification.repository.full_name}`,
              click_action: 'nada',
              // click_action:  notification.subject.latest_comment_url || notification.subject.url,
            },
            token: device
          })
      )
    );

    // Store notifications.headers.date
    await doc._ref.update({ since: notifications.headers.date });
  }
}

async function poller() {
  const snapshot = await firebase
    .firestore()
    .collection(Tokens)
    .get();

  for (let doc of snapshot.docs) {
    try {
      await process(doc);
    } catch (e) {
      console.error(`Process doc: ${doc.id} failed`, e);
      await doc._ref.delete();
    }
  }
}

async function poll() {
  try {
    await poller();
  } catch(e) {
    console.error('Poller Error', e);
  }

  setTimeout(poll, 5 * 60000);
}

poll();
