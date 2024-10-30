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

const ListEventComponent = ({ events, onRefresh }) => {
  const navigation = useNavigation();

  const handlePressOnEvent = () => {
    navigation.navigate("DetailEventScreen");
  };
  const limitText = (text, charLimit) => {
    if (text.length > charLimit) {
      return text.slice(0, charLimit) + "...";
    }
    return text;
  };
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} /> // Gọi hàm onRefresh khi vuốt xuống
      }
    >
      {events.map((event) => (
        <TouchableOpacity
          onPress={handlePressOnEvent}
          activeOpacity={1}
          key={event.event_id}
          style={styles.eventItem}
        >
          <Image source={{ uri: event.url_game }} style={styles.eventImage} />
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
  },
  eventDate: {
    color: "#888",
  },
  eventLink: {
    color: "#7487ee",
    fontWeight: "bold",
    marginLeft: "51%",
    fontSize: 14,
  },
});

export default ListEventComponent;
