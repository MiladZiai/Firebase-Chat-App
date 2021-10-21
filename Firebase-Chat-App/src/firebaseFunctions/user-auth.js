import * as firebase from 'firebase'
import { LogBox } from 'react-native';

async function register(email, password, name) {
    try {
        const registered = await firebase.auth().createUserWithEmailAndPassword(email, password);
        if (registered) {
           await addUser(registered, name);
           return registered.user;
        }
        else {
            return null;
        }
    } catch (e) {
        return null;
    }
}

async function signIn(email,password) {
    try {
        const signedIn = await firebase.auth().signInWithEmailAndPassword(email, password);
        if (signedIn) {
            return signedIn.user;
        }
    } catch (e) {
        return {
            errorMessage:e.message
        }
    }
}

async function addUser(userObject, name) {
    firebase.firestore().collection('users').doc(name).set({ 
        uid:userObject.user.uid,
        name:name,
        email:userObject.user.email
    }).then(res => console.log(res))
    .catch(e => console.log(e));
}

async function getUsers(userId) {
    var users = [];
    firebase.firestore().collection('users').get().then(function(querySnapshot) {
        querySnapshot.forEach(function (doc) {
            if(doc.data().uid != userId)
                users.push(doc.data());
        })
    }).then(res=>console.log(res)).catch(err=>console.log(err));
    return users;
}

async function getUserName(userId) {
    var that = this;
    await firebase.firestore().collection('users').where("uid","==",userId).get().then(function(querySnapshot){
        querySnapshot.forEach(function (doc) {
           that.user = doc.data().name
        })
    })
    return that.user;
}

export {register, signIn, getUsers, getUserName}