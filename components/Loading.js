import { View, Text } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

const LoadingImage = require("../assets/images/Loading.json");

export default function Loading({ size }) {
  return (
    <View style={{ height: size, aspectRatio: 1 }}>
      <LottieView style={{ flex: 1 }} source={LoadingImage} autoPlay loop />
    </View>
  );
}
