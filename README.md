# React Native SPM Chat POC

![Chat preview](assets/preview.webp)

[![Download Android APK](https://img.shields.io/badge/Download_APK-24.45_MB-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://i.loadly.io/77qqPgxf)
[![React Native](https://img.shields.io/badge/React_Native-0.87.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
[![SwiftPM](https://img.shields.io/badge/iOS-Swift_Package_Manager-FA7343?style=for-the-badge&logo=swift&logoColor=white)](https://developer.apple.com/swift/)

A React Native chat application testing pure Swift Package Manager (SPM) on iOS with zero CocoaPods dependencies, built ahead of the [December 2, 2026 CocoaPods sunset](https://blog.cocoapods.org/CocoaPods-Specs-Repo/).

Powered by the experimental SPM support introduced in [React Native 0.87](https://reactnative.dev/blog/2026/08/11/react-native-0.87).

## Why are there patches?

Most React Native libraries only ship with `.podspec` files. While `react-native spm scaffold` generates basic templates, complex C++, JSI, and Fabric libraries require manual patching to fix non-canonical header imports, set C++20 flags, define New Architecture macros, and resolve external Swift packages (like Nuke or MMKVCore).

Eight dependencies are patched via `.yarn/patches`:

- `react-native-nitro-modules`: Adds SPM targets and C++ module maps for New Architecture autolinking.
- `react-native-mmkv`: Links `MMKVCore` and `ReactNativeNitroModules` directly through SPM.
- `react-native-turbo-image`: Links Nuke and NukeUI through SPM.
- `react-native-reanimated` and `react-native-worklets`: SPM targets and runtime headers for Reanimated v4.
- `react-native-screens`: SPM targets and header search paths.
- `react-native-safe-area-context`: SPM manifest and C++ bridging headers.
- `@react-native/gradle-plugin`: Android build compatibility fix.

These patches will be removed as upstream maintainers release official SPM support.

I documented notes and workflows from my own trial and error while experimenting with this setup (migrating from CocoaPods, scaffolding `Package.swift` manifests via `npx react-native spm scaffold`, and resolving C++ headers) in [.skills/react-native-spm/SKILL.md](.skills/react-native-spm/SKILL.md) in case it helps anyone testing the same path.

## Performance stack

- Devtools: [Rozenite](https://github.com/callstackincubator/rozenite) (a tool I contribute to) for live inspection of MMKV storage, TanStack Query caches, React Navigation state, and many more plugins.
- Styling: [uniwind](https://github.com/uni-stack/uniwind), the fastest Tailwind CSS v4 engine for React Native, with instant dark mode support.
- Storage: [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) with [nitro modules](https://github.com/mrousavy/nitro) for direct C++ JSI persistence.
- Lists: [@legendapp/list](https://github.com/LegendApp/legend-list) for container-recycling 120fps virtualized lists.
- Images: [react-native-turbo-image](https://github.com/duguyihou/react-native-turbo-image) backed by Nuke.
- Cache: [TanStack React Query](https://github.com/TanStack/query) with MMKV persistence.
- Client state: [zustand](https://github.com/pmndrs/zustand) for lightweight store management.
- Animations: [react-native-reanimated v4](https://github.com/software-mansion/react-native-reanimated).
- Navigation: [@react-navigation/native-stack](https://github.com/react-navigation/react-navigation) for native view controller transitions.

## Quick start

Tested environment:

- Yarn: `4.12.0`
- Xcode: `16.2` (Swift Tools 6.0)
- Node: `>= 22.11.0` (tested on `24.5.0`)

```sh
yarn install
yarn spm:sync # sync SPM dependencies (no pod install)
yarn ios      # or yarn android
```

Helpful commands:

- `yarn start:rozenite`: Run Metro with Rozenite devtools enabled.
- `yarn clean:spm`: Clear SPM build cache.
- `yarn build:android` / `yarn build:ios`: Compile release builds.
- `yarn loadly:android`: Build release APK and upload directly to Loadly.
