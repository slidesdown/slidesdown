{
  pkgs ? import <nixpkgs> { },
  stdenv ? pkgs.stdenv,
  lib ? pkgs.lib,
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

  nativeBuildInputs = with pkgs; [
    makeWrapper
  ];

  installPhase = ''
    mkdir -p $out/bin
    cp ${manifest.name} $out/bin
    chmod +x $out/bin/${manifest.name}
  '';

  postFixup = ''
    wrapProgram $out/bin/${manifest.name} \
      --prefix PATH : ${
        lib.makeBinPath (
          with pkgs;
          [
            nushell
            docker
            python3
            decktape
          ]
        )
      }
  '';
}
