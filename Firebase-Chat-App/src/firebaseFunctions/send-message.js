import * as firebase from 'firebase'

async function sendMessage(userId, friendId, text) {
    try{
        await firebase.firestore().collection('messages').doc().set({
            key: Date.now().toString(),
            message: text,
            time: new Date(),
            timestamp: Date.now(),
            sender: userId,
            sentTo: friendId
        })
    } catch(e) {
        return null
    }

    return {
        message: text,
        time: new Date(),
        timestamp: Date.now(),
        sender: userId,
        sentTo: friendId
    }
}

async function addListener(userId, friendId, cb) {
    
    await firebase.firestore().collection('messages').where("sender", "==", friendId).where("sentTo", "==", userId).onSnapshot(async function(querySnapshot) {
        await querySnapshot.docChanges().forEach(function(change) {
           if(change.type === 'added') {
                cb(change.doc.data())
           }
        })
    });

    await firebase.firestore().collection('messages').where("sender", "==", userId).where("sentTo", "==", friendId).onSnapshot(async function (querySnapshot) {
        await querySnapshot.docChanges().forEach(function (change) {
            if (change.type === 'added') {
                cb(change.doc.data())
            }
        })
    });
}

export  {sendMessage, addListener};