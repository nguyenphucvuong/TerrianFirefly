import React, { useEffect, useState, useContext, createContext } from 'react'

import * as tf from '@tensorflow/tfjs';
import { fetch, bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as jpeg from 'jpeg-js';
import * as nsfwjs from 'nsfwjs';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';


export const ImageCheckContext = createContext();
export const ImageProvider = ({ children }) => {
  const [tfReady, setTfReady] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [image, setImage] = useState(null);
  const [model, setModel] = useState(null);
  const [lastVisiblePost, setLastVisiblePost] = useState(null);



  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      setTfReady(true);
      const loadedModel = await nsfwjs.load(
        "https://nguyenphucvuong.github.io/models/mobilenet_v2/model.json"
      );
      // console.log(loadedModel)
      setModel(loadedModel);
      // console.log(model);
      setModelReady(true);
    };
    loadModel();
  }, []);

  const classifyImage = async (imageUri) => {
    // console.log("uri", imageUri);
    // console.log("uri2", imageUri.uri);

    if (!imageUri || !imageUri.uri) {
      console.error("No image URI available");
      return;
    }

    try {
      console.log("Fetching image from URI:", imageUri.uri);

      const rawImageData = await FileSystem.readAsStringAsync(imageUri.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const imageBuffer = Uint8Array.from(atob(rawImageData), c => c.charCodeAt(0));
      const jpegData = jpeg.decode(imageBuffer, true);
      const imageTensor = imageToTensor(jpegData);

      const predictionsReuslt = await model.classify(imageTensor);
      setPredictions(predictionsReuslt);
      console.log("Predictions:", predictions);
    } catch (error) {
      console.error("Error classifying image:", error);
    }
  };

  const imageToTensor = (rawImageData) => {
    const { width, height, data } = rawImageData;
    const buffer = new Uint8Array(width * height * 3);
    let offset = 0;

    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]; // Red
      buffer[i + 1] = data[offset + 1]; // Green
      buffer[i + 2] = data[offset + 2]; // Blue
      offset += 4;
    }
    return tf.tensor3d(buffer, [height, width, 3]);
  };

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // Cho phép chọn nhiều ảnh
      allowsEditing: false,  // Tắt chế độ chỉnh sửa ảnh
      quality: 1,            // Giữ nguyên chất lượng ảnh
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      console.log("Selected Image URI:", selectedImageUri);

      // Cập nhật state cho hình ảnh
      setImage({ uri: selectedImageUri });
      console.log("ádasdasd", { uri: selectedImageUri })
      setPredictions(null);
      classifyImage({ uri: selectedImageUri });

    } else {
      console.log("Image selection was canceled or no assets found.");
    }
  };

  return (
    <ImageCheckContext.Provider value={{ image, setImage, predictions, setPredictions, selectImage, modelReady, lastVisiblePost, setLastVisiblePost, classifyImage }}>
      {children}
    </ImageCheckContext.Provider>
  );
};
