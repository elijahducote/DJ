import van from "vanjs-core";
import {list, reactive} from "vanjs-ext";
import {ChevronsUp,Instagram,Youtube,Link} from "vanjs-feather";
import {htm,Dbounce,throttle,sleep} from "./utility.js";

var itR8R = 0,
isScrolling,
isCancelled = false;

function TopNav(nav) {
  itR8R = 0;
  const iconname = ["HOME","BOOK","NOTE","MERCH","SERVICE"];
  return list(nav,reactive(["ome", "ooking","laylists","erch","ervice"]),function (v) {
    let offset = ".75em";
    if (!itR8R) offset = "0";
    let path = ["home","booking","playlists",undefined,"payment"][itR8R],
    section = htm([htm("","img",{class:"letter-icon",src:`./cdn/media/img/svg/${iconname[itR8R]}.svg`})],"h2",{class:"nav-top-section","data-link":path, style:`user-select: none;`});
    if (itR8R === 3) {
      let a = htm([htm("","img",{class:"letter-icon",src:`./cdn/media/img/svg/${iconname[itR8R]}.svg`})],"h2",{class:"nav-top-section"});
      
      a.addEventListener("touchend",() => window.open("https://shop.djev.org","EvWaveMerch","noreferrer,noopener"));
      a.addEventListener("click",() => window.open("https://shop.djev.org","EvWaveMerch","noreferrer,noopener"));
      //van.add(contents,htm(undefined,"br"));
      ++itR8R;
      return a;
    }
    section.addEventListener("click", function() {
      window.router.goto(this.dataset.link);
    });
    ++itR8R;
    //van.add(wrapper[5],htm([htm("test","span"),v],"h2"));
    //van.add(contents,htm(undefined,"br"));
    return section;
  });
}

function Menu(dropdown) {
  itR8R = 0;
  const exit = htm("","img",{class:"exit-icon",src:"./cdn/media/img/svg/CRUX.svg"}),
  iconname = ["HOME","BOOK","NOTE","MERCH","SERVICE"],
  contents = dropdown.firstElementChild;
  exit.addEventListener("touchend", throttle(function () {
    dropdown.addEventListener("transitionend",function(){
      Object.assign(dropdown.style, {display:"none",visibility:"hidden",opacity:"0"});
    },{once:true});
    dropdown.style.opacity = "0";
  },3000));
  exit.addEventListener("click", throttle(function () {
    dropdown.addEventListener("transitionend",function(){
      Object.assign(dropdown.style, {display:"none",visibility:"hidden",opacity:"0"});
    },{once:true});
    dropdown.style.opacity = "0";
  },3000));
  van.add(contents,exit);
  return list(contents,reactive(["ome", "ooking","laylists","erch","ervice"]),function (v) {
    let offset = ".75em";
    if (!itR8R) offset = "0";
    if (itR8R === 3) {
      let a = htm([htm("","img",{class:"letter-icon",src:`./cdn/media/img/svg/${iconname[itR8R]}.svg`}),v],"h2",{style:`margin: ${offset} 0 0;`});
      
      a.addEventListener("touchend",() => window.open("https://shop.djev.org","EvWaveMerch","noreferrer,noopener"));
      a.addEventListener("click",() => window.open("https://shop.djev.org","EvWaveMerch","noreferrer,noopener"));
      van.add(contents,htm(undefined,"br"));
      ++itR8R;
      return a;
    }
    let path = ["home","booking","playlists",undefined,"payment"][itR8R],
    section = htm([htm("","img",{class:"letter-icon",src:`./cdn/media/img/svg/${iconname[itR8R]}.svg`}),v],"h2",{"data-link":path, style:`margin: ${offset} 0 0; user-select: none;`});
    section.addEventListener("click", function() {
      const clickEvent = new Event("click");
      exit.dispatchEvent(clickEvent);
      window.router.goto(this.dataset.link);
    });
    ++itR8R;
    //van.add(wrapper[5],htm([htm("test","span"),v],"h2"));
    van.add(contents,htm(undefined,"br"));
    return section;
  });
}

async function interaction (e) {
  const elm = e.target,
  parent = elm.parentElement,
  attr = parent.parentElement.dataset.index,
  links = ["HTTPS://INSTAGRAM.COM/_DJEV_","HTTPS://WWW.YOUTUBE.COM/@DJEV-MUSIC","HTTPS://LINKTR.EE/EVDMUSIC"];
  if (!attr) return;
  await sleep(1000);
  parent.style.transform = "none";
  window.open(links[parseInt(attr)],"EvMusicSocials","noreferrer,noopener");
}

