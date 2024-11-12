import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { format } from "date-fns";
import TextWithLinks from '../../utils/TextWithLink';
import InteractionBarEventComponent from '../InteractionBarEventComponent '; 

const DetailEventComponent = ({ event }) => {
  if (!event) {
    return <Text>Loading...</Text>;
  }else{
    return (
      <>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{event.title}</Text>
        <View>
          <Text style={styles.userId}>Người đăng: {event.user_id}</Text>
        </View>
        <View style={styles.viewDate}>
          <Text style={styles.date}>
            {format(new Date(event.start_date), "dd/MM")} -{" "}
            {format(new Date(event.end_date), "dd/MM")}
          </Text>
        </View>
        <Image source={{ uri: event.img_event }} style={styles.image} />
        <TextWithLinks style={styles.content} content={event.content} />
        
        {/* Thêm thanh tương tác vào đây */}
      </ScrollView>
        <InteractionBarEventComponent event={event}/></>
      
    );
  }

  
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  userId: {
    fontSize: 14,
    color: "#6a6a6a",
    marginBottom: 4,
  },
  date: {
    textAlign: "center",
    textAlignVertical: "center",
    padding: 5,
    fontWeight: "bold",
  },
  viewDate: {
    backgroundColor: "#c3e7c1",
    padding: 4,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "flex-start",
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
