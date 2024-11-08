import { StatusBar } from 'expo-status-bar';
import { Button, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState, useEffect } from "react";
import { Audio } from 'expo-av';
import Header from './src/components/Header';
import Time from './src/components/Time';


const colors = ["#F7DC6F", "#A2D9CE", "#D7BDE2"]

export default function App() {

  const [isWorking, setIsWorking] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [currentTime, setCurrentTime] = useState("POMO" | "SHORT" | "BREAK");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {

    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime(time - 1)
      }, 1000)
    } else {
      clearImmediate(interval)
    }

    if (time === 0) {
      setIsActive(false)
      setIsWorking(prev => !prev)
      setTime(isWorking ? 300 : 1500)
    }

    return () => clearInterval(interval)
  }, [isActive, time]);

  function handleStartStop() {
    playSound()
    setIsActive(!isActive)
  }

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/ticking-clock_1-27477.mp3")
    )
    await sound.playAsync();
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors[currentTime] }]}>
      <View style={{
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: Platform.OS === "android" && 30,

      }}>
        <Text style={styles.text}>Pomodoro </Text>
        <Text style={styles.text}>{time} </Text>
        <Header
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          setTime={setTime}
        />

        <Time
          time={time}
        />
        <TouchableOpacity onPress={handleStartStop} style={styles.butto}>
          <Text style={{ color: "white", fontWeight: 'bold' }}>{isActive ? "STOP" : "START"}</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 32,
    fontWeight: "bould"
  },
  butto: {
    alignItems: "center",
    backgroundColor: "#333333",
    padding: 15,
    marginTop: 15,

    borderRadius: 20
  }

});
