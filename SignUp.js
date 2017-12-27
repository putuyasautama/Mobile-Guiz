import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  Dimensions,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import {  Container, Header, Content, Form, Item, Input, Label, Text, Button, Icon } from 'native-base';
import * as firebase from 'firebase';
var{width,height}=Dimensions.get('window');
export default class SignUp extends Component {
  constructor(props){
    super(props);
    this.state =({
      username : '',
      password : '',
      email : '',
      fullName : '',
      no_HP : '',
      status : 'user'
    });
  }

signUp=()=>{
  if (this.state.email == '' || this.state.password == '' ||  this.state.no_HP == '' ||  this.state.username == '' ||  this.state.fullName == '' ) {
    alert("isi data");
  }
  else{
    firebase.auth().createUserWithEmailAndPassword(this.state.email,this.state.password).then(() => {
      var userId = firebase.auth().currentUser.uid;
      this.writeToDatabase(userId);
    }).catch((error) => {
        alert("error " + error.message );
    });
  }
}

writeToDatabase = (userId) => {
  var database = firebase.database().ref("users").child(userId);
  database.set({
    userId : userId,
    email : this.state.email,
    username :this.state.username,
    fullName : this.state.fullName,
    no_HP : this.state.no_HP,
    password : this.state.password,
    status : this.state.status
  }).then((snapshot)=>{
     firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
      const { navigate } = this.props.navigation;
      navigate('Homes');
      }).catch((error) => {
          alert("error " + error.message );
      });
  });
}

  static navigationOptions = {
    header : null
  };
  
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Content>
          <Image
            source={require('./login.jpg')} style={{height:height, width:width}}
          >
            <Item style={{height:30, width:300, alignSelf:'center', marginTop:"20%"}}>
                <Input style={{fontSize:12, color:'#000'}} placeholder="Name" onChangeText={(fullName)=>this.setState({fullName})}/>
              </Item>
              <Item style={{height:30, width:300, alignSelf:'center', marginTop:20}}>
                <Input style={{fontSize:12}} placeholder="User Name" onChangeText={(username)=>this.setState({username})}/>
              </Item>
              <Item style={{height:30, width:300, alignSelf:'center', marginTop:20}}>
                <Input style={{fontSize:12}} placeholder="Password" onChangeText={(password)=>this.setState({password})}/>
              </Item>
              <Item style={{height:30, width:300, alignSelf:'center', marginTop:20}}>
                <Input style={{fontSize:12}} placeholder="No. HP" onChangeText={(no_HP)=>this.setState({no_HP})}/>
              </Item>
              <Item style={{height:30, width:300, alignSelf:'center', marginTop:20  }}>
                <Input style={{fontSize:12}} placeholder="Email" onChangeText={(email)=>this.setState({email})}/>
              </Item>
              <Button block style={{height:30, width:300, alignSelf:'center', marginTop:20, backgroundColor:"#00BFFF"}}
              onPress={()=>this.signUp()}>
                <Text>Daftar</Text>
              </Button>
          </Image>
        </Content>  
      </Container>
    );
  }
}

AppRegistry.registerComponent('MobileProject', () => MobileProject);
