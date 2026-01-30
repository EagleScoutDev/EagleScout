import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    input: {
        textAlign: "left",
        padding: "5%",
        borderRadius: 10,
        borderBottomWidth: 1,
        borderColor: "gray",
        // margin: 10,
        // marginHorizontal: 30,
        color: "white",
    },
    titleText: {
        textAlign: "left",
        padding: "5%",
        fontSize: 30,
        fontWeight: "bold",
        color: "rgb(191, 219, 247)",
        // marginVertical: 20,
    },
    button: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        color: "red",
    },
    link_container: {
        flexDirection: "row",
        padding: "4%",
        borderRadius: 20,
    },
    background: {
        flexDirection: "column",
        backgroundColor: "rgb(0,0,25)",
        flex: 1,
    },
    error: {
        backgroundColor: "red",
        padding: "5%",
        margin: "3%",
        borderRadius: 10,
        position: "absolute",
        top: "5%",
        right: "5%",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        zIndex: 1,
    },
    error_text: {
        color: "white",
        textAlign: "center",
    },
    label: {
        color: "gray",
        fontWeight: "bold",
        fontSize: 12,
        paddingTop: 10,
    },
    text: {
        color: "gray",
    },
});
