import {htm} from "./utility";

export function Playlists() {
  return htm([
    
    htm("Open Format Mix",
      "h2"
    ),
        
    htm(undefined,
      "div",
      {
        class: "home-separator"
      }
    ),
        
    htm(undefined,
      "br"
    ),
    
    htm(htm(undefined,"iframe",{src: "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F1881155051&show_artwork=true&show_comments=false&secret_token=s-vDR8Vhv30C3",style: "width: 175%; height: 100%; position: absolute; border: 0px;",allowfullscreen:"",scrolling: "no"}),
    
    "div",
      {
       style: "width: 36%; height:16em; position: relative;"
      }
    ),
    
    htm(undefined,
      "br"
    ),

    htm("Chill Electronic Mix",
      "h2"
    ),
    
    htm(undefined,
      "div",
      {
        class: "home-separator"
      }
    ),
    
    htm(undefined,
      "br"
    ),
    
    htm(htm(undefined,"iframe",{src: "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F1504987279&show_artwork=true&secret_token=s-cLlbzYSiZH8",style: "width: 175%; height: 100%; position: absolute; border: 0px;",allowfullscreen:"",scrolling: "no"}),
    
    "div",
      {
        style: "width: 36%; height:16em; position: relative;"
      }
    ),
    
    htm(undefined,
      "br"
    ),
    
    htm("Funk Mix",
      "h2"
    ),
    
    htm(undefined,
      "div",
      {
        class: "home-separator"
      }
    ),
    
    htm(undefined,
      "br"
    ),
    
    htm(htm(undefined,"iframe",{src: "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F1849472907&show_artwork=true&show_comments=false",style: "width: 175%; height: 100%; position: absolute; border: 0px;",allowfullscreen:"",scrolling: "no"}),
    
      "div",
      {
        style: "width: 36%; height:16em; position: relative;"
      }
    )

  ],
    "div",
    {
      style: "max-width: 100%;"
    }

  );
}