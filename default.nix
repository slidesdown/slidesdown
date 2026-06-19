{
  pkgs ? import <nixpkgs> { },
  stdenv ? pkgs.stdenv,
  ...
}:
let
  manifest = pkgs.lib.importJSON ./manifest.json;
in
stdenv.mkDerivation {
  pname = manifest.name;
  version = manifest.version;

  # Point to the directory containing your script
  src = ./.;

  buildInputs = (
    with pkgs;
    [
      nushell
      docker
      python3
      decktape
    ]
  );

  installPhase = ''
    mkdir -p $out/bin
    cp ${manifest.name} $out/bin
    chmod +x $out/bin/${manifest.name}
  '';
}
