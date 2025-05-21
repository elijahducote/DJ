import {htm} from "./utility";

export default function Playlists() {
  const playlists = [
    {
      title: "Lo-Fi",
      src: "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F1504987279&show_artwork=true&secret_token=s-cLlbzYSiZH8"
    },
    {
      title: "Funk",
      src: "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F1849472907&show_artwork=true&show_comments=false"
    },
    {
      title: "Open Format",
      src: "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F1881155051&show_artwork=true&show_comments=false&secret_token=s-vDR8Vhv30C3"
    },
    {
      title: "Alternative",
      src: "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F1946144887&show_artwork=true&show_comments=false&secret_token=s-bSvcXntVHjs"
    },
    {
      title: "Pop",
      src: "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F1986353964&show_artwork=true&show_comments=false&secret_token=s-mJUIl9SwEG1"
    }
  ];
  return htm(
    playlists.flatMap(playlist => [
      htm(playlist.title, "h2"),
      htm(undefined, "div", { class: "home-separator" }),
      htm(undefined, "br"),
      htm(
        htm(undefined, "iframe", {
          src: playlist.src,
          style: "width: 175%; height: 100%; position: absolute; border: 0px;",
          allowfullscreen: "",
          scrolling: "no"
        }),
        "div",
        { style: "width: 36%; height:16em; position: relative;" }
      ),
      htm(undefined, "br")
    ]),
    "div",
    { style: "max-width: 100%;" }
  );
}