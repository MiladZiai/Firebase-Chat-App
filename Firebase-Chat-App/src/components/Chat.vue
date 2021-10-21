<template>
    <view> 
      <view class="user">
        <image :source="require('../../assets/user-male.png')" class="profile-pic"/>
        <text class="text-bold">{{ userName }}</text>
      </view> 

      <view class="message-view">
        <text-input v-model="text" class="message-box" placeholder="Type Message" />
        <touchable-opacity :on-press="() => sendMessage()" :disabled="(text == '')">
          <view  class="button-view">
            <text class="color-white">Send</text>
          </view>
        </touchable-opacity>  
      </view>

      <scroll-view :content-container-style="{contentContainer: { flex:1 }}">
        <flat-list :data='messages' :render-item="(message) => renderMessage(message)"></flat-list>
      </scroll-view>
    </view>
</template>

<script>
import React from 'react'
import { Text, View, Dimensions } from 'react-native';
import { sendMessage, addListener } from '../firebaseFunctions/send-message';
import { getUserName } from '../firebaseFunctions/user-auth';

export default {
    data:function() {
        return {
            text:'',
            messages:[],
            userName:'',
            date:''
        }
    },
    props:{
        userId:{
            Type:String
        },
        friendId:{
            Type:String
        },
        signedIn:{
            Type:String
        },
        goBack:{
            Type:Function
        },
        signOut:{
            Type:Function
        }
    },
    mounted: async function() {
      this.userName = await getUserName(this.friendId);
      addListener(this.userId, this.friendId, (messages) => {
        this.messages.push(messages);
      });

    },
    methods:{
      renderMessage: function(message) {
        return(
          <View  key={message.item.key}>
            <View 
              style={{
                flexDirection: message.item.sender == this.userId ? 'row-reverse':'row'
              }}>
            </View>

            <View 
              style={{
                flexDirection: message.item.sender == this.userId ? 'row-reverse':'row'
              }}>
              <View style={{
                backgroundColor:'white',
                width:Dimensions.get('screen').width/2,
                borderRadius:10,
                padding:10,
                margin:5
              }}>
                <Text style={{ fontSize:15 }}>{message.item.message}</Text>
                {message.item.time && <Text style={{ fontSize:10}}>
                {message.item.time.toDate().toLocaleTimeString('en-SV')}</Text>}
              </View>
            </View>
            
          </View>
        )
      },
      sendMessage: async function() {
        await sendMessage(this.userId, this.friendId, this.text);
        this.text = '';
      },
    }
}
</script>

<style scoped>
.message-box {
  background-color: white;
  padding:10;
  border-radius: 10;
  width:300
}
.username {
  position:absolute;
  left:100;
  top:50
}
.text-bold {
  font-size:35;
  font-weight:bold;
  color:#840c24;
}
.text-regular {
  font-weight:bold;
  color:white
}
.user {
  align-items: center;
  justify-content: center
}
.chat {
  flex:1;
  position:relative
}
.scroll {
  flex:0.6
}
.profile-pic {
    width:60;
    height:60;
    padding:20
}
.flex-1 {
  flex:1
}
.message-view {
  flex-direction:row;
  justify-content: space-evenly;
  align-items: center
}
.button-view {
    padding:10;
    background-color: #840c24;;
    align-items: center;
    text-align:center;
    border-radius:10;
    margin:5
}
.color-white {
  color:white
}
.logout {
  position:absolute;
  left:0;
  bottom:0;
  right:0
}
.bf {
  background-color: #5c5c3d
}
</style>