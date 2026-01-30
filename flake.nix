{
  description = "Development flake for EagleScout";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        arch = builtins.elemAt (pkgs.lib.strings.splitString "-" system) 0;
        os = builtins.elemAt (pkgs.lib.strings.splitString "-" system) 1;
        pkgs = (import nixpkgs {
          system = system;
        });

        xcodeDir = "/Applications/Xcode.app";
        minXcodeVersion = "16F6"; # Release 16.4
      in {
        devShells.default = pkgs.mkShellNoCC {
          packages = with pkgs; (
            [
              watchman
              nodejs_22
              jdk17_headless
              cocoapods
            ]
          );

          shellHook = {
            linux = ''

            '';

            darwin = ''
              export DEVELOPER_DIR="${xcodeDir}/Contents/Developer"
              export PATH="$DEVELOPER_DIR/Toolchains/XcodeDefault.xctoolchain/usr/bin:$DEVELOPER_DIR/usr/bin:$PATH"

              if [[ ! -d "$DEVELOPER_DIR" ]]; then
                echo -e "\033[31m[error] Could not locate Xcode installation at $DEVELOPER_DIR\033[0m" >&2
                exit 1
              fi

              XCODE_VERSION=$("$DEVELOPER_DIR"/usr/bin/xcodebuild -version | grep -o "Build version .*" | sed 's/Build version //')
              if [[ "$XCODE_VERSION" < "${minXcodeVersion}" ]]; then
                echo -e "\033[31m[error] Xcode installation at $DEVELOPER_DIR is either corrupted or outdated" >&2
                echo -e "[error] Current version: $XCODE_VERSION" >&2
                echo -e "[error] Minimum version: ${minXcodeVersion}\033[0m" >&2
                exit 1
              fi

              if [[ ! -d "$ANDROID_HOME" ]]; then
                echo -e "\033[31m[error] Could not locate Android SDK at \$ANDROID_HOME ($ANDROID_HOME)\033[0m" >&2
                exit 1
              fi
              for x in "cmdline-tools/latest/bin:Android SDK Command-line Tools"; do
                IFS=":" read -r sdkDir sdkName <<< "$x"
                if [[ ! -d "$ANDROID_HOME/$sdkDir" ]]; then
                  echo -e "\033[31m[error] Missing the $sdkName at $sdkDir \033[0m" >&2
                  exit 1
                fi

                export PATH="$ANDROID_HOME/$sdkDir:$PATH"
              done
            '';
          }.${os};
        };
      });
}
