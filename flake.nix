{
  description = "Development flake for EagleScout";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";

    android-nixpkgs = {
      url = "github:tadfisher/android-nixpkgs";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, android-nixpkgs }:
    let
      pkgs = (import nixpkgs {
        system = "aarch64-darwin";
        config.allowUnfree = true;
        config.android_sdk.accept_license = true;
      });

      xcodeDir = "/Applications/Xcode.app";
      minXcodeVersion = "16F6"; # Release 16.4
    in {
      devShells.aarch64-darwin.default = pkgs.mkShellNoCC {
        packages = with pkgs; [
          gh
          nodejs_22
          cocoapods
          watchman
          jdk17_headless
        ];

        nativeBuildInputs = [
          (android-nixpkgs.sdk.aarch64-darwin (sdkPkgs: with sdkPkgs; [
            cmdline-tools-latest
            platform-tools
            emulator
            ndk-27-1-12297006
            cmake-3-22-1
            build-tools-35-0-0
            build-tools-36-0-0
            platforms-android-36
            system-images-android-36-google-apis-arm64-v8a
          ]))
        ];

        shellHook = ''
          export DEVELOPER_DIR="${xcodeDir}/Contents/Developer"
          export PATH="$DEVELOPER_DIR/Toolchains/XcodeDefault.xctoolchain/usr/bin:$DEVELOPER_DIR/usr/bin:$PATH"
          
          if [[ ! -d "$DEVELOPER_DIR" ]]; then
            echo "Failed to find Xcode installation at $DEVELOPER_DIR" >&2
            exit
          fi

          XCODE_VERSION=$("$DEVELOPER_DIR"/usr/bin/xcodebuild -version | grep -o "Build version .*" | sed 's/Build version //')
          if [[ "$XCODE_VERSION" < "${minXcodeVersion}" ]]; then
            echo "Xcode installation at $DEVELOPER_DIR is either corrupted or outdated" >&2
            echo "Current version: $XCODE_VERSION" >&2
            echo "Minimum version: ${minXcodeVersion}" >&2
            exit
          fi
        '';
      };
  };
}
