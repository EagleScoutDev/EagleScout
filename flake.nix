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
          export DEVELOPER_DIR="${pkgs.darwin.xcode_16_4}/Contents/Developer"
          export PATH="$DEVELOPER_DIR/Toolchains/XcodeDefault.xctoolchain/usr/bin:$DEVELOPER_DIR/usr/bin:$PATH"
        '';
      };
  };
}
