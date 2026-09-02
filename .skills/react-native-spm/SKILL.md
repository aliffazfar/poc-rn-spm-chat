---
name: react-native-spm
description: >
  Swift Package Manager (SPM) for React Native 0.87+. Use when setting up,
  migrating, building, or debugging iOS dependencies in React Native projects
  using Swift Package Manager instead of CocoaPods. Covers setup, de-integration,
  scaffolding community packages (Package.swift), Yarn/npm patching, Fabric C++
  header resolution, autolinking, Xcode configuration, CI workflows, and troubleshooting.
---

# Swift Package Manager (SPM) in React Native

> React Native 0.87+ / Xcode 16+ / Swift Tools 6.0+

Starting in React Native 0.87, Swift Package Manager (SwiftPM) is supported natively as an experimental alternative to CocoaPods. It eliminates Ruby, Bundler, `Gemfile`, `Podfile`, `Podfile.lock`, and `pod install`, managing all iOS dependencies directly through Xcode and `Package.swift`.

---

## Core Architecture & Mechanics

1. **Pure Xcode Workflow**:
   * Open `.xcodeproj` directly (no `.xcworkspace` needed).
   * Dependencies are declared as local Swift packages (`XCLocalSwiftPackageReference`) in `project.pbxproj`.
2. **Prebuilt Core XCFrameworks (`ios/xcframeworks`)**:
   * React Native core is linked via prebuilt XCFrameworks and invariant Clang headers: `ReactHeaders`, `ReactNativeHeaders`, `ReactNativeDependenciesHeaders`.
3. **Generated Codegen Package (`React-GeneratedCode`)**:
   * Autolinking generates `ios/build/generated/ios/Package.swift`, exporting `ReactCodegen`, `ReactAppDependencyProvider`, and `ReactAppHeaders`.
4. **Automated `[RN] SwiftPM Sync` Build Phase**:
   * Xcode runs `setup-apple-spm.js sync` automatically during builds. When a package is added or removed, Xcode re-syncs autolinking without requiring manual commands.
5. **State Tracking (`.spm-injected.json`)**:
   * Tracks injected references, build settings, and target IDs for clean `update` and `deinit`.

---

## CLI Commands & Workflows

### 1. Migrating from CocoaPods to SPM (`add --deintegrate`)

Run from the `ios/` directory (or app root):

```bash
cd ios
npx react-native spm --deintegrate
```

**What it does:**
- Runs `pod deintegrate` and strips React Native from the `Podfile`.
- Injects `XCLocalSwiftPackageReference` into `.xcodeproj`.
- Adds the `[RN] SwiftPM Sync` build phase.
- Downloads/verifies `ios/xcframeworks`.
- Creates `.spm-injected.json`.

### 2. CI & Fresh Clone Sync (`spm` / `update`)

On CI or after cloning a fresh repository:

```bash
npx react-native spm
```

*(Runs the fast SPM sync pipeline — equivalent to `pod install`).*

### 3. Scaffolding Community Libraries (`scaffold`)

For third-party libraries that do not yet ship `Package.swift`:

```bash
npx react-native spm scaffold node_modules/<package-name>
```

**Generates:**
- `node_modules/<package-name>/Package.swift`
- `node_modules/<package-name>/react-native-spm-prefix.h`

### 4. Reverting to CocoaPods (`deinit`)

Surgically undoes everything injected by SPM using `.spm-injected.json`:

```bash
cd ios
npx react-native spm deinit
```

---

## Community Library Compatibility Ladder (Scaffold → Fix → Patch)

Most community libraries (e.g. `react-native-screens`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-worklets`) do not yet ship with native `Package.swift` upstream. Follow this standard ladder:

### Step 1: Scaffold
```bash
npx react-native spm scaffold node_modules/<package-name>
```

### Step 2: Validate `Package.swift`
Check that `Package.swift` contains:
- `cxxLanguageStandard: .cxx20`
- `.unsafeFlags(["-include", "react-native-spm-prefix.h"])` in `cSettings` and `cxxSettings`
- `cxxSettings` matching prebuilt C++ ABI:
  ```swift
  .define("DEBUG", .when(configuration: .debug)),
  .define("NDEBUG", .when(configuration: .release))
  ```

### Step 3: Fix Non-Canonical Fabric Header Includes
If a library has legacy CocoaPods include paths, convert them to standard Fabric namespaces:
- ❌ `#import <rnscreens/RNSTabsHostComponentDescriptor.h>`
- ✅ `#import <react/renderer/components/rnscreens/RNSTabsHostComponentDescriptor.h>`

### Step 4: Persist via Yarn / npm Patch
Always commit the generated `Package.swift` and header fixes into a reproducible patch:

```bash
# 1. Open patch workspace
yarn patch <package-name>

# 2. Copy Package.swift, react-native-spm-prefix.h, and fixed sources into the temporary user folder
cp node_modules/<package-name>/Package.swift /path/to/temp/user/
cp node_modules/<package-name>/react-native-spm-prefix.h /path/to/temp/user/

# 3. Commit patch file
yarn patch-commit -s /path/to/temp/user
```

---

## Critical Rules

1. **Always Open `.xcodeproj` directly** — Do not open `.xcworkspace` once migrated to SPM.
2. **C++20 Standard is Mandatory** — Any `Package.swift` referencing React Native Fabric headers must specify `cxxLanguageStandard: .cxx20`.
3. **Prefix Headers for Objective-C / C++** — Always supply `react-native-spm-prefix.h` via `.unsafeFlags(["-include", "react-native-spm-prefix.h"])` to guarantee `#import <Foundation/Foundation.h>` and standard macros.
4. **Match Prebuilt C++ ABI** — Always include `DEBUG` (when debug) and `NDEBUG` (when release) in `cxxSettings`.
5. **Clear Stale DerivedData on Permission/Asset Errors** — If Xcode fails with `You don't have permission to save the file "assetcatalog_dependencies_thinned"`, delete DerivedData and clean build folder:
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData/<AppName>-*
   ```

---

## Common Issues & Troubleshooting

| Issue / Error | Root Cause | Fix |
| :--- | :--- | :--- |
| `'rnscreens/RNSTabsHostComponentDescriptor.h' file not found` | Library uses CocoaPods target search path instead of canonical Fabric path. | Replace with `#import <react/renderer/components/rnscreens/...>` and patch the library. |
| `Cannot find 'ReactHeaders' or 'ReactAppHeaders'` | Target dependencies in `Package.swift` missing product links. | Add `.product(name: "ReactHeaders", package: "ReactNative")` and `"ReactAppHeaders"` to `dependencies`. |
| `Unknown type name 'NSString'` or missing Foundation types | Translation unit compiled without default prefix header. | Add `.unsafeFlags(["-include", "react-native-spm-prefix.h"])` to `cSettings` and `cxxSettings`. |
| `assetcatalog_dependencies_thinned permission denied` | Xcode asset compiler (`actool`) locked temporary cache files in DerivedData. | Run `rm -rf ~/Library/Developer/Xcode/DerivedData/<AppName>-*` and press `Cmd + Shift + K` in Xcode. |
| `Multiple Swift packages have the same name` | Duplicate package references left in `project.pbxproj`. | Run `npx react-native spm` to re-sync autolinked references. |
