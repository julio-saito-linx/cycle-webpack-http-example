import Firebase from 'firebase';
import Rx from 'rx';


function FirebaseDriver(uri) {
  return () => Rx.Observable.create((observer) => {
    const _ref = new Firebase(uri);
    _ref.once('child_added', (s1) => {
      // tweet
      console.log(`subscribed to ${s1.key()}`);
      s1.ref().on('child_added', (s2) => {
        // tweet/Terms
        console.log(`subscribed to ${s2.key()}`);
        s2.ref().on('child_added', (s3) => {
          // tweet/Terms/_id
          observer.onNext(s3.val());
        }, (err) => {
          observer.onError(err);
        });
      }, (err) => {
        observer.onError(err);
      });
    }, (err) => {
      observer.onError(err);
    });
  });
}

export default FirebaseDriver;
