# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native & Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.bridge.** { *; }

# React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }

# React Native Screens
-keep class com.swmansion.rnscreens.** { *; }

# React Native Worklets
-keep class com.worklets.** { *; }

# React Native Nitro Modules
-keep class com.margelo.nitro.** { *; }
-keep class **.HybridObject { *; }

# React Native Turbo Image & Coil
-keep class com.turboimage.** { *; }
-keep class coil3.** { *; }
-keep class coil.** { *; }

# MMKV
-keep class com.tencent.mmkv.** { *; }
-keep class com.reactnativemmkv.** { *; }
