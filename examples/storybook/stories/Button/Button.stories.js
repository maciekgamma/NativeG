import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";

import CenterView from "../CenterView";
import { ThemingProvider } from "../ThemingContext";

import { Button } from "nativeg";

storiesOf("Button", module)
  .addDecorator((getStory) => (
    <ThemingProvider>
      <CenterView>{getStory()}</CenterView>
    </ThemingProvider>
  ))
  .add("with text", () => (
    <Button onPress={action("clicked-text")} text={"Hello world"} />
  ))
  .add("outlined", () => <Button text={"Hello world"} outline />)
  .add("rounded", () => <Button text={"Hello world"} rounded />);
