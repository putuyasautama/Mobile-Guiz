import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  Dimensions,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import {  List, ListItem,Thumbnail, Card, CardItem ,Container, Footer, FooterTab, Header, Content, Form, Item, Input, Label, Text, Button, Icon, Tab, Tabs, TabHeading, Left, Body, Right, Title } from 'native-base';
import Login from './Login';
import SignUp from './SignUp';
import Homes from './Homes';
import SignUpGuide from './SignUpGuide';
import guide from './guide';
export default class MobileProject extends Component {
  static navigationOptions = {
    header : null
  };

  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    return(
      <View style={{height:"100%", width:"100%"}}>
        <Login navigation = {navigation}/>
      </View>
    );
  }
}

const guiz = StackNavigator({
  Login : {screen : Login},
  Homes : {screen : Homes},
  SignUp : {screen : SignUp},
  SignUpGuide : {screen : SignUpGuide},
  guide : {screen : guide}
});

AppRegistry.registerComponent('MobileProject', () => guiz);
