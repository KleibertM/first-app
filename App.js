import { StyleSheet, Text, View,  SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import Header from './src/components/Header';
import Timer from './src/components/Timer';
import {Audio} from 'expo-av'

const colors = ["#F7DC6F", "#A2D9CE", "#D7BDE2"]

export default function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [currentTime, setCurrentTime] = useState("POMO" | "SHORT" | "BREACK");
  const [isActive, setIsActive] = useState(false);
  const [soundObject, setSoundObject] = useState(null);

  useEffect(()=>{
    let interval = null;

    if (isActive) {
      interval = setInterval(()=>{
        setTime(time - 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    if ( time === 0) {
      setIsActive(false)
      setIsRunning(prev => !prev)
      setTime(isRunning ? 300 : 1500)
    }
    return () => clearInterval(interval);
  }, [isActive, time])



  const handleStartStop = async ()=>{
    setIsActive(!isActive)

    if (!isActive) {
      const { sound } = await playSound();
      setSoundObject(sound);
    } else {
      if (soundObject) {
        await soundObject.pauseAsync();
      }
    }
  }

  async function playSound () {
    const {sound} = await Audio.Sound.createAsync(require('./assets/Audio/longBreak.mp3'))
    await sound.playAsync();
    return { sound };
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors[currentTime]}]}>
    <View style={{
      flex: 1,
      paddingHorizontal: 15, 
      paddingTop: Platform.OS === "android" && 10}}>
      <Text  style={styles.text}>worKing app</Text>
      <Header 
      setTime={setTime} 
      currentTime={currentTime} 
      setCurrentTime={setCurrentTime} />
      <Timer time={time}/>
      <TouchableOpacity style={styles.button} onPress={handleStartStop}>
      <Text style={{color: "white", fontWeight: "bold"}} > {isActive ? "STOP" : "START"} </Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  text:{
    fontSize: 32,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#333",
    marginTop: 15,
    padding: 15,
    alignItems: "center",
    borderRadius: 15

  }
});
