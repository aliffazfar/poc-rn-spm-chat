fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android build

```sh
[bundle exec] fastlane android build
```

Increment build number in .env and compile slim release APK

### android loadly

```sh
[bundle exec] fastlane android loadly
```

Build release APK and distribute to Loadly

### android release

```sh
[bundle exec] fastlane android release
```

Alias for release to Loadly

---

## iOS

### ios build

```sh
[bundle exec] fastlane ios build
```

Archive Xcode project and package into an IPA (Payload folder method)

### ios loadly

```sh
[bundle exec] fastlane ios loadly
```

Build release IPA and distribute to Loadly

### ios release

```sh
[bundle exec] fastlane ios release
```

Alias for release to Loadly

---

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
