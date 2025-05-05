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
  requests: document.getElementById("song-requests"),
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

var lastVisited = window.location.pathname.substring(1) || "home";

transitionStage = [false,false,false];

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
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
        window.isNavigating = false;
      },{once:true});
      blurryLoader.load();
    },{once:true});
    
    console.log(elm);
    //van.add(document.getElementById("home"), page);
  });
}

async function fadeMenu(valU) {
  const percentage = Math.round(valU * 100),
  arrow = document.getElementById("drawer");

  if (percentage < 75) {
    if (arrow.classList.contains("aloft")) return;
    arrow.classList.add("aloft");
    
    wrapper[1].firstElementChild.addEventListener("transitionend",function(){
      transitionStage[0] = false;
      this.style.setProperty("display","none","important");
      this.style.setProperty("visiblity","hidden","important");
      this.style.setProperty("opacity","0","important");
    },{once:true});

    wrapper[2].firstElementChild.addEventListener("transitionend",function(){
      transitionStage[1] = false;
      this.style.setProperty("display","none","important");
      this.style.setProperty("visiblity","hidden","important");
      this.style.setProperty("opacity","0","important");
    },{once:true});

    wrapper[3].firstElementChild.addEventListener("transitionend",function(){
      transitionStage[2] = false;
      this.style.setProperty("display","none","important");
      this.style.setProperty("visiblity","hidden","important");
      this.style.setProperty("opacity","0","important");
    },{once:true});


    await sleep(200);
    wrapper[1].firstElementChild.addEventListener("transitionstart",function(){
      transitionStage[0] = true;
    },{once:true});

    wrapper[2].firstElementChild.addEventListener("transitionstart",function(){
      transitionStage[1] = true;
    },{once:true});

    wrapper[3].firstElementChild.addEventListener("transitionstart",function(){
      transitionStage[2] = true;
    },{once:true});
    wrapper[1].firstElementChild.style.setProperty("opacity","0","important");
    wrapper[2].firstElementChild.style.setProperty("opacity","0","important");
    wrapper[3].firstElementChild.style.setProperty("opacity","0","important");
  }
  else {
    if (!arrow.classList.contains("aloft")) return;
    arrow.classList.remove("aloft");

    wrapper[1].firstElementChild.addEventListener("transitionend",function(e){
      transitionStage[0] = false;
    },{once:true});

    wrapper[2].firstElementChild.addEventListener("transitionend",function(e){
      transitionStage[1] = false;
    },{once:true});

    wrapper[3].firstElementChild.addEventListener("transitionend",function(e){
      transitionStage[2] = false;
    },{once:true});

    wrapper[1].firstElementChild.style.setProperty("display","revert","important");
    wrapper[1].firstElementChild.style.setProperty("visiblity","visible","important");

    wrapper[2].firstElementChild.style.setProperty("display","revert","important");
    wrapper[2].firstElementChild.style.setProperty("visiblity","visible","important");

    wrapper[3].firstElementChild.style.setProperty("display","revert","important");
    wrapper[3].firstElementChild.style.setProperty("visiblity","visible","important");

    await sleep(200);
    wrapper[1].firstElementChild.addEventListener("transitionstart",function(e){
      transitionStage[0] = true;
    },{once:true});

    wrapper[2].firstElementChild.addEventListener("transitionstart",function(e){
      transitionStage[1] = true;
    },{once:true});

    wrapper[3].firstElementChild.addEventListener("transitionstart",function(e){
      transitionStage[2] = true;
    },{once:true});
    wrapper[1].firstElementChild.style.setProperty("opacity","1","important");
    wrapper[2].firstElementChild.style.setProperty("opacity","1","important");
    wrapper[3].firstElementChild.style.setProperty("opacity","1","important");
  }
}

document.getElementsByClassName("container")[3].addEventListener("scrollend", throttle(function() {
  console.log("Tesg");
  const elm = document.getElementsByClassName("container")[3];
  let height = elm.scrollTop / (elm.scrollHeight - elm.clientHeight);

  if (!transitionStage[0] && !transitionStage[1] && !transitionStage[2]) fadeMenu(Math.min(Math.max(0,1-height),1));
  
},200));

window.addEventListener("popstate", locate);

locate();