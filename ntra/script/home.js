import {htm} from "./utility";
import { RoundCarousel, RoundCarouselItem } from "round-carousel-component";
import jsonObject from "../src/important.json";
import {Heart} from "vanjs-feather";

function getFontSizeInEm(element) {
    const computedStyle = window.getComputedStyle(element);
    const fontSizePx = parseFloat(computedStyle.fontSize);
    const parentFontSizePx = parseFloat(window.getComputedStyle(element.parentElement).fontSize) || 16; // Default 16px if no parent

    return fontSizePx; // Convert px to em
}



export default function Home () {
  let capcount = jsonObject.captions.length;
  if (capcount < 3) capcount = 4;
  const cta = htm(htm("Book Us","span",{class:"button-text"}),
    "button",
    {
      class: "button"
    }
  ),
  node = htm(undefined,"div",{id:"carousel"}),
  items = Array(capcount)
  	.fill('')
  	.map((_, index) => ({
  		alt: "",
  		image: `https://rawcdn.githack.com/elijahducote/DJ/${jsonObject.hash}/ntra/src/media/flyers/${index}.jpg`,
  		content:decodeURI(jsonObject.captions[index])
      //content: `<div><strong>Round Carousel</strong><span>Slide number ${index + 1}</span></div>`
  }));
  
  const slides = new RoundCarousel(node, {
    items,
    itemWidth:720,
    showControls: true,
    nextButtonContent: "",
    prevButtonContent: ""
  });
  
  setInterval(function() {
    slides.next();
  },8000);

  cta.addEventListener("click",function() {
    history.pushState({ page: 'booking' }, "Booking", "/booking");
    window.dispatchEvent(window.docState);
  });

  return htm([
    htm("Looking for a DJ?",
      "span",
      {
        class: "home-heading"
      }
    ),

    htm(undefined,
      "div",
      {
        class: "home-separator"
      }

    ),

    cta,
    
    node,

    /*htm(undefined,
      "div",
      {
        class: "home-poster"
      }
    ),*/

    htm("Houston’s LoFi/Downtempo Maestro",
      "span",
      {
        class: "home-heading"
      }
    ),

    htm(undefined,
      "div",
      {
        class: "home-separator"
      }

    ),

    htm([htm("Ev","span",{style:"font-weight:400"}), ", a ", htm("Houston","a",{style:"font-weight:400;font-style:italic;",href:"https://en.wikipedia.org/wiki/Houston"}), htm("-based ","span",{style:"font-style:italic;"}), htm("electronic music artist","span",{style:"font-weight:400;"}), ", weaves sonic tapestries from the vibrant threads of ", htm(["Lo-Fi, chillwave, downtempo, jazz, dream pop, ambient, & electronica.",htm(undefined,"br")],"span",{style:"font-weight:400;font-style:italic"}),"Drawing from a rich palette of influences, Ev crafts immersive soundscapes that invite listeners to drift, dream, & vibe in the ",Heart({class:"icon",style:"fill:#F00;stroke:#FFF;width:1em;height:1em"}),htm(" of Texas","span",{style:"font-weight:400"})],
      "span",
      {
        class: "home-description"
      }
    )

  ],
    "div",
    {
      class: "home-about"
    }

  );
}