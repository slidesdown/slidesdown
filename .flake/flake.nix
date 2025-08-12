# File syntax: https://nixos.org/manual/nixos/stable/#sec-nix-syntax-summary
{
  description = "Dependencies";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-25.05";
    nixpkgs-unstable.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      nixpkgs-unstable,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [
            (self: super: {
              unstable = import nixpkgs-unstable {
                inherit system;
                # config.allowUnfree = true;
              };
            })
          ];
        };
        allOsPackages = with pkgs; [
          # Nix packages: https://search.nixos.org/packages
          # deno # JS interpreter https://deno.land/
          bashInteractive # bash used in scripts
          curl # HTTP and more CLI https://curl.se/
          gh # GitHub CLI https://cli.github.com/
          git-cliff # Changelog generator https://github.com/orhun/git-cliff
          just # Simple make replacement https://just.systems/
          nodejs_22 # node used for husky installation https://nodejs.org/en/
          deno
          nushell # Nu Shell https://www.nushell.sh/
        ];
        linuxOnlyPackages = [ ];
      in
      {
        devShell = pkgs.mkShell {
          nativeBuildInputs =
            if pkgs.system == "x86_64-linux" then allOsPackages ++ linuxOnlyPackages else allOsPackages;
          buildInputs = [ ];
        };

      }
    );
}
