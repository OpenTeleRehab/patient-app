# Overview

This mobile app project was bootstrapped with [React Native App](https://reactnative.dev/docs/environment-setup).

# Requirements

* [Git](https://git-scm.com/) version >= 2.0.0
* [NodeJS](https://nodejs.org/en/download/package-manager/) version >= 10.0.0 && < 15.0.0
* [Yarn](https://yarnpkg.com/lang/en/docs/install/#debian-stable) version >= 1.20.0
* JDK [OpenJDK](http://openjdk.java.net/install/) or [Standard Edition](https://docs.oracle.com/en/java/javase/index.html) version >= 11
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

5. Decrypt `Firebase google services`

     ```bash
    ansible-vault decrypt config/ansible/roles/deploy/files/google-services.json.valut --output=android/app/google-services.json
    ansible-vault decrypt config/ansible/roles/deploy/files/GoogleService-Info.plist.vault --output=ios/GoogleService-Info.plist
    ```

    Edit file and replace/add value for:
    * isDebugMode = `true` // or `false` if you want to disable redux log print out
    * Set patient api URL `apiBaseURL`: `'http://your-computer-ip:8084/api'`
    * Set admin api URL `adminApiBaseURL`: `'http://your-computer-ip:8082/api'`
    * appVersion = `'1.0.0-local'`

6. Start JS server with Metro Bundler

    ```bash
    yarn start
    ```

7. Start your local emulator or plug with real mobile device

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

     Add firebase SDK into `dependencies`
     * `classpath 'com.google.gms:google-services:4.3.13`

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
# Release iOS app to App Store
* Navigate to
    ```bash
    cd ~/dev/docker-projects/hiv/patient-app/ios
    ```
* Run pod install
    ```bash
    arch -x86_64 pod install
    ```
  
* Build the app in Xcode
    * Now open project folder in Xcode and then navigate to ios directory and select the file which has extension .xcworkspace.
    * Click on General tab and navigate to identity and update the version.
    * It is time to archive the project so before an archive the project makes sure you have selected Generic iOS device in the top left corner of your window once you have done then navigate to `Product → Archive` once the app is successfully archived you will automatically get redirected to the Xcode Organizer window.
    * Once the app is successfully archived you will see a list of apps with the version in Xcode Organizer select this app click on the Distribute App.
    * You will see methods of distribution select `iOS App Store` and click on next.
    * You will see two method `Upload` or `Export` as we are going to upload app so select upload and click to next.
    * You will see two more options which are by default selected leave them as it is and click to next.
    * Once you clicked next it will take little time to identify your certificates and after that, you will see little details of your app which we are going to upload on the app store.
    * Now click `Upload` to upload your app on App Store, and it will take a little time to upload the app on app store. Once the app is an uploaded click on done and now it is time to login to App store.
    * Once your app is uploaded on test flight after that login to your app store account and click `My Apps` and navigate to `Your app → Test Flight` and here you will see your app with processing tag.
    * Once the processing is complete then you will see a warning icon like mentioned in image click on this icon and click again on `Provide Export Compliance Information`.
    * Now a pop up will appear which will ask you about `Export Compliance Information` in our case we did not have any encryption features so select `No` and click on `Start Internal Testing` and the app is going to be available on testing mode. You can test the app with test flight app available on App store and to test this app you need to add testers for this particular app on your App store account after that you can test your app.
    
> Note: Go to `config → setting.js` and switch settings based on stage release.

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
  
* Check performance monitoring

    ```bash
    adb logcat -s FirebasePerformance
    ```

* Uninstall Android debug app from device(s)

    ```bash
    adb uninstall org.hi.patient
    ```
