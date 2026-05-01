# Tadoru

A cross-platform mobile app built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev) for capturing and managing moments.

## Features

- 📸 **Camera Integration**: Capture photos directly from your device camera
- 🖼️ **Photo Library**: Access and manage photos from your device library
- 🎙️ **Voice Recording**: Record audio notes alongside your captures
- 🔐 **Secure Authentication**: User authentication powered by [Clerk](https://clerk.com)
- 🌓 **Dark Mode Support**: Automatic theme switching based on system settings
- 📱 **Cross-Platform**: Works on iOS, Android, and web

## Prerequisites

- Node.js 18+ and npm
- Expo CLI
- [Clerk account](https://clerk.com) (for authentication)

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tadoru
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The CLI will present options to run the app on:
   - [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [Web Browser](https://docs.expo.dev/workflow/web/) (via `w` key)
   - [Expo Go](https://expo.dev/go) (via QR code)

## Project Structure

```
tadoru/
├── app/                 # App entry points and routing (Expo Router)
├── components/          # Reusable React components
├── hooks/              # Custom React hooks
├── constants/          # App constants and configuration
├── assets/             # Images, fonts, and other static assets
├── scripts/            # Build and utility scripts
└── app.json            # Expo configuration
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start the app in Android emulator
- `npm run ios` - Start the app in iOS simulator
- `npm run web` - Start the app in web browser
- `npm run lint` - Run ESLint

## Technology Stack

- **Framework**: [Expo](https://expo.dev) 53+
- **Language**: TypeScript
- **Navigation**: [React Navigation](https://reactnavigation.org)
- **Authentication**: [Clerk](https://clerk.com)
- **Styling**: React Native StyleSheet
- **State Management**: React Hooks
- **Storage**: AsyncStorage, SecureStore

## Development

This project uses:
- **Expo Router** for file-based routing
- **TypeScript** for type safety
- **ESLint** for code quality
- **React Native Reanimated** for smooth animations

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Clerk Documentation](https://clerk.com/docs)
