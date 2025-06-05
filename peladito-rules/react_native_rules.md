---
title: Best Practices
layout: default
nav_order: 14
---

# React Native Development Standards & Best Practices

## Code Quality & Maintainability

- **Component Structure**

  - Use functional components with hooks as the default approach.
  - Keep components focused on a single responsibility.
  - Break down complex screens into smaller, reusable components.
  - Use PureComponent or React.memo for list items to prevent unnecessary re-renders.

  **Example**:

  ```jsx
  // Good practice - Focused component
  const ProfileHeader = ({ name, avatar }) => (
    <View style={styles.header}>
      <Image source={avatar} style={styles.avatar} />
      <Text style={styles.name}>{name}</Text>
    </View>
  );

  // Avoid - Too many responsibilities
  const Profile = ({ user, posts, followers }) => (
    <ScrollView>
      <View style={styles.header}>
        <Image source={user.avatar} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
      </View>
      <FlatList data={posts} renderItem={/* ... */} />
      <View style={styles.followers}>
        {/* Followers section */}
      </View>
      <View style={styles.settings}>
        {/* Settings section */}
      </View>
    </ScrollView>
  );
  ```

- **Navigation**

  - Use React Navigation as the standard navigation library.
  - Organize navigation into logical stacks (e.g., AuthStack, MainStack).
  - Type navigation parameters using TypeScript for safer navigation.

  **Example**:

  ```tsx
  // Define type-safe navigation
  type RootStackParamList = {
    Home: undefined;
    Profile: { userId: string; username: string };
    Settings: undefined;
  };

  // Type-safe navigation usage
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  // Navigate with type checking
  navigation.navigate('Profile', { 
    userId: '123', 
    username: 'johndoe' 
  });
  ```

- **State Management**

  - Use React Context + useReducer for simple app-wide state.
  - Consider Redux Toolkit or MobX for more complex applications.
  - Use React Query or SWR for remote data fetching and caching.
  - Prefer local component state with useState for component-specific state.

  **Example**:

  ```jsx
  // Local component state
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Remote data with React Query
  const { data, isLoading, error } = useQuery(
    ['user', userId], 
    () => fetchUserData(userId)
  );
  ```

## Styling & Layout

- **Style Organization**

  - Use StyleSheet.create for defining styles.
  - Group related styles together.
  - Consider a theming system for consistent colors, spacing, and typography.
  - Use descriptive names for style properties.

  **Example**:

  ```jsx
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: spacing.medium,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.small,
    },
    title: {
      fontSize: typography.sizes.large,
      fontWeight: typography.weights.bold,
      color: colors.text.primary,
    },
  });
  ```

- **Responsive Design**

  - Use Dimensions API or libraries like react-native-responsive-screen for responsive layouts.
  - Use percentages or flex for responsive sizing where appropriate.
  - Consider different device orientations and screen sizes.
  - Test on multiple devices and screen sizes.

  **Example**:

  ```jsx
  import { Dimensions } from 'react-native';
  
  const { width, height } = Dimensions.get('window');
  
  const styles = StyleSheet.create({
    container: {
      width: width * 0.9, // 90% of screen width
      maxWidth: 500, // Maximum width
    },
    responsiveText: {
      fontSize: width > 600 ? 18 : 14, // Larger text on bigger screens
    },
  });
  ```

- **Platform-Specific Code**

  - Use Platform.OS for platform-specific code.
  - Create platform-specific files (e.g., Component.ios.js, Component.android.js) for larger differences.
  - Consider using platform-specific components from UI libraries.

  **Example**:

  ```jsx
  import { Platform, StyleSheet } from 'react-native';
  
  const styles = StyleSheet.create({
    container: {
      ...Platform.select({
        ios: {
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
  });
  ```

## Performance

- **List Optimization**

  - Use FlatList or SectionList instead of mapping over arrays.
  - Implement proper keyExtractor and use unique keys.
  - Use getItemLayout when possible for fixed-size items.
  - Implement windowing for very large lists.

  **Example**:

  ```jsx
  <FlatList
    data={items}
    renderItem={({ item }) => <ItemComponent item={item} />}
    keyExtractor={item => item.id.toString()}
    getItemLayout={(data, index) => ({
      length: 80, // Item height
      offset: 80 * index,
      index,
    })}
    initialNumToRender={10}
    maxToRenderPerBatch={10}
    windowSize={5}
    onEndReachedThreshold={0.5}
    onEndReached={handleLoadMore}
  />
  ```

