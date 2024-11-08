import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { appInfo } from "../constains/appInfo";
import { useNavigation } from "@react-navigation/native";
import {
  getEvent,
  fetchEvents,
  deleteEventFromFirestore,
} from "../redux/slices/EventSlice"; // Đảm bảo đường dẫn đúng
import { Swipeable } from "react-native-gesture-handler";
import Entypo from "react-native-vector-icons/Entypo";
export default function EventManagementScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Lấy dữ liệu sự kiện từ Redux Store
  const events = useSelector((state) => state.event.events);
  const statusEvent = useSelector((state) => state.event.statusEvent);
  const errorEvent = useSelector((state) => state.event.errorEvent);

  // Gọi hàm getEvent để lấy dữ liệu khi màn hình được render lần đầu
  useEffect(() => {
    const unsubscribe = dispatch(fetchEvents()); 
    return () => unsubscribe(); // Cleanup
  }, [dispatch]);

  // Hàm định dạng số lượng
  const formatCount = (count) => {
    //định dạng nếu đạt >= 1tr lượt tương tác
    if (count >= 1000000) {
      const millions = Math.floor(count / 1000000);
      const remainder = Math.floor((count % 1000000) / 100000);
      return `${millions}Tr${remainder > 0 ? remainder : ""}`;
    } else if (count >= 1000) {
      const thousands = Math.floor(count / 1000);
      const remainder = Math.floor((count % 1000) / 100);
      return `${thousands}N${remainder > 0 ? remainder : ""}`;
    }
    return count.toString();
  };

  // Điều hướng tới màn hình Add/Edit Event
  const goToAddEditEvent = (eventData) => {
    navigation.navigate("AddEditEventScreen", { dataEvent: eventData });
  };

  if (statusEvent === "loading") {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (statusEvent === "failed") {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {errorEvent}</Text>
      </View>
    );
  }

  //xóa
  const handleDeleteEvent = async (event_id) => {
    try {
      await dispatch(deleteEventFromFirestore(event_id)); // Xóa Event từ Firestore
    } catch (error) {
      console.error("Error deleting Event:", error);
    } 
  };

  // rightSwipe xóa sự kiện
  const rightSwipe = (id) => {
    // console.log('id', id);
    
    return (
      <TouchableOpacity
        style={{ alignSelf: "center" }}
        onPress={() => handleDeleteEvent(id)}
      >
        <Image
          source={require("../../assets/appIcons/dell_icon.png")}
          style={styles.icon}
        />
      </TouchableOpacity>
    );
  };
  // Hàm rút gọn content
  const truncateContent = (content) => {
    return content.length > 50 ? content.substring(0, 50) + "..." : content;
  };

  // Hàm kiểm tra trạng thái sự kiện và đặt màu nền phù hợp
  const getStatusStyle = (endDate) => {
    const today = new Date();
    if (new Date(endDate) < today) {
      return { backgroundColor: "gray", text: "Đã kết thúc" };
    } else {
      return { backgroundColor: "#009688", text: "Đang tiến hành" }; // Màu xanh ngọc
    }
  };
  return (
    <View style={styles.container}>
      {/* Danh sách sự kiện */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const status = getStatusStyle(item.end_date);
          return (
            <Swipeable renderRightActions={() => rightSwipe(item.event_id)}>
              <TouchableOpacity onPress={() => goToAddEditEvent(item)}>
                <View style={styles.eventCard}>
                  <Image
                    source={{ uri: item.img_event }}
                    style={styles.eventImage}
                  />
                  <View style={styles.eventDetails}>
                    <Text style={styles.eventTitle}>{item.title}</Text>
                    <Text style={styles.eventContent}>
                      {truncateContent(item.content)}
                    </Text>
                    <Text style={styles.eventDate}>
                      {new Date(item.start_date).toLocaleDateString("vi-VN")} -{" "}
                      {new Date(item.end_date).toLocaleDateString("vi-VN")}
                    </Text>
                    <View style={styles.eventStats}>
                      <Text style={{ marginRight: 20 }}>
                        👍 {item.count_like}
                      </Text>
                      <Text>👁️ {item.count_view}</Text>
                    </View>
                  </View>
                  {/* Thêm trạng thái sự kiện ở góc dưới bên phải */}
                  <View
                    style={[
                      styles.eventStatusContainer,
                      { backgroundColor: status.backgroundColor },
                    ]}
                  >
                    <Text style={styles.eventStatusText}>{status.text}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Swipeable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    position: "relative",
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  eventContent: {
    color: "#555",
    marginVertical: 4,
  },
  eventDate: {
    color: "#999",
    fontSize: 12,
  },
  eventStats: {
    flexDirection: "row",
    marginTop: 8,
  },
  eventStatusContainer: {
    position: "absolute",
    bottom: 8, // Đặt trạng thái ở góc dưới bên phải
    right: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  eventStatusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  icon: {
    resizeMode: "cover",
    height: appInfo.heightWindows * 0.065,
    width: appInfo.heightWindows * 0.065,
    marginRight: appInfo.widthWindows * 0.03,
  },
});
