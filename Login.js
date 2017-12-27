import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  Dimensions,
  View
} from 'react-native';
import * as firebase from 'firebase';
import { StackNavigator } from 'react-navigation';
import {  Container, Header, Content, Form, Item, Input, Label, Text, Button } from 'native-base';
var{width,height}=Dimensions.get('window');

var config = {
    apiKey: "AIzaSyDzq3zGUEWxo_x9pV-tadWrbKV05C-QAAc",
    authDomain: "guiz-353b8.firebaseapp.com",
    databaseURL: "https://guiz-353b8.firebaseio.com",
    projectId: "guiz-353b8",
    storageBucket: "guiz-353b8.appspot.com",
    messagingSenderId: "10554514695"
  };
const firebaseApp = firebase.initializeApp(config);

export default class Login extends Component {
  static navigationOptions = {
    header : null
  };

  constructor (props){
    super(props);
    this.state = {
      username : '',
      Password : '',
      status : ''
    }
  }

  login = ()=>{
    const { navigate } = this.props.navigation;
    if(this.state.username == ''||this.state.Password == ''){
      alert("isi jon");
    }
    else{
      firebaseApp.auth().signInWithEmailAndPassword(this.state.username, this.state.Password).then(()=>{
        var userId = firebase.auth().currentUser.uid;
        var database = firebase.database().ref('users/'+userId);
        database.on('value',(snapshot) => {
            this.setState({
              status : snapshot.val().status
            });
        });
        if(this.state.status == 'user'){
          navigate('Homes');
          alert("berhasil jon");
        }
        else if(this.state.status == 'guide'){
          navigate('guide');
          alert("berhasil jon");
        }
      }).catch((error)=>{
        alert(error);
      });  
    }
  }
  render() {    
    const { navigate } = this.props.navigation;

    return (
      <Container>
        <Content>
          <Image
            source={require('./login.jpg')} style={{height:height, width:width}}
          >
            <View style={{backgroundColor:'#f9f9f9', height:250, width:300, alignSelf:'center', marginTop:"50%"}}>
              <Item regular style={{height:30, width:200, alignSelf:'center', marginTop:"10%", backgroundColor:"#FFFFFf"}}>
                <Input style={{fontSize:12, textAlign:'center'}} placeholder="User Name" onChangeText={(username)=>this.setState({username})} />
              </Item>
              <Item regular style={{height:30, width:200, alignSelf:'center', marginTop:7, backgroundColor:"#FFFFFf"}}>
                <Input style={{fontSize:12, textAlign:'center'}} secureTextEntry={true} placeholder="Password" onChangeText={(Password)=>this.setState({Password})}/>
              </Item>
              <Button block 
              onPress={()=>this.login()}
              style={{height:30, width:200, alignSelf:'center', marginTop:7, backgroundColor:"#00BFFF"}}>
                <Text>Login</Text>
              </Button>
              <Text style={{fontSize:12, textAlign:'center', marginTop:8}}>or</Text>
              <Button block
              onPress={()=>navigate('SignUp')} 
              style={{height:30, width:200, alignSelf:'center', marginTop:7, backgroundColor:"#FA8072"}}>
                <Text>Sign Up User</Text>
              </Button>
              <Button block
              onPress={()=>navigate('SignUpGuide')} 
              style={{height:30, width:200, alignSelf:'center', marginTop:7, backgroundColor:"#FA8065"}}>
                <Text>Sign Up Guide</Text>
              </Button>
            </View>
          </Image>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('MobileProject', () => MobileProject);
