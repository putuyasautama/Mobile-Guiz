import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  Dimensions,
  ListView, 
  View
} from 'react-native';
import * as firebase from 'firebase';
import {  List, ListItem,Thumbnail, Card, CardItem ,Container, Footer, FooterTab, Header, Content, Form, Item, Input, Label, Text, Button, Icon, Tab, Tabs, TabHeading, Left, Body, Right, Title } from 'native-base';
var{width,height}=Dimensions.get('window');
export default class guide extends Component {
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
      guideId : '',
      Deskripsi : '',
      temp : [],
      dataSource: new ListView.DataSource({rowHasChanged : (row1, row2)=> row1 !== row2}),
      dataSource1: new ListView.DataSource({rowHasChanged : (row1, row2)=> row1 !== row2}),
    });
    this.items = [];
    this.items1 = [];
  }

  writeToDatabase = () => {
    var database = firebase.database().ref("paket");
    database.push({
      guideId : this.state.userId,
      Deskripsi : this.state.Deskripsi,
      guideNama : this.state.fullName
    }).catch((error) => {
      alert("error " + error.message );
    });
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

    var data = firebase.database().ref('paket/');
    data.on('child_added',(snapshot) => {
      this.items.push({
        paketId : snapshot.key,
        deskripsi : snapshot.val().Deskripsi
      });
      this.setState({
        dataSource : this.state.dataSource.cloneWithRows(this.items)
      });
    });

    var data = firebase.database().ref('paket/');
    data.on('child_removed',(snapshot) => {
      this.items = this.items.filter((x)=>x.paketId !== snapshot.key);
      this.setState({
        dataSource : this.state.dataSource.cloneWithRows(this.items)
      });
    });

    var guideId = firebase.auth().currentUser.uid;
    var data1 = firebase.database().ref('transaksi/'+guideId+'');
    data1.on('child_added',(snapshot) => {
      this.items1.push({
        listId : snapshot.key,
        userNama : snapshot.val().userNama,
        userId : snapshot.val().userId,
        deskripsi : snapshot.val().Deskripsi,
        date : snapshot.val().date
      });
      this.setState({
        dataSource1 : this.state.dataSource1.cloneWithRows(this.items1)
      });
    });

    var data = firebase.database().ref('transaksi/'+guideId+'');
    data.on('child_removed',(snapshot) => {
      this.items1 = this.items1.filter((x)=>x.listId !== snapshot.key);
      this.setState({
        dataSource1 : this.state.dataSource1.cloneWithRows(this.items1)
      });
    });
  }

  deleteList=(paketId)=>{
    var database = firebase.database().ref("paket/"+paketId);
    database.remove();
    alert("Berhasil dihapus");
  }

  tolak=(guideId, listId, userId, Deskripsi)=>{
    var database = firebase.database().ref("transaksi/"+guideId+"/"+listId+"");
    database.update({
      status : 2
    });
    var database = firebase.database().ref("status/"+userId);
    database.push({
      status : 2,
      Deskripsi : Deskripsi
    }).catch((error) => {
      alert("error " + error.message );
    });
    alert("Berhasil Ditolak");
  }

  ambil=(guideId,listId, userId, Deskripsi)=>{
    var database = firebase.database().ref("transaksi/"+guideId+"/"+listId+"");
    database.update({
      status : 1
    });
    var database = firebase.database().ref("status/"+userId);
    database.push({
      status : 1,
      Deskripsi : Deskripsi
    }).catch((error) => {
      alert("error " + error.message );
    });
    alert("Berhasil Diambil");
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Content style={{width : '100%', height : '100%'}}>
        <View style={{backgroundColor:'#133977', height:50, width:"100%", alignItems:'center'}}>
          <Text style={{color: 'white', marginTop:8}}>GUIZ</Text>
        </View>
        <Tabs>
          <Tab heading={ <TabHeading><Icon name="paper-plane" /></TabHeading>} tabStyle={{backgroundColor: '#133977'}} textStyle={{color: '#fff'}} activeTabStyle={{backgroundColor: '#6a9ae8'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
            <ListView 
              dataSource={this.state.dataSource1} 
              renderRow={(rowData1) =>
              <View style={{marginTop : 3, height : 50, marginLeft : 5}}>  
                <View>
                  <Button
                  onPress={()=>this.ambil(this.state.userId, rowData1.listId, rowData1.userId, rowData1.deskripsi)}
                  style={{height: 20, backgroundColor: 'blue'}}>
                    <Text style={{fontSize:8, color:'white'}}>ambil</Text>
                  </Button>
                  <Button 
                  onPress={()=>this.tolak(this.state.userId, rowData1.listId, rowData1.userId, rowData1.deskripsi)}
                  style={{height: 20, backgroundColor:'red', marginTop:5}}>
                    <Text style={{fontSize:8, color:'white'}}>tolak</Text>
                  </Button>
                </View>
                <View style={{width : width-55, height : 80,position : 'absolute', left : 65}}>
                  <Text>{rowData1.userNama}</Text>
                  <Text style={{fontSize: 10}}>{rowData1.deskripsi}</Text>
                  <Text style={{fontSize: 8}}>{rowData1.date}</Text>
                </View>
              </View>
              }
            />
          </Tab>
          <Tab heading={ <TabHeading><Icon name="camera" /></TabHeading>} tabStyle={{backgroundColor: '#133977'}} textStyle={{color: '#fff'}} activeTabStyle={{backgroundColor: '#6a9ae8'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
            <View style={{alignItems:'center', height: '100%'}}>
              <Text style={{marginTop:"20%"}}>
                <Icon name="camera" style={{color:'#2f2f2f'}}/>
              </Text>
              <Item style={{height:30, width:300, alignSelf:'center', marginTop:20}}>
                <Input style={{fontSize:12}} placeholder="Deskripsi" onChangeText={(Deskripsi)=>this.setState({Deskripsi})}/>
              </Item>
              <Button block 
              onPress={()=>this.writeToDatabase()}
              style={{height:30, width:300, alignSelf:'center', marginTop:20, backgroundColor:"#00BFFF"}}>
                <Text>Buat</Text>
              </Button>
            </View>
          </Tab>
          <Tab heading={ <TabHeading><Icon name="glasses" /></TabHeading>} tabStyle={{backgroundColor: '#133977'}} textStyle={{color: '#fff'}} activeTabStyle={{backgroundColor: '#6a9ae8'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
            <ListView 
              dataSource={this.state.dataSource} 
              renderRow={(rowData) =>
              <View style={{marginTop : 5}}>  
                <View>
                  <Thumbnail square size={80} source={require('./login.jpg')} />
                </View>
                <View style={{width : width-55, height : 50,position : 'absolute', left : 65}}>
                  <Text>{rowData.deskripsi}</Text>
                  <Button transparent 
                  onPress={()=>this.deleteList(rowData.paketId)}
                  style={{height: 30}}>
                    <Text style={{fontSize:10, color:'red'}}>hapus</Text>
                  </Button>
                </View>
              </View>
              }
            />
          </Tab>
          <Tab heading={ <TabHeading><Icon name="settings" /></TabHeading>} tabStyle={{backgroundColor: '#133977'}} textStyle={{color: '#fff'}} activeTabStyle={{backgroundColor: '#6a9ae8'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
            <View style={{alignItems:'center'}}>
              <Image source={require('./login.jpg')} style={{height:200, width: "100%", flex:1, alignItems:'center'}}>
              <Thumbnail large source={require('./login.jpg')} style={{marginTop:50}}/>
              <Item>
                <Text style={{marginTop:5, alignItems:'center'}}>{this.state.fullName}</Text>
              </Item>
              </Image>
            </View>
            <List>
              <ListItem>
                <Text style={{marginTop:5, alignItems:'center'}}>Email : {this.state.email}</Text>
              </ListItem>
              <ListItem>
                <Text style={{marginTop:5, alignItems:'center'}}>No. Hp : {this.state.no_HP}</Text>
              </ListItem>
              <ListItem onPress={()=>navigate('Login')}>
                <Text style={{marginTop:5, alignItems:'center'}}>Log Out</Text>
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
