import firebase from 'firebase';

const firebaseConfig = {
	apiKey: 'AIzaSyB-iMhXwPpDL3MI0Te4GkG8542WFZCtfvU',
	authDomain: 'quiz-pwa-17bd9.firebaseapp.com',
	projectId: 'quiz-pwa-17bd9',
	storageBucket: 'quiz-pwa-17bd9.appspot.com',
	messagingSenderId: '843297762641',
	appId: '1:843297762641:web:1325e7625ee5446e537770'
};
firebase.initializeApp(firebaseConfig);

export function initNotification() {
	return Notification.requestPermission();
}
