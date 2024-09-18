import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import StackNavigator from './navigation/StackNavigator';
import {ModalPortal} from 'react-native-modals';

const App = () => {
  return (
    <>
      <StackNavigator />
      <ModalPortal />
    </>
  );
};

export default App;

const styles = StyleSheet.create({});
