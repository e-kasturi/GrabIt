const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    backgroundColor: "#f39c12",
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerLeft: {
    flexDirection: "column", // Stack profile info vertically
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileTextContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  userEmail: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconButton: {
    marginLeft: 15,
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 10,
    borderRadius: 50,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // For Android shadow
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2c3e50",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  itemText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#34495e",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    marginHorizontal: 15,
    marginVertical: 20,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
