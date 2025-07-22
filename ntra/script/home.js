import {htm} from "./utility";
import { RoundCarousel, RoundCarouselItem } from "round-carousel-component";
import jsonObject from "../src/important.json";

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
  items = Array(jsonObject.captions.length)
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

    htm("About",
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

    htm("Ev spins chill lofi, funk/soul & more…",
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