import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  Dimensions,
  View,
  ListView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal
} from 'react-native';
import * as firebase from 'firebase';
import DatePicker from 'react-native-datepicker';
import { StackNavigator } from 'react-navigation';
import {  List, ListItem,Thumbnail, Card, CardItem ,Container, Footer, FooterTab, Header, Content, Form, Item, Input, Label, Text, Button, Icon, Tab, Tabs, TabHeading, Left, Body, Right, Title } from 'native-base';
var{width,height}=Dimensions.get('window');
export default class Homes extends Component {
  static navigationOptions = {
    header : null
  };

  constructor(props){
    super(props);
    this.state =({
      email :'',
      fullName : '',
      no_HP : '',
      username :'',
      userId : '',
      idGuide : '',
      Desk : '',
      date : '',
      modalVisible : false,
      dataSource: new ListView.DataSource({rowHasChanged : (row1, row2)=> row1 !== row2}),
      dataSource2: new ListView.DataSource({rowHasChanged : (row1, row2)=> row1 !== row2}),
    });
    this.items = [];
    this.items2 = [];
  }

  componentWillMount() {
    var userId = firebase.auth().currentUser.uid;
    var database = firebase.database().ref('users/'+userId);
    database.on('value',(snapshot) => {
        this.setState({
          userId : userId,
          email : snapshot.val().email,
          fullName : snapshot.val().fullName,
          no_HP : snapshot.val().no_HP,
          username : snapshot.val().username
        });
    }); 

    var database = firebase.database().ref('status/'+userId);
    database.on('child_added',(snapshot) => {
      if(snapshot.val().status == 1){
        this.items2.push({
          deskripsi : snapshot.val().Deskripsi,
          status : "Diambil"
        });
        this.setState({
          dataSource2 : this.state.dataSource2.cloneWithRows(this.items2)
        });  
      }
      else if(snapshot.val().status == 2){
        this.items2.push({
          deskripsi : snapshot.val().Deskripsi,
          status : "Ditolak"
        });
        this.setState({
          dataSource2 : this.state.dataSource2.cloneWithRows(this.items2)
        });  
      }
    });

    var data = firebase.database().ref('paket/');
    data.on('child_added',(snapshot) => {
      this.items.push({
        paketId : snapshot.key,
        deskripsi : snapshot.val().Deskripsi,
        guideNama : snapshot.val().guideNama,
        guideId : snapshot.val().guideId
      });
      this.setState({
        dataSource : this.state.dataSource.cloneWithRows(this.items)
      });
    });
  }
  
  pesan = (deskripsi, userNama, guideid, userId, date) => {
    var database = firebase.database().ref("transaksi/"+guideid);
    database.push({
      userNama : userNama,
      Deskripsi : deskripsi,
      status : 0,
      userId : userId,
      date : date
    }).catch((error) => {
      alert("error " + error.message );
    });
    alert("Berhasil dipesan");
    this.setState({
      modalVisible : false
    });
  }

