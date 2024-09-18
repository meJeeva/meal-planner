import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import moment from 'moment';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {BottomModal, SlideAnimation, ModalContent} from 'react-native-modals';

const HomeScreen = () => {
  const [date, setDate] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [menuData, setMenuData] = useState([]);
  const [modalVisible, setModalVisible] = useState(true);
  const [modal, setModal] = useState(true);

  const navigation = useNavigation();
  const currentDate = moment();
  const startOfWeek = currentDate.clone().startOf('week');

  useEffect(() => {
    fetchAllMenuData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAllMenuData();
    }, []),
  );

  const fetchAllMenuData = async () => {
    try {
      const response = await fetch('http://192.168.29.23:3000/menu/all', {
        method: 'get',
      }).then(response => response.json());
      setMenuData(response);
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = date => {
    setDate(date.format('ddd') + ' ' + date.format('DD'));
    const nextDate = moment(date, 'ddd DD').add(1, 'day').format('ddd DD');
    setNextDate(nextDate);
    setModalVisible(!modalVisible);
  };

  const copyItems = async () => {
    const formattedPrevDate = date;
    const formattedNextDate = nextDate;

    let req = {
      prevDate: formattedPrevDate,
      nextDate: formattedNextDate,
    };

    const response = await fetch('http://192.168.29.23:3000/copyItems', {
      method: 'post',
      body: JSON.stringify(req),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('response', response);
    setModalVisible(false);
    if (response.status === 200) {
      fetchAllMenuData();
      ToastAndroid.showWithGravity(
        'Success, Items copied!!!!!!!',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    } else {
      ToastAndroid.showWithGravity(
        'Error, Items not copied!!!!!!!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  const deleteItems = date => {
    setModal(!modal);
    setSelectedDate(date.format('ddd') + ' ' + date.format('DD'));
  };

  const deleteItemsByDate = async () => {
    try {
      const dateToDelete = selectedDate;
      const response = await fetch(
        `http://192.168.29.23:3000/deleteItems/${dateToDelete}`,
        {
          method: 'delete',
        },
      );

      if (response.status === 200) {
        setModal(false);
        fetchAllMenuData();
      } else {
        console.log('falied to delete the items');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderWeekDates = startOfWeek => {
    let weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = startOfWeek.clone().add(i, 'days');
      const formattedDate = date.format('ddd DD');

      const menuForDate = menuData.find(item => item.date === formattedDate);

      const isCurrentDate = date.isSame(currentDate, 'day');

      weekDates.push(
        <View
          style={{
            flexDirection: 'row',
            gap: 12,
            marginVertical: 10,
          }}>
          <View
            style={[
              {
                height: 40,
                width: 40,
                borderRadius: 20,
                marginVertical: 10,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
              },
              isCurrentDate && {backgroundColor: 'black'},
            ]}>
            <Text
              style={{
                color: isCurrentDate ? 'white' : 'black',
              }}>
              {date.format('DD')}
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: '500',
                color: isCurrentDate ? 'white' : 'black',
              }}>
              {date.format('ddd')}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              navigation.navigate('Menu', {
                date: date.format('ddd') + ' ' + date.format('DD'),
                items: menuForDate?.items,
              });
            }}
            style={[
              {
                backgroundColor: 'white',
                borderRadius: 8,
                padding: 10,
                width: '85%',
              },
              menuForDate && {height: 'auto'},
              !menuData && {
                height: 80,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '600',
                fontSize: 12,
                color: menuForDate ? '#fd5c63' : 'grey',
              }}>
              {menuForDate ? 'Meal Plan' : 'There is no menu'}
            </Text>

            {/* breakfast */}
            {menuForDate && (
              <View>
                {menuForDate?.items.some(
                  item => item.mealType === 'Breakfast',
                ) && (
                  <View>
                    <View
                      style={{
                        backgroundColor: '#E0E0E0',
                        paddingHorizontal: 12,
                        paddingVertical: 3,
                        marginVertical: 5,
                        width: 100,
                        borderRadius: 20,
                      }}>
                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 13,
                          textAlign: 'center',
                        }}>
                        Breakfast
                      </Text>
                    </View>
                    {menuForDate?.items
                      .filter(item => item.mealType === 'Breakfast')
                      .map((item, i) => (
                        <View
                          key={i}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 12,
                            marginVertical: 4,
                          }}>
                          <View
                            style={{
                              backgroundColor: '#fd5c63',
                              paddingHorizontal: 7,
                              paddingVertical: 4,
                              borderRadius: 20,
                            }}>
                            <Text
                              style={{
                                fontSize: 11,
                                textAlign: 'center',
                                color: 'white',
                              }}>
                              {item?.type}
                            </Text>
                          </View>

                          <Text
                            style={{
                              fontWeight: '500',
                            }}>
                            {item?.name}
                          </Text>
                        </View>
                      ))}
                  </View>
                )}
              </View>
            )}

            {/* lunch */}
            {menuForDate && (
              <View>
                {menuForDate?.items.some(item => item.mealType === 'Lunch') && (
                  <View>
                    <View
                      style={{
                        backgroundColor: '#E0E0E0',
                        paddingHorizontal: 12,
                        paddingVertical: 3,
                        marginVertical: 5,
                        width: 100,
                        borderRadius: 20,
                      }}>
                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 13,
                          textAlign: 'center',
                        }}>
                        Lunch
                      </Text>
                    </View>
                    {menuForDate?.items
                      .filter(item => item.mealType === 'Lunch')
                      .map((item, i) => (
                        <View
                          key={i}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 12,
                            marginVertical: 4,
                          }}>
                          <View
                            style={{
                              backgroundColor: '#fd5c63',
                              paddingHorizontal: 7,
                              paddingVertical: 4,
                              borderRadius: 20,
                            }}>
                            <Text
                              style={{
                                fontSize: 11,
                                textAlign: 'center',
                                color: 'white',
                              }}>
                              {item?.type}
                            </Text>
                          </View>

                          <Text
                            style={{
                              fontWeight: '500',
                            }}>
                            {item?.name}
                          </Text>
                        </View>
                      ))}
                  </View>
                )}
              </View>
            )}

            {/* dinner */}
            {menuForDate && (
              <View>
                {menuForDate?.items.some(
                  item => item.mealType === 'Dinner',
                ) && (
                  <View>
                    <View
                      style={{
                        backgroundColor: '#E0E0E0',
                        paddingHorizontal: 12,
                        paddingVertical: 3,
                        marginVertical: 5,
                        width: 100,
                        borderRadius: 20,
                      }}>
                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 13,
                          textAlign: 'center',
                        }}>
                        Dinner
                      </Text>
                    </View>
                    {menuForDate?.items
                      .filter(item => item.mealType === 'Dinner')
                      .map((item, i) => (
                        <View
                          key={i}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 12,
                            marginVertical: 4,
                          }}>
                          <View
                            style={{
                              backgroundColor: '#fd5c63',
                              paddingHorizontal: 7,
                              paddingVertical: 4,
                              borderRadius: 20,
                            }}>
                            <Text
                              style={{
                                fontSize: 11,
                                textAlign: 'center',
                                color: 'white',
                              }}>
                              {item?.type}
                            </Text>
                          </View>

                          <Text
                            style={{
                              fontWeight: '500',
                            }}>
                            {item?.name}
                          </Text>
                        </View>
                      ))}
                  </View>
                )}
              </View>
            )}

            <TouchableOpacity
              onPress={() => openModal(date)}
              style={{
                position: 'absolute',
                bottom: 5,
                right: 40,
              }}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '500',
                  color: 'gray',
                }}>
                Copy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => deleteItems(date)}
              style={{
                position: 'absolute',
                bottom: 5,
                right: 10,
              }}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '500',
                  color: 'gray',
                }}>
                Del
              </Text>
            </TouchableOpacity>
          </Pressable>
        </View>,
      );
    }

    return weekDates;
  };

  const renderWeeks = numWeeks => {
    let weeks = [];
    for (let i = 0; i < numWeeks; i++) {
      weeks.push(
        <View style={{}}>
          <Text>
            {startOfWeek
              .clone()
              .add(i * 7, 'days')
              .format('DD MMM')}
          </Text>
          <View style={{}}>
            {renderWeekDates(startOfWeek.clone().add(i * 7, 'days'))}
          </View>
        </View>,
      );
    }
    return weeks;
  };

  return (
    <>
      <ScrollView
        style={{
          marginTop: 50,
        }}>
        <View
          style={{
            flex: 1,
            padding: 12,
          }}>
          {renderWeeks(3)}
        </View>
      </ScrollView>

      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={['up', 'down']}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: 'bottom',
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}>
        <ModalContent>
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                textAlign: 'center',
              }}>
              Copy or Move
            </Text>

            <View
              style={{
                backgroundColor: '#fd5c63',
                padding: 10,
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 12,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                {date} - {nextDate}
              </Text>
            </View>

            <View
              style={{
                marginTop: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Pressable
                onPress={copyItems}
                style={{
                  backgroundColor: '#DB7093',
                  width: 100,
                  padding: 10,
                  borderRadius: 20,
                  marginVertical: 12,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  Copy
                </Text>
              </Pressable>
              <Pressable
                style={{
                  backgroundColor: '#DB7093',
                  width: 100,
                  padding: 10,
                  borderRadius: 20,
                  marginVertical: 12,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  Move
                </Text>
              </Pressable>
            </View>
          </View>
        </ModalContent>
      </BottomModal>

      <BottomModal
        onBackdropPress={() => setModal(!modal)}
        swipeDirection={['up', 'down']}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: 'bottom',
          })
        }
        onHardwareBackPress={() => setModal(!modal)}
        visible={modal}
        onTouchOutside={() => setModal(!modal)}>
        <ModalContent
          style={{
            width: '100%',
            height: 280,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              textAlign: 'center',
            }}>
            Delete Menu
          </Text>

          <View>
            <Pressable
              onPress={deleteItemsByDate}
              style={{
                backgroundColor: '#DB7093',
                width: 140,
                padding: 10,
                borderRadius: 20,
                marginVertical: 12,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                Delete Menu
              </Text>
            </Pressable>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
