
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TransactionScreen from './Screens/TransactionScreen';
import SearchScreen from './Screens/SearchScreen'; 
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from "react-navigation-tabs";

export default class App extends React.Component {
  render(){
  return  <TabContainer />
}

}
var TabNavigator = createBottomTabNavigator({
  TransactionScreen:TransactionScreen,
  SearchScreen:SearchScreen,
});

const TabContainer = createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