  editProfile = (userId) =>{
    var database = firebase.database().ref("users/"+userId);
    database.update({
      fullName : this.state.fullName,
      no_HP : this.state.no_HP,
      email : this.state.email
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Content>
        <Modal animationType = {"fade"} visible  = {this.state.modalVisible} onRequestClose={()=>console.log("d")} >
          <TouchableWithoutFeedback onPress={()=>this.setState({modalVisible : false})}>
            <View style={{height : height, width : width, backgroundColor : 'white'}}>
              <View>
                <Image style={{marginTop: 10, height:200, width: width-10, alignSelf:'center'}} source={require('./login.jpg')}/>
              </View>
              <View style={{marginTop : 5, width: width-10, alignSelf:'center'}}>
                <Text>{this.state.Desk}</Text>
              </View>
              <DatePicker
                  style={{width: width-10,borderWidth : 1, borderColor : 'grey', borderRadius : 10, marginTop : 10}}
                  date={this.state.date}
                  mode="date"
                  format="DD-MM-YYYY"
                  minDate="01-12-1980"
                  maxDate="01-12-2030"
                  confirmBtnText="Confirm"  
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 10
                    },
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => {this.setState({date: date})}}
              />
              <Button style={{alignSelf:'center'}}
              onPress={()=>this.pesan(this.state.Desk, this.state.fullName, this.state.idGuide, this.state.userId, this.state.date)}>
                <Text>Pesan</Text>
              </Button>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <View style={{backgroundColor:'#133977', height:50, width:"100%", alignItems:'center'}}>
          <Text style={{color: 'white', marginTop:8}}>GUIZ</Text>
        </View>
        <Tabs>
          <Tab heading={ <TabHeading><Icon name="paper-plane" /><Text>Paket</Text></TabHeading>} tabStyle={{backgroundColor: '#133977'}} textStyle={{color: '#fff'}} activeTabStyle={{backgroundColor: '#6a9ae8'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
            <ListView 
              dataSource={this.state.dataSource} 
              renderRow={(rowData) =>
              <TouchableOpacity onPress={()=>this.setState({modalVisible : true, Desk : rowData.deskripsi, idGuide : rowData.guideId})}>
                <View style={{marginTop : 5}}>  
                  <View>
                    <Thumbnail square size={80} source={require('./login.jpg')} />
                  </View>
                  <View style={{width : width-55, height : 50,position : 'absolute', left : 65}}>
                    <Text>{rowData.guideNama}</Text>
                    <Text style={{fontSize : 10}}>{rowData.deskripsi}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              }
            />
          </Tab>
          <Tab heading={ <TabHeading><Icon name="person" /><Text>Profil</Text></TabHeading>} tabStyle={{backgroundColor: '#133977'}} textStyle={{color: '#fff'}} activeTabStyle={{backgroundColor: '#6a9ae8'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
            <View style={{alignItems:'center'}}>
              <View style={{alignItems:'center', height:170, width: "100%", flex:1, backgroundColor:'#133977'}}>
                <TextInput onChangeText={(fullName)=>this.setState({fullName})}
                  underlineColorAndroid = 'transparent'
                  value={this.state.fullName}
                  style={{ alignSelf : 'center',fontSize:12, borderWidth : 1, borderRadius : 8,height: 35, width : width-10, color : 'black', backgroundColor:'white',marginTop:3}}/>
                <TextInput onChangeText={(no_HP)=>this.setState({no_HP})}
                  underlineColorAndroid = 'transparent'
                  value={this.state.no_HP}
                  style={{ alignSelf : 'center',fontSize:12, borderWidth : 1, borderRadius : 8,height: 35, width : width-10, color : 'black', backgroundColor:'white',marginTop:3}}/>
                <TextInput onChangeText={(fullName)=>this.setState({email})}
                  underlineColorAndroid = 'transparent'
                  value={this.state.email}
                  style={{ alignSelf : 'center',fontSize:12, borderWidth : 1, borderRadius : 8,height: 35, width : width-10, color : 'black', backgroundColor:'white',marginTop:3}}/>
                <TouchableOpacity onPress={()=>this.editProfile(this.state.userId)} style={{marginTop : 10, alignSelf : 'center'}}>
                  <View style={{backgroundColor : 'rgb(116, 237, 237)', height : 30, borderRadius : 8}}>
                    <Text style={{zIndex : 1,color : 'white', fontSize : 12, alignSelf : "center", marginTop : 6}}>Save Changes</Text>    
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <ListView 
              dataSource={this.state.dataSource2} 
              renderRow={(rowData2) =>
                <View style={{marginTop : 5}}>
                  <Text>{rowData2.deskripsi}</Text>
                  <Text style={{fontSize : 10}}>{rowData2.status}</Text>
                </View>
              }
            />
          </Tab>
          <Tab heading={ <TabHeading><Icon name="settings" /><Text>Setting</Text></TabHeading>} tabStyle={{backgroundColor: '#133977'}} textStyle={{color: '#fff'}} activeTabStyle={{backgroundColor: '#6a9ae8'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
            <List>
              <ListItem>
                <Text>Tentang Kami</Text>
              </ListItem>
              <ListItem onPress={()=>navigate('Login')}>
                <Text>Log Out</Text>
              </ListItem>
            </List>
          </Tab>
        </Tabs> 
        </Content>
      </Container>
    );
  }
}

AppRegistry.registerComponent('MobileProject', () => MobileProject);
