import {htm} from "./utility";
import "@hcaptcha/vanilla-hcaptcha";
import { Form } from "@forms.js/core";
import axios from "axios";

let inputform;

export function Requests() {
  window.rqid = false;
  const captcha = htm(undefined,"h-captcha",{"auto-render":"true","id":"captcha","site-key":"e2480948-c1cc-4f46-ac56-81ea236a50c8","size":"compact","tabindex":"0"}),
  requestForm = htm(undefined, "div");
  
  captcha.addEventListener("verified", function (e) {
    window.rqid = e.token;
    document.getElementById("requests-submit-button").disabled = false;
  });
  captcha.addEventListener("error", function (e) {
    window.rqid = false;
    console.log(e.error);
  });

  inputform = new Form(requestForm, {
      id: "request-form",
      method:"POST",
      action:"/go/request",
      //className: "pure-form pure-form-stacked",
      schema: [
        {
          id: "artist",
          type:"text",
          name:"artist",
          label: "Artist?",
          placeholder: "Ex: EV WAVE",
          required: false
        },
        {
          id: "song",
          type:"text",
          name:"song",
          label: "Song?",
          placeholder: "Ex: Sunshine of My Life",
          required: false
        },
        {
          id: "url",
          type:"url",
          name:"url",
          label: "Link?",
          placeholder: "Ex: https://open.spotify.com/album/1dt05UBROzpddBt6cTfouB",
          required: false
        },
        {
          id: "token",
          name: "token",
          type: "hidden"
        },
        {
          id: "requests-submit-button",
          type: "button",
          buttonType:"submit",
          template: "Submit",
          className: "pure-button-primary pure-button",
        }
     ]
    });
    window.addEventListener("load", function () {
      document.getElementById("requests-submit-button").disabled = true;
      document.getElementById("request-form").setAttribute("enctype","multipart/form-data");
      document.getElementById("request-form").classList.add("pure-form","pure-form-stacked");
      document.getElementById("request-form").addEventListener("submit", (e) => {
        e.preventDefault();
        inputform.validate();
        if (window.rqid && inputform.isValid()) {
          inputform.getField("token").setValue(window.rqid);
          e.currentTarget.submit();
        }
      });
      let offspring = document.getElementById("request-form").childNodes;
      van.add(offspring[offspring.length - 2],captcha);
    });
    return requestForm;
}