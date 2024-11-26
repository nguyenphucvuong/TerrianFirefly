import React, { Component, useEffect } from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { format,formatDistanceToNow  } from "date-fns";
import { vi } from "date-fns/locale"; // Sử dụng locale tiếng Việt nếu cần
import TextWithLinks from '../../utils/TextWithLink';
import InteractionBarEventComponent from '../InteractionBarEventComponent '; 
import { useDispatch, useSelector } from "react-redux";
import { getUserEvent } from "../../redux/slices/UserSlices";

const DetailEventComponent = ({ event }) => {
  const dispatch = useDispatch();
  const { userEvent } = useSelector((state) => state.user);

  useEffect(() => {
    const unsubscribe = getUserEvent(event.user_id)(dispatch);
    return () => unsubscribe();
  }, [dispatch, event.user_id]);

  if (!event || !userEvent) {
    return <Text>Loading...</Text>;
  } else {
    return (
      <>
        <ScrollView style={styles.container}>
          

          {/* Hiển thị thông tin sự kiện */}
          <Text style={styles.title}>{event.title}</Text>
          {/* Hiển thị thông tin người đăng */}
          <View style={styles.userInfoContainer}>
            <Image
              source={{ uri: userEvent.imgUser }}
              style={styles.userImage}
            />
            <View>
              <Text style={styles.username}>{userEvent.username}</Text>
              <Text style={styles.timePosted}>
                {formatDistanceToNow(new Date(event.created_at), {
                  addSuffix: true,
                  locale: vi,
                })}
              </Text>
            </View>
          </View>
          <View style={styles.viewDate}>
            <Text style={styles.date}>
              {format(new Date(event.start_date), "dd/MM")} -{" "}
              {format(new Date(event.end_date), "dd/MM")}
            </Text>
          </View>
          <Image source={{ uri: event.img_event }} style={styles.image} />
          <TextWithLinks style={styles.content} content={event.content} />
        </ScrollView>

        {/* Thanh tương tác */}
        <InteractionBarEventComponent event={event} />
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 8,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timePosted: {
    fontSize: 12,
    color: "#6a6a6a",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  viewDate: {
    backgroundColor: "#c3e7c1",
    padding: 4,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  date: {
    textAlign: "center",
    textAlignVertical: "center",
    padding: 5,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  content: {
    fontSize: 20,
    lineHeight: 24,
  },
});
export default DetailEventComponent;
