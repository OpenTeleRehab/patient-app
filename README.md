# Overview

This mobile app project was bootstrapped with [React Native App](https://reactnative.dev/docs/environment-setup).

# Requirements

* [Git](https://git-scm.com/) version >= 2.0.0
* [NodeJS](https://nodejs.org/en/download/package-manager/) version >= 10.0.0 && < 15.0.0
* [Yarn](https://yarnpkg.com/lang/en/docs/install/#debian-stable) version >= 1.20.0
* JDK [OpenJDK](http://openjdk.java.net/install/) or [Standard Edition](https://docs.oracle.com/en/java/javase/index.html) version >= 8 (10 is recommended)
* Configure Android environment variables

    ```bash
    vi ~/.zshrc.local
    # vi ~/.bash_profile
    ```

    Add the following lines

    ```bash
    export ANDROID_HOME=$HOME/Android/Sdk
    export PATH=$PATH:$ANDROID_HOME/emulator
    export PATH=$PATH:$ANDROID_HOME/tools
    export PATH=$PATH:$ANDROID_HOME/tools/bin
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    ```

    Reload bash configuration (restart your terminal or run below command)

    ```bash
    source ~/.zshrc.local
    # source ~/.bash_profile
    ```

* Configure iOS environment [TODO]

__Note:__ If you previously installed a global `react-native-cli`, please remove it as it may cause unexpected issues: `[sudo] npm remove -g react-native-cli`

# Development Setup

1. Clone project to your development workspace

    ```bash
    git clone git@git.web-essentials.asia:hiv-tra-20/patient-app.git ~/dev/docker-projects/hiv/patient-app
    ```

2. Navigate to project root directory

    ```bash
    cd ~/dev/docker-projects/hiv/patient-app
    ```

3. Run yarn to install node packages

    ```bash
    yarn install
    ```

4. Configure `settings.js`

    ```bash
    cp config/ansible/roles/deploy/templates/settings.js.j2 config/settings.js
    ```

    Edit file and replace/add value for:
    * defaultAPIStage = `local`
    * hasToggleAPIStage = `true` // or `false` if you want to disable API server switching
    * isDebugMode = `true` // or `false` if you want to disable redux log print out
    * append new object item for `apiStages`: `local: 'http://your-computer-ip'`
    * appVersion = `'1.0.0-local'`

5. Start JS server with Metro Bundler

    ```bash
    yarn start
    ```

6. Start your local emulator or plug with real mobile device

### Android

1. Configure `build.gradle`

    ```bash
    cp config/ansible/roles/deploy/templates/build.gradle.j2 android/build.gradle
    ```

     Edit file and replace value for:
     * `majorApkVersion` = 1
     * `minorApkVersion` = 0
     * `patchApkVersion` = 0
     * `classifierApkVersion` = "local"

2. Start your local emulator or plug with real mobile device

3. Deploy development app to online testing device(s): `adb devices`

    ```bash
    yarn android
    ```

    > Note: if you have problem with missing `ndk`, please follow this instruction: [Install NDK](https://developer.android.com/studio/projects/install-ndk) and check required version in file `android/build.gradle`

### iOS [TODO]

# Build released app

## Android (.apk)
It is automated build on `Jenkins`, in which you can find the apk file(s) for each stage via: [Download APK](https://packages.web-essentials.asia/apk/hiv/)

## iOS (.ipa) [TODO]
It is manually build on `Mac`, in which you can find the ipa file(s) for each stage via: [Download IPA](https://packages.web-essentials.asia/ipa/hiv/)

# Release Android app to Play Store [TODO]
# Release iOS app to App Store [TODO]

# Code check styles `ESLint`

> We inherited code styles base from [react native community](https://github.com/facebook/react-native/blob/master/packages/eslint-config-react-native-community/index.js)

* Overall check styles

    ```bash
    yarn lint
    ```

* Check style for specific file

    ```bash
    yarn eslint /path/to/file/HomeTab.js
    ```

# Useful commands

## Android

* Check connected authorized or unauthorized device(s)

    ```bash
    adb devices
    ```

* Uninstall Android debug app from device(s)

    ```bash
    adb uninstall org.hi.patient
    ```
