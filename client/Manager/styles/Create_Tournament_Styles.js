import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F8F8",
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    alignItems: "center",
    paddingTop: 30,
  },
  text: {
    fontSize: 17,
  },
  imageContainer: {
    marginTop: 20,
    marginBottom: 35,
    alignItems: "center",
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    bottom: 5, // Positioning the icons at the bottom
    left: "13%", // Adjust to your desired position
    backgroundColor: "#000", // Semi-transparent background
    borderRadius: 20,
    padding: 5,
    marginLeft: 5,
  },
  image: {
    height: 88,
    width: 88,
    borderRadius: 44,
    backgroundColor: "#D9D9D9",
  },
  form: {
    marginTop: 20,
    width: "100%",
  },
  inputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "space-between",
    marginBottom: 10,
  },
  icon: {
    paddingLeft: 90,
    position: "absolute",
    left: "80%",
  },

  input: {
    height: 50,
    paddingLeft: 20,
    borderRadius: 5,
    fontSize: 16,
    color: "#333", // Input text color
  },
  picker: {
    height: 50, // Match input height
    width: "100%",
  },
  players: {
    width: "100%",
    flexDirection: "row",
    marginTop: 35,

    gap: 60,
    justifyContent: "space-between",
  },
  buttonscontainer: {
    width: "100%",
    flexDirection: "row",
    marginTop: 35,
    justifyContent: "space-between",
  },
  shuffle: {
    marginTop: 15,
    height: 48,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  shufflebtn: {
    fontSize: 16,
  },
  playersrow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  buttonrowrow: {
    flexDirection: "row",
    gap: 13,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 12,
  },

  teamImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D9D9D9",
  },
  teamText: {
    fontSize: 16,
  },
  Court: {
    marginTop: 35,
    marginBottom: 15,
  },
  selectcourt: {
    fontSize: 17,
    textAlign: "left",
    alignItems: "flex-start",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  courtRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  courtButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 10,
    marginBottom: 10,
  },
  courtButtonSelected: {
    backgroundColor: "#1E90FF",
    color: "#fff",
  },
  courtButtonText: {
    color: "#333",
  },
  addCourtButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#ddd",
    height: 40,
  },
  addCourtText: {
    color: "#000",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
  },
  dateButtonSelected: {
    backgroundColor: "#1E90FF",
  },
  dateText: {
    color: "#333",
  },
  timeTabsContainer: {
    flexDirection: "row",
    marginBottom: 10,
    width: "50%",
  },
  timeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  timeTabActive: {
    backgroundColor: "#1E90FF",
  },
  timeTabInactive: {
    backgroundColor: "#E0E0E0",
  },
  timeTabText: {
    color: "#333",
  },
  timeTabTextActive: {
    color: "#FFF",
  },
  timeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  timeButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "25%",
    marginBottom: 10,
    alignItems: "center",
  },
  timeButtonSelected: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#007AFF",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  timeButtonText: {
    color: "#333",
  },
  allDayContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  allDayText: {
    fontSize: 16,
  },
  generateButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#1E90FF",
    alignItems: "center",
    width: "100%",
  },
  generateButtonText: {
    color: "#FFF",
    fontSize: 18,
  },
  selectedButtonText: {
    color: "#fff",
  },
  switchStyle: {
    width: 52,
    height: 32,
  },
  icon: {
    marginRight: 10, // Adds spacing between the icon and the input field
  },
});

export default styles;
