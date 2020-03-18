/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  FlatList,
} from 'react-native';

import {Header, Colors} from 'react-native/Libraries/NewAppScreen';

import RNCaptureTraffic from 'react-native-capture-traffic';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isVpnStarted: false,
      urls: [],
    };
  }

  componentDidMount() {
    RNCaptureTraffic.setCertificate(
      'TestCertficate',
      'password',
      'Test Certficate',
      'Test Certficate',
      'Test Certficate',
      'Test Certficate',
      'Test Certficate',
    );

    RNCaptureTraffic.vpnStarted(() => {
      console.log('VPN Started');
    });
    RNCaptureTraffic.vpnStopped(() => {
      console.log('VPN Stopped');
    });

    RNCaptureTraffic.shouldIntercept(request => {
      return Promise.resolve(true);
      // return Promise.resolve(request.host !== '10.0.2.2:8081');
    });

    RNCaptureTraffic.onRequestHeaders(request => {
      this.setState({urls: [...this.state.urls, request.url]});
      return Promise.resolve(request);
    });
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <Header />

          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Button
                onPress={() => {
                  RNCaptureTraffic.installCertificate()
                    .then(isInstalled => {
                      console.log(isInstalled);
                    })
                    .catch(error => {
                      console.log(error);
                    });
                }}
                title="Install Certificate"
              />
            </View>
            <View style={styles.sectionContainer} />
            <Button
              onPress={() => {
                RNCaptureTraffic.isActive()
                  .then(isStarted => {
                    this.setState({isVpnStarted: !isStarted});
                    if (!isStarted) {
                      RNCaptureTraffic.startVpn();
                    } else {
                      RNCaptureTraffic.stopVpn();
                    }
                  })
                  .catch(error => {
                    console.log(error);
                  });
              }}
              title={this.state.isVpnStarted ? 'Stop VPN' : 'Start VPN'}
            />
            <View style={styles.sectionContainer} />
            <Button
              onPress={() => {
                RNCaptureTraffic.removeAllListeners();
              }}
              title="Remove All Listners"
            />
            <FlatList
              data={this.state.urls}
              keyExtractor={(item, index) => String(index)}
              renderItem={({item}) => <Text>{item}</Text>}
            />
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
