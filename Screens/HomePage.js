import React, { useEffect, useState } from 'react';
import { View, Text, Image, SafeAreaView, StyleSheet, Linking, Button } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

function HomePage() {
  const [permissions, setPermissions] = useState(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedImages, setSavedImages] = useState(new Set());
  const [actionTaken, setActionTaken] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setPermissions(status === 'granted');
      if (status === 'granted') {
        loadImages();
      }
    };
    requestPermissions();
  }, []);

  const loadImages = async () => {
    const album = await MediaLibrary.getAssetsAsync({
      mediaType: 'photo',
      first: 100,
    });
    const assets = await Promise.all(album.assets.map(async (asset) => {
      const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
      return { ...asset, uri: assetInfo.localUri || asset.uri };
    }));
    setImages(assets);
  };

  const moveToNextImage = () => {
    let nextIndex = currentIndex + 1;
    while (nextIndex < images.length && savedImages.has(images[nextIndex].id)) {
      nextIndex++;
    }
    if (nextIndex < images.length) {
      setCurrentIndex(nextIndex);
      setActionTaken(false);
    } else {
      alert("No more images to display.");
    }
  };

  const handleKeepImage = () => {
    if (!actionTaken) {
      setSavedImages((prev) => new Set(prev).add(images[currentIndex].id));
      setActionTaken(true);
      setTimeout(moveToNextImage, 1000);
    }
  };

  const handleDeleteImage = async () => {
    if (!actionTaken && !deleting) {
      setDeleting(true);
      try {
        await MediaLibrary.deleteAssetsAsync([images[currentIndex].id]);
        setTimeout(moveToNextImage, 1000);
      } catch (error) {
        console.error("Error deleting image:", error);
      } finally {
        setDeleting(false);
        setActionTaken(true);
      }
    }
  };

  const onGestureEvent = (event) => {
    const { translationX } = event.nativeEvent;
    if (!actionTaken) {
      if (translationX > 50) {
        handleKeepImage();
      } else if (translationX < -50) {
        handleDeleteImage();
      }
    }
  };

  const openSettings = () => {
    Linking.openURL('app-settings:');
  };

  if (permissions === null) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text>Requesting permissions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permissions) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text>Photo permissions required to continue.</Text>
          <Text style={styles.infoText}>
            Please enable media library permissions in Settings to delete photos without repeated prompts.
          </Text>
          <Button title="Open Settings" onPress={openSettings} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.safeArea}>
      <View style={styles.container}>
        {images[currentIndex] ? (
          <PanGestureHandler onGestureEvent={onGestureEvent}>
            <Image source={{ uri: images[currentIndex].uri }} style={styles.image} />
          </PanGestureHandler>
        ) : (
          <Text>No more images to display.</Text>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    padding: 10,
    textAlign: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
});

export default HomePage;
