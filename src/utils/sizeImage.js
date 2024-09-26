import * as ImageManipulator from "expo-image-manipulator";

class sizeImage {
    constructor(uri) {
        this.uri = uri;
    }
    async sizeImage() {
    const { width, height } = await ImageManipulator.manipulateAsync(this.uri, [], {
        compress: 0.5,
        format: ImageManipulator.SaveFormat.JPEG,
    });
    return { width, height };
  }
}

export default sizeImage;