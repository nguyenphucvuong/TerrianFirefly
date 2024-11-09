import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { updateEventByField } from "../redux/slices/EventSlice";
import { useDispatch, useSelector } from "react-redux";

const InteractionBarComponent = ({ event }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  // Cập nhật trạng thái khi sự kiện hoặc người dùng thay đổi
  useEffect(() => {
    const user_like = event.user_like.includes(user.user_id);
    const user_dislike = event.user_dislike.includes(user.user_id);

    setIsLiked(user_like);
    setIsDisliked(user_dislike);
  }, [event, user.user_id]);

  const handleLike = () => {
    if (isLiked) {
      // Hủy like
      setIsLiked(false);
      dispatch(
        updateEventByField({
          eventID: event.event_id,
          field: "user_like",
          value: event.user_like.filter((u) => u !== user.user_id),
        })
      );
      dispatch(
        updateEventByField({
          eventID: event.event_id,
          field: "count_like",
          value: event.count_like - 1,
        })
      );
    } else {
      // Thêm like
      setIsLiked(true);
      dispatch(
        updateEventByField({
          eventID: event.event_id,
          field: "user_like",
          value: [...event.user_like, user.user_id],
        })
      );
      dispatch(
        updateEventByField({
          eventID: event.event_id,
          field: "count_like",
          value: event.count_like + 1,
        })
      );

      // Hủy dislike nếu đã chọn
      if (isDisliked) {
        setIsDisliked(false);
        dispatch(
          updateEventByField({
            eventID: event.event_id,
            field: "user_dislike",
            value: event.user_dislike.filter((u) => u !== user.user_id),
          })
        );
      }
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      // Hủy dislike
      setIsDisliked(false);
      dispatch(
        updateEventByField({
          eventID: event.event_id,
          field: "user_dislike",
          value: event.user_dislike.filter((u) => u !== user.user_id),
        })
      );
    } else {
      // Thêm dislike
      setIsDisliked(true);
      dispatch(
        updateEventByField({
          eventID: event.event_id,
          field: "user_dislike",
          value: [...event.user_dislike, user.user_id],
        })
      );

      // Hủy like nếu đã chọn
      if (isLiked) {
        setIsLiked(false);
        dispatch(
          updateEventByField({
            eventID: event.event_id,
            field: "user_like",
            value: event.user_like.filter((u) => u !== user.user_id),
          })
        );
        dispatch(
          updateEventByField({
            eventID: event.event_id,
            field: "count_like",
            value: event.count_like - 1,
          })
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLike} style={styles.button}>
        <Icon name="thumbs-up" size={24} color={isLiked ? "#697BEB" : "#888"} />
        <Text style={styles.text}>{event.count_like}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDislike} style={styles.button}>
        <Icon
          name="thumbs-down"
          size={24}
          color={isDisliked ? "#697BEB" : "#888"}
        />
        <Text style={styles.text}>{event.count_dislike}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  button: {
    alignItems: "center",
  },
  text: {
    marginTop: 4,
    fontSize: 14,
    color: "#333",
  },
});

export default InteractionBarComponent;
