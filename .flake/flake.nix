# File syntax: https://nixos.org/manual/nixos/stable/#sec-nix-syntax-summary
{
  description = "Dependencies";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.05";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        allOsPackages = with pkgs; [
          # Nix packages: https://search.nixos.org/packages
          bashInteractive # bash used in scripts
          curl # HTTP and more CLI https://curl.se/
          gh # GitHub CLI https://cli.github.com/
          git-cliff # Changelog generator https://github.com/orhun/git-cliff
          just # Simple make replacement https://just.systems/
          nodejs_18 # node used for husky installation https://nodejs.org/en/
        ];
        linuxOnlyPackages = [ ];
      in {
        devShell = pkgs.mkShell {
          nativeBuildInputs = if pkgs.system == "x86_64-linux" then
            allOsPackages ++ linuxOnlyPackages
          else
            allOsPackages;
          buildInputs = [ ];
        };

      });
}