export function Header(item) {
  const dendros = htm(htm(undefined,"path",{fill:"url(#gradi-lnk)",d:"m13.7 5.9 4-4.2 2.4 2.4-4.2 4h5.9v3.3h-6l4.3 4.1-2.4 2.4L12 12l-5.7 5.8-2.4-2.4 4.3-4h-6V8h6L3.9 4l2.4-2.4 4 4.2V0h3.4zm-3.4 10.3h3.4V24h-3.4z"}),"svg",{xmlns:"http://www.w3.org/2000/svg",class:"icon"});
  dendros.id = "linktree";
  dendros.setAttributeNS(null,"viewBox","0 0 24 24");
  const drawer = htm(ChevronsUp({class:"icon",id:"drawer"}),"main",{class:"menu"}),
  icon = drawer.firstElementChild,
  img = htm(htm("","img",{src:`./cdn/media/img/PREVIEW_LOGO.png`,class:"blurry-load","data-large":`./cdn/media/img/logo_white.PNG`}),"div",{class:"header-img"}),
  menutab = item[5].parentElement,
  socials = [Instagram({class:"icon",id:"instagram"}),Youtube({class:"icon",id:"youtube",stroke:"url(#gradi-yt)"}),dendros],
  //Link({class:"icon",id:"linktree"})
  entity = ["instagram","youtube","linktree"];
  socials[0].children[0].style.stroke = "none";
  socials[1].children[1].style.stroke = "#FFFFFF";
  

  icon.children[0].setAttributeNS(null,"pointer-events","none");
  icon.children[1].setAttributeNS(null,"pointer-events","none");

  /*async function hideNSeek() {
    let i = 3,
    alpha = socials[0].parentElement.style.opacity,
    tym = ((Math.random() * 3) | 0) || 0;
    
    if (alpha.charCodeAt(0) === 48) {
     await sleep(tym*500); 
      socials[0].parentElement.style.opacity = "1";
      socials[1].parentElement.style.opacity = "1";
      document.getElementsByClassName("social-linktree")[0].style.opacity = "1";
    }
    else {
      await sleep(tym*500);
      socials[0].parentElement.style.opacity = "0";
      socials[1].parentElement.style.opacity = "0";
      document.getElementsByClassName("social-linktree")[0].style.opacity = "0";
    }*/
    /*for (;i;--i) {
      let tym = ((Math.random() * 3) | 0) || 0;
      await sleep(tym*500);
      alpha = socials[3 - i].parentElement.parentElement.style.opacity;
      if (alpha.charCodeAt(0) === 48) socials[3 - i].parentElement.parentElement.style.opacity = "1";
      else socials[3 - i].parentElement.parentElement.style.opacity = "0";
      ;
    }
  }*/
  
  async function collapser() {
    if (isCancelled) {
      console.log("Transition End","\n");
      isCancelled = false;
      return;
    }
    Object.assign(menutab.style, {display:"initial",visibility:"visible"});
    await sleep(200);
    menutab.style.opacity = "1";
  }

  let i,
  nth;
  
  /*window.addEventListener("touchmove", Dbounce(() => {
    hideNSeek();
    clearTimeout(isScrolling);
    isScrolling = setTimeout(hideNSeek, 80);
    window.addEventListener("touchend", throttle(() => {
      setTimeout(hideNSeek,4000);
    }, 800), {once:true});
  }, 800), false);*/
 
  drawer.addEventListener("touchend", () => {
      console.log("Enteredd","\n");
      drawer.addEventListener("transitionend",collapser,{once:true});
  });

  drawer.addEventListener("transitioncancel", () => {
    isCancelled = true;
    console.log("Cancelled","\n");
  });
  drawer.addEventListener("mouseenter", () => {
    if (menutab.style.opacity !== "1") {
      console.log("Entered","\n");
      drawer.addEventListener("transitionend",collapser,{once:true});
    }
  });

  van.add(img,drawer);
  
  icon.innerHTML += "";

  for (i = 3;i;--i) {
    nth = 3 - i;
    van.add(item[nth + 1],htm(socials[nth],"main",{class:`newmedia social-${entity[nth]}`,"data-index":nth}));
    document.getElementById(entity[nth]).addEventListener("touchend",interaction);
    document.getElementById(entity[nth]).addEventListener("click",interaction);
  }
  item[3].innerHTML += "";
  document.getElementById("linktree").addEventListener("touchend",interaction);
  document.getElementById("linktree").addEventListener("click",interaction);

  const top_nav = htm(undefined,"div",{class:"top-nav"});
  van.add(img, top_nav);
  TopNav(top_nav);

  van.add(item[4],htm("","img",{src:`./cdn/media/img/PREVIEW_SUNDOWN.png`,class:"d-ev-music-image blurry-load","data-large":`./cdn/media/img/Sunset.png`}));
  Menu(menutab);
  return img;
}