import {htm} from "./utility.js";
import van from "vanjs-core";
import "@hcaptcha/vanilla-hcaptcha";
import { Form } from "@forms.js/core";
import axios from "axios";

let subscribeform;

export default function Subscribe() {
  window.rqid = false;
  const captcha = htm(undefined,"h-captcha",{"auto-render":"true","id":"captcha","site-key":"e2480948-c1cc-4f46-ac56-81ea236a50c8","size":"compact","tabindex":"0","theme":"dark"}),
  form = htm(undefined, "div");
  
  captcha.addEventListener("verified", function (e) {
    window.rqid = e.token;
    document.getElementById("subscribe-submit-button").disabled = false;
  });
  captcha.addEventListener("error", function (e) {
    window.rqid = false;
    console.log(e.error);
  });

  subscribeform = new Form(form, {
      id: "subscribe-form",
      method:"POST",
      action:"/go/subscribe",
      //className: "pure-form pure-form-stacked",
      schema: [
        {
          id: "mailbox",
          type:"email",
          name:"email",
          label: "Email",
          placeholder: "Ex: User@Website.Ext",
          required: true
        },
        {
          id: "token",
          name: "token",
          type: "hidden"
        },
        {
          id: "subscribe-submit-button",
          type: "button",
          buttonType:"submit",
          template: "Subscribe",
          className: "pure-button-primary pure-button",
        }
     ]
    });
    window.addEventListener("load", function () {
      document.getElementById("subscribe-submit-button").disabled = true;
      document.getElementById("subscribe-form").setAttribute("enctype","multipart/form-data");
      document.getElementById("subscribe-form").classList.add("pure-form","pure-form-stacked");
      document.getElementById("subscribe-form").addEventListener("submit", (e) => {
        e.preventDefault();
        subscribeform.validate();
        if (window.rqid && subscribeform.isValid()) {
          subscribeform.getField("token").setValue(window.rqid);
          e.currentTarget.submit();
        }
      });
      let offspring = document.getElementById("subscribe-form").childNodes;
      van.add(offspring[offspring.length - 2],captcha);
    });
    return form;
}