INTRODUCTION
------------

Secured TODO list app, with react native.

REQUIREMENTS
------------

- node 18.18.2
- npm 10.2.1
- react-18.2.0
- react-native 0.72.6
- xcode 15.0.1
- cocoaPods 1.14.2
- Android Studio Giraffe 2022.3.1
- java 11
- gradle 8.0.1

INSTALLATION
------------

- install project dependencies, ```npm i```
- install ios dependencies,```cd ios && pod install```

Quick Start
------------

### Run/Reset JS Bundler server

```npm start```

### Run and Install App in emulator with dev env params

- iOS

```npm run ios```

- android

1. run emulator
2. ```npm run android```

### Available Scripts

- Type check with TypeScript,
```npm run typecheck```
- Style check with ESLint,
```npm run lint``` or ```npm run lint -- --fix```
- Unit test with Jest,
```npm run test```

CONFIGURATION
-----------

- package.json
  lists the packages that your project depends on.

- build.gradle
  lists the packages and config that your project depends for in Android.

- podfile
  lists the packages that your project depends on for iOS.

- .xcconfig
  lists the config that your project depends on for iOS.
