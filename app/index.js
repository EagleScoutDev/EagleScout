import { AppRegistry } from "react-native";
import { name as appName } from "./app.json" with { type: "json" };
import App from "./src/App";

AppRegistry.registerComponent(appName, () => App);
