import van from "vanjs-core";
import {Route, now,goto} from "./vanjs-router";
import {Loader} from "vanjs-feather";
import {htm} from "./utility";
import {Header} from "./header";
import {Home} from "./home";
//import {Events} from "./events";
import {Booking} from "./booking";
import {Playlists} from "./playlists";
import {Requests} from "./requests";
import {Payment} from "./payment";
import BlurryImageLoad from "./blurry-load";

const wrapper = document.getElementsByClassName("wrapper"),
app = wrapper[0],
siteHeader = Header(wrapper),
blurryLoader = new BlurryImageLoad();

var lastVisited = now.oldVal.split("/",2).join("");

function WebApp(page,args) {
  return Route({
      rule: page.name.toLowerCase(),
      Loader: page,
      onLoad: function () {
        const loading = Loader({class:"icon spinner"}),
        elm = this.element.parentElement;
        loading.style.animationPlayState = "running";
        van.add(siteHeader.parentElement,htm(loading,"main"));
        
        
        loading.addEventListener("animationiteration",function () {
          siteHeader.style.opacity = "0.5";
          loading.style.animationPlayState = "paused";
          loading.classList.remove("spinner");
          loading.classList.add("fadeAway");
          loading.style.animationPlayState = "running";
          const cur = now.rawVal.split("/",2).join("");
        //window.alert(lastVisited);
        //window.alert(cur);
        if (cur !== lastVisited) {
          document.getElementById(lastVisited).style.opacity = "0";
          document.getElementById(lastVisited).addEventListener("transitionend", function () {
            if (parseFloat(this.style.opacity) > 0) return;
            Object.assign(this.style,{display:"none",visibility:"hidden"});
          });
        }
        lastVisited = cur;
          loading.addEventListener("animationend", function () {
            Object.assign(elm.style, {display:"initial",visibility:"visible",opacity:"0"});
            loading.style.animationPlayState = "paused";
            loading.parentElement.remove();
            elm.style.opacity = "1.0";
            siteHeader.style.opacity = "1.0";
            wrapper[1].firstElementChild.style.opacity = "1.0";
            wrapper[2].firstElementChild.style.opacity = "1.0";
            wrapper[3].firstElementChild.style.opacity = "1.0";
          },{once:true});
          blurryLoader.load();
        },{once:true});
        //this.show();
      },
      onFirst: function () {
        //this.hide();
        /* document.addEventListener("DOMContentLoaded", function () {
          van.add(siteHeader.parentElement,htm(loading,"main"));
          loading.style.animationPlayState = "running";
        },{once:true}); */

        /*let prev = now.oldVal.split("/",2).join(""),
        cur = now.rawVal.split("/",2).join("");
        
        if (prev !== cur) {
          document.getElementById(prev).style.opacity = "0";
          document.getElementById(prev).addEventListener("transitionend", function () {
            Object.assign(this.style,{display:"none",visibility:"hidden"});
          });
        }*/


        //van.add(siteHeader.parentElement,htm(loading,"main"));
        //document.getElementsByClassName("spinner")[0].style.animationPlayState = "running";
      }
  });
}
//Pages
const landing = WebApp.bind(this,Home),
//shows = WebApp.bind(this,Events),
contact = WebApp.bind(this,Booking),
listen = WebApp.bind(this,Playlists),
requested = WebApp.bind(this,Requests),
transaction = WebApp.bind(this,Payment);
van.add(app,siteHeader);
van.add(document.getElementById("home"), landing);
//van.add(document.getElementById("events"), shows);
van.add(document.getElementById("booking"), contact);
van.add(document.getElementById("playlists"), listen);
van.add(document.getElementById("song-requests"), requested);
van.add(document.getElementById("payment"), transaction);

/*document.getElementsByClassName("booking-form")[0].addEventListener("verified", (e) => {
    window.rqid = e.token;
    this.lastElementChild.disabled = false;
    window.alert(window.rqid);
  });
  document.getElementsByClassName("booking-form")[0].addEventListener("error", (e) => {
    window.rqid = false;
    window.alert(window.rqid);
  });
  document.getElementsByClassName("booking-form")[0].addEventListener("submit", (e) => {
    e.preventDefault();
    if (window.rqid) this.submit();
});*/