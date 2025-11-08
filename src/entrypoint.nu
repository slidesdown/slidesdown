#!/usr/bin/env nu
# Documentation: https://www.nushell.sh/book/

use std/log

def main [] {
  let use_verbose = ($env | default "" VERBOSE | get VERBOSE) == "1"
  let use_multiplex = ($env | default "" MULTIPLEX | get MULTIPLEX) == "1"
  let use_publish = ($env | default "" PUBLISH | get PUBLISH) == "1"
  let multiplex_job_id = job spawn -t multiplex {
    cd /multiplex
    let cmd = [npm run start]
    if $use_verbose {log info $"Running command: ($cmd | str join ' ')"}
    run-external ...$cmd
  }
  log info "Establishing tunnel"
  # TODO: Implement publish functionality
  let tunnel_output = "/tmp/tunnel.log"
  let tunnel_pid = "/tmp/tunnel.pid"
  let tunnel_job_id = job spawn -t tunnel {
    let cmd = [ cloudflared tunnel --url "http://127.0.0.1:8080" --pidfile $tunnel_pid ]
    if $use_verbose {log info $"Running command: ($cmd | str join ' ')"}
    run-external ...$cmd o+e> $tunnel_output
  }
  mut i = 0
  let timeout = 20sec
  let sleep_for = 0.1sec
  while $i < ($timeout / $sleep_for)  {
    if (job list | where {$in.id == $tunnel_job_id} | length) == 0 {
      log error "Failed to establish tunnel, exiting."
      exit 1
    }
    if ($tunnel_output | path exists) and (open --raw $tunnel_output | lines | find "|  https://" | length) > 0 {
      break
    }
    sleep $sleep_for
    $i = $i + 1
  }
  # Transform params back to a hash table instead of a list to make it easier to deal with
  # reject the query string since it's already encoded in params and will break `url join` when params changes
  let url = $env | default "http://localhost:3000?slides=slides%2FSLIDES.md" URL | get URL | url parse | reject -o query | upsert params ($in.params | transpose -dr)
  let _tunnel_url = open --raw $tunnel_output | lines | find "|  https://" | parse --regex ".* \(?<tunnel>https://[^ ]*\) .*" | get -o 0.tunnel | ansi strip | url parse
  mut tunnel_url = $url | reject -o port
  $tunnel_url = $tunnel_url | upsert scheme $_tunnel_url.scheme | upsert host $_tunnel_url.host

  # Create mutliplex configuration
  let multiplex_secret = random chars -l 40
  let multiplex_id = $multiplex_secret | hash sha256
  let multiplex_presenter_url = $url | upsert params.multiplex64 ({id: $multiplex_id, secret: $multiplex_secret} | to json | encode base64 --url)
  let multiplex_client_url = $url | upsert params.multiplex64 ({id: $multiplex_id} | to json | encode base64 --url)
  let tunnel_multiplex_presenter_url = $tunnel_url | upsert params.multiplex64 ({id: $multiplex_id, secret: $multiplex_secret} | to json | encode base64 --url)
  let tunnel_multiplex_client_url = $tunnel_url | upsert params.multiplex64 ({id: $multiplex_id} | to json | encode base64 --url)

  let follower_url_file = "/tmp/tunnel_follower.url"
  let presenter_url_file = "/tmp/tunnel_presenter.url"

  if $use_multiplex {
    if $use_publish {
      print $'Public slideshow Presenter URL ("(")keep secret!(")"): ($tunnel_multiplex_presenter_url | url join)'
      print $'Public slideshow Follower URL: ($tunnel_multiplex_client_url | url join)'
      $tunnel_multiplex_presenter_url | url join | save $presenter_url_file
      $tunnel_multiplex_client_url | url join | save $follower_url_file
    } else {
      print $'Local slideshow Presenter URL ("(")keep secret!(")"): ($multiplex_presenter_url | url join)'
      print $'Local slideshow Follower URL: ($multiplex_client_url | url join)'
      $multiplex_presenter_url | url join | save $presenter_url_file
      $multiplex_client_url | url join | save $follower_url_file
    }
  } else {
    if $use_publish {
      print $'Public slideshow URL: ($tunnel_url | url join)'
      $tunnel_url | url join | save $presenter_url_file
      "" | save $follower_url_file
    } else {
      print $'Local slideshow URL: ($url | url join)'
      $url | url join | save $presenter_url_file
      "" | save $follower_url_file
    }
  }

  # Start slidesdown
  npm run dev
  if $use_verbose {
    log info "Process is terminating"
  }
}
