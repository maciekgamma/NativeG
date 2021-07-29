import { storiesOf } from "@storybook/react-native";
import React from "react";
import { View } from "react-native";

import CenterView from "../CenterView";
import { ThemingProvider } from "../ThemingContext";

import { TextInput } from "nativeg";

storiesOf("Text Input", module)
  .addDecorator((getStory) => (
    <ThemingProvider>
      <CenterView>
        <View style={{ width: "90%" }}>{getStory()}</View>
      </CenterView>
    </ThemingProvider>
  ))
  .add("basic", () => <TextInput />)
  .add("rounded", () => <TextInput rounded />)
  .add("text align", () => <TextInput textAlign={"left"} />)
  .add("default value", () => <TextInput defaultValue={"myValue"} />)
  .add("secure text entry", () => <TextInput secureTextEntry />)
  .add("keyboard type", () => <TextInput keyboardType={"phone-pad"} />);
