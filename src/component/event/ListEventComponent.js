import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";

const ListEventComponent = ({ isNew, events, onRefresh }) => {
  const navigation = useNavigation();

  const handlePressOnEvent = (eventId) => {
    navigation.navigate("DetailEventScreen", { eventId });
  };
  const limitText = (text, charLimit) => {
    if (text.length > charLimit) {
      return text.slice(0, charLimit) + "...";
    }
    return text;
  };

  let eventSortToCreateAt = events;
  if (!isNew) {
    eventSortToCreateAt = [...events].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }
  else {
    eventSortToCreateAt = [...events]
      .filter((e) => {
        // Lấy thời gian tạo sự kiện và thời gian hiện tại
        const eventDate = new Date(e.created_at); // Lấy thời gian sự kiện
        const now = new Date(); // Lấy thời gian hiện tại
  
        // So sánh ngày, tháng, năm giữa thời gian hiện tại và thời gian tạo sự kiện
        return (
          eventDate.getFullYear() === now.getFullYear() &&
          eventDate.getMonth() === now.getMonth() &&
          eventDate.getDate() === now.getDate()
        );
      })
      .sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at) // Sắp xếp từ mới nhất
      );
  }
  

  return (
    <ScrollView
      style={isNew ? styles.containerNew : styles.container}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} /> // Gọi hàm onRefresh khi vuốt xuống
      }
    >
      {eventSortToCreateAt.map((event) => (
        <TouchableOpacity
          onPress={() => handlePressOnEvent(event.event_id)}
          activeOpacity={1}
          key={event.event_id}
          style={styles.eventItem}
        >
          <Image source={{ uri: event.img_event }} style={styles.eventImage} />
          <View style={styles.eventDetails}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text
              style={{
                marginTop: 10,
              }}
            >
              {limitText(event.content, 100)}
            </Text>
            <View style={styles.viewRow}>
              <Text style={styles.eventDate}>
                {format(new Date(event.created_at), "dd-MM-yyyy")}
              </Text>
              <TouchableOpacity onPress={handlePressOnEvent}>
                <Text style={styles.eventLink}>Nhấn để tiếp tục {"➤"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f5fb",
    marginBottom: "12%",
  },
  containerNew: {
    flex: 1,
    backgroundColor: "#f6f5fb",

  },
  linkText: {
    color: "#007BFF",
  },
  eventItem: {
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  eventImage: {
    width: "100%",
    height: 180,
  },
  eventDetails: {
    padding: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventDescription: {
    marginVertical: 5,
    color: "#888",
  },
  viewRow: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventDate: {
    color: "#888",
  },
  eventLink: {
    color: "#7487ee",
    fontWeight: "bold",
     textAlign: 'right',
    fontSize: 14,
  },
});

export default ListEventComponent;
