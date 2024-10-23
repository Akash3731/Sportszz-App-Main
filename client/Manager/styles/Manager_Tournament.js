import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    marginLeft: 16,
    marginTop: 20,
    textAlign: "center",
  },
  containers: {
    marginLeft: 16,
    marginTop: 30,
    padding: 16,
    textAlign: "center",
  },
  Btndata: {
    flexDirection: "row",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 100,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 14,
    color: "#007AFF",
    padding: 10,
  },
  historyText: {
    marginTop: 18,
    marginBottom: 18,
    fontSize: 20,
    color: "#000",
  },
  containers: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  status: {
    fontSize: 11,
    color: "#6e6e6e",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 10,
    borderRadius: 8,
  },
  teamItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 10,
    borderRadius: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  description: {
    fontSize: 14,
    color: "#6e6e6e",
  },
  addButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingVertical: 5,
    width: 70,
    flexDirection: "row",
    paddingLeft: 7,
    textAlign: "center",
  },
  addedButton: {
    flexDirection: "row",
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007AFF",
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addedText: {
    color: "#007AFF",
  },
  icon: {
    color: "#007AFF",
    marginLeft: 10,
  },
});

export default styles;