- **Image Optimization**

  - Use FastImage for better image loading and caching.
  - Properly resize images before displaying them.
  - Implement lazy loading for images.
  - Use image placeholders while loading.

  **Example**:

  ```jsx
  import FastImage from 'react-native-fast-image';
  
  <FastImage
    style={styles.image}
    source={{
      uri: imageUrl,
      priority: FastImage.priority.normal,
    }}
    resizeMode={FastImage.resizeMode.cover}
  />
  ```

- **Memory Management**

  - Clean up resources in useEffect's return function.
  - Remove event listeners when components unmount.
  - Use useMemo and useCallback to prevent unnecessary recalculations.

  **Example**:

  ```jsx
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', handleOrientationChange);
    
    return () => {
      subscription.remove();
    };
  }, []);
  ```

## Native Features & APIs

- **Native Module Integration**

  - Use react-native-community packages when available.
  - Follow best practices for permissions handling.
  - Test native functionality on actual devices, not just simulators.

  **Example**:

  ```jsx
  import { Camera } from 'expo-camera';
  
  const [hasPermission, setHasPermission] = useState(null);
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  if (hasPermission === null) {
    return <View><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>No access to camera</Text></View>;
  }
  ```

- **Handling Device Features**

  - Consider device capabilities when using hardware features.
  - Provide fallbacks for unsupported features.
  - Handle permissions appropriately and explain why they're needed.

## Testing & Quality Assurance

- **Testing Strategy**

  - Use Jest for unit and integration tests.
  - Use react-native-testing-library for component testing.
  - Implement e2e testing with Detox or Appium for critical flows.
  - Test on both iOS and Android platforms.

  **Example**:

  ```jsx
  import { render, fireEvent } from '@testing-library/react-native';
  
  test('button press increments counter', () => {
    const { getByText } = render(<Counter />);
    
    const button = getByText('Increment');
    const counter = getByText('Count: 0');
    
    fireEvent.press(button);
    
    expect(getByText('Count: 1')).toBeTruthy();
  });
  ```

- **Error Handling**

  - Implement global error boundaries.
  - Use try/catch for async operations.
  - Log errors to an error reporting service.
  - Provide user-friendly error messages.

  **Example**:

  ```jsx
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.getUser(userId);
      setUser(data);
    } catch (error) {
      setError('Unable to load user data. Please try again.');
      logErrorToService(error);
    } finally {
      setLoading(false);
    }
  };
  ```

## Accessibility

- **Screen Reader Support**

  - Use proper accessibilityLabel props for all touchable elements.
  - Group related elements with accessibilityRole.
  - Test with VoiceOver (iOS) and TalkBack (Android).

  **Example**:

  ```jsx
  <TouchableOpacity
    accessibilityLabel="Profile picture"
    accessibilityRole="button"
    accessibilityHint="Opens the full profile picture"
    onPress={handlePress}
  >
    <Image source={profileImage} />
  </TouchableOpacity>
  ```

- **Visual Accessibility**

  - Support dynamic text sizes with Dynamic Type (iOS) and scalable text (Android).
  - Maintain sufficient color contrast (at least 4.5:1 for normal text).
  - Support dark mode for both iOS and Android.

## App Deployment & Updates

- **Code Pushing**

  - Consider using CodePush for deploying JavaScript updates without app store review.
  - Implement proper versioning for CodePush updates.
  - Test CodePush updates thoroughly before deployment.

- **App Bundle Optimization**

  - Use Hermes JavaScript engine.
  - Implement proper app bundle splitting.
  - Remove unused code and dependencies.
  - Monitor bundle size with tools like Metro bundle analyzer.

  **Example**:

  ```jsx
  // In app.json (Expo) or gradle (React Native CLI)
  {
    "android": {
      "jsEngine": "hermes"
    },
    "ios": {
      "jsEngine": "hermes"
    }
  }
  ```

## Project Structure

- **Directory Organization**

  - Organize by feature rather than by type.
  - Keep related files close to each other.
  - Use consistent naming conventions.

  **Example**:

  ```
  /src
    /features
      /auth
        - AuthScreen.tsx
        - LoginForm.tsx
        - authApi.ts
        - authHooks.ts
        - authStyles.ts
      /profile
        - ProfileScreen.tsx
        - ProfileHeader.tsx
        - ...
    /components
      /common
        - Button.tsx
        - Card.tsx
        - ...
    /navigation
      - AppNavigator.tsx
      - AuthNavigator.tsx
      - ...
    /hooks
      - useForm.ts
      - useToggle.ts
      - ...
    /utils
      - format.ts
      - validation.ts
      - ...
    /constants
      - colors.ts
      - typography.ts
      - ...
  ```