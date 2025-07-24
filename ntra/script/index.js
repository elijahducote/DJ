import van from "vanjs-core";
import {Loader} from "vanjs-feather";
import {htm,sleep,throttle} from "./utility.js";
import {Header,updateNavIcons} from "./header.js";
import BlurryImageLoad from "./blurry-load.js";
import Router from "universal-router";

const wrapper = document.getElementsByClassName("wrapper"),
app = wrapper[0],
siteHeader = Header(wrapper),
pages = {
  home: document.getElementById("home"),
  booking: document.getElementById("booking"),
  playlists: document.getElementById("playlists"),
  requests: document.getElementById("requests"),
  subscribe: document.getElementById("subscribe"),
  payment: document.getElementById("payment"),
},
routes = [{
  path: "/",
  action: async () => await getRoute("home")
},
{
  path: "booking",
  action: async () => await getRoute("booking")
},
{
  path: "playlists",
  action: async () => await getRoute("playlists")
},
{
  path: "requests",
  action: async () => await getRoute("requests")
},
{
  path: "subscribe",
  action: async () => await getRoute("subscribe")
},
{
  path: "payment",
  action: async () => await getRoute("payment")
}],
router = new Router(routes),
blurryLoader = new BlurryImageLoad();


window.isNavigating = false;
window.docState = new Event("popstate");
window.docContact = new Event("click");
window.docLoad = new Event("load");

var lastVisited = window.location.pathname.substring(1) || "home",
hasBrowsedMostContent = false,
transitionStage = [false,false,false];

wrapper[1].firstElementChild.addEventListener("transitionstart",function(e){
  if (hasBrowsedMostContent) transitionStage[0] = true;
  else return;
  e.target.style.setProperty("display","revert","important");
  e.target.style.setProperty("visiblity","visible","important");
});

wrapper[2].firstElementChild.addEventListener("transitionstart",function(e){
  if (hasBrowsedMostContent) transitionStage[1] = true;
  else return;
  e.target.style.setProperty("display","revert","important");
  e.target.style.setProperty("visiblity","visible","important");
});

wrapper[3].firstElementChild.addEventListener("transitionstart",function(e){
  if (hasBrowsedMostContent) transitionStage[2] = true;
  else return;
  e.target.style.setProperty("display","revert","important");
  e.target.style.setProperty("visiblity","visible","important");
});

wrapper[1].firstElementChild.addEventListener("transitionend",function(e){
  if (hasBrowsedMostContent) transitionStage[0] = false;
  else return;
  e.target.style.setProperty("display","none","important");
  e.target.style.setProperty("visiblity","hidden","important");
});
  
wrapper[2].firstElementChild.addEventListener("transitionend",function(e){
  if (hasBrowsedMostContent) transitionStage[1] = false;
  else return;
  e.target.style.setProperty("display","none","important");
  e.target.style.setProperty("visiblity","hidden","important");
});
  
wrapper[3].firstElementChild.addEventListener("transitionend",function(e){
  if (hasBrowsedMostContent) transitionStage[2] = false;
  else return;
  e.target.style.setProperty("display","none","important");
  e.target.style.setProperty("visiblity","hidden","important");
});

van.add(app,siteHeader);

async function getRoute (name) {
  if (!pages[name].childElementCount) {
    const {default: Page} = await import(`./${name}.js`);
    return Page();
  }
  return pages[name].firstElementChild;
}

function locate() {
  if (window.isNavigating) return;
  window.isNavigating = true;
  updateNavIcons();
  router.resolve(window.location.pathname.substring(1) || "/").then(page => {
    const path = window.location.pathname.substring(1) || "home";
    if (document.getElementById(path).childElementCount === 0) van.add(document.getElementById(path), page);
    const loading = Loader({class:"icon spinner"}),
    elm = page.parentElement;
    loading.style.animationPlayState = "running";
    van.add(siteHeader.parentElement,htm(loading,"main"));
  
    loading.addEventListener("animationiteration",function () {
      siteHeader.style.opacity = "0.5";
      loading.style.animationPlayState = "paused";
      loading.classList.remove("spinner");
      loading.classList.add("fadeAway");
      loading.style.animationPlayState = "running";
  
      if (path !== lastVisited) {
        document.getElementById(lastVisited).style.opacity = "0";
        document.getElementById(lastVisited).addEventListener("transitionend", function () {
          if (parseFloat(this.style.opacity) > 0) return;
          Object.assign(this.style,{display:"none",visibility:"hidden",zIndex:"-999"});
        });
      }
      lastVisited = path;
      loading.addEventListener("animationend", function () {
        Object.assign(elm.style, {display:"initial",visibility:"visible",opacity:"0",zIndex:"initial"});
        loading.style.animationPlayState = "paused";
        loading.parentElement.remove();
        elm.style.opacity = "1.0";
        siteHeader.style.opacity = "1.0";
        wrapper[1].firstElementChild.style.opacity = "1.0";
        wrapper[2].firstElementChild.style.opacity = "1.0";
        wrapper[3].firstElementChild.style.opacity = "1.0";
        window.dispatchEvent(window.docLoad);
        window.isNavigating = false;
        document.getElementsByClassName("container")[3].scrollTo(
        {
            top: 0,
            behavior: "smooth"
        });
      },{once:true});
      blurryLoader.load();
    },{once:true});
    
    console.log(elm);
    //van.add(document.getElementById("home"), page);
  });
}

async function fadeMenu(valU) {
  const percentage = Math.round(valU * 100);
  
  hasBrowsedMostContent = true;
  
  if (percentage < 50) {
    hasBrowsedMostContent = true;
    document.getElementById("drawer").classList.add("aloft");

    wrapper[1].firstElementChild.style.setProperty("display","revert","important");
    wrapper[1].firstElementChild.style.setProperty("visiblity","visible","important");
    wrapper[2].firstElementChild.style.setProperty("display","revert","important");
    wrapper[2].firstElementChild.style.setProperty("visiblity","visible","important");
    wrapper[3].firstElementChild.style.setProperty("display","revert","important");
    wrapper[3].firstElementChild.style.setProperty("visiblity","visible","important");



    await sleep(100);

    wrapper[1].firstElementChild.style.setProperty("opacity","0","important");
    wrapper[2].firstElementChild.style.setProperty("opacity","0","important");
    wrapper[3].firstElementChild.style.setProperty("opacity","0","important");
  }
  else {
    hasBrowsedMostContent = false;
    document.getElementById("drawer").classList.remove("aloft");

    wrapper[1].firstElementChild.style.setProperty("display","revert","important");
    wrapper[1].firstElementChild.style.setProperty("visiblity","visible","important");
    wrapper[2].firstElementChild.style.setProperty("display","revert","important");
    wrapper[2].firstElementChild.style.setProperty("visiblity","visible","important");
    wrapper[3].firstElementChild.style.setProperty("display","revert","important");
    wrapper[3].firstElementChild.style.setProperty("visiblity","visible","important");


    await sleep(100);

    wrapper[1].firstElementChild.style.setProperty("opacity","1","important");
    wrapper[2].firstElementChild.style.setProperty("opacity","1","important");
    wrapper[3].firstElementChild.style.setProperty("opacity","1","important");
  }
}

document.getElementsByClassName("container")[3].addEventListener("scrollend", throttle(function() {
  const elm = document.getElementsByClassName("container")[3];
  let height = elm.scrollTop / (elm.scrollHeight - elm.clientHeight);

  if (!transitionStage[0] && !transitionStage[1] && !transitionStage[2]) fadeMenu(Math.min(Math.max(0,1-height),1));
  
},500));

window.addEventListener("popstate", locate);

locate();