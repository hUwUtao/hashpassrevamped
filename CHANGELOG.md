# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2022-01-25

### Fixed

- A subtle race condition has been fixed.

## [2.0.2] - 2022-01-25

### Changed

- Hashpass now has a subtle visual indication of when its recalculating the
  generated password.

## [2.0.1] - 2022-01-25

### Changed

- Hashpass now generates passwords in a background thread to avoid locking up
  the main thread.

## [2.0.0] - 2022-01-23

### Changed

- Hashpass can now be invoked with the keyboard shortcut Ctrl+Shift+P on
  non-macOS operating systems and Cmd+Shift+P on macOS.
- Hashpass has been completely rewritten and modernized.

### Added

- This changelog was added.