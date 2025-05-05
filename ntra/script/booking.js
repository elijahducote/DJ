import {htm} from "./utility";
import van from "vanjs-core";
import "@hcaptcha/vanilla-hcaptcha";
import { Form } from "@forms.js/core";
import axios from "axios";

let fillout;

export default function Booking() {
  window.rqid = false;
  const captcha = htm(undefined,"h-captcha",{"auto-render":"true","id":"captcha","site-key":"e2480948-c1cc-4f46-ac56-81ea236a50c8","size":"compact","tabindex":"0","theme":"dark"}),
  bookingForm = htm(undefined, "div");
  
  captcha.addEventListener("verified", function (e) {
    window.rqid = e.token;
    document.getElementById("submit-button").disabled = false;
  });
  captcha.addEventListener("error", function (e) {
    window.rqid = false;
    console.log(e.error);
  });

  fillout = new Form(bookingForm, {
      id: "form",
      method:"POST",
      action:"/go/resend",
      //className: "pure-form pure-form-stacked",
      schema: [
        {
          id: "date",
          type:"datetime",
          name:"date",
          label: "Date of Event",
          enhance: true,
          placeholder: "MM/DD/YY 00:00 AM/PM",
          required: true
        },
        {
         id: "email",
         type:"email",
         name:"email",
         label: "Email",
         placeholder: "Username@Website.Ext",
         required: true
        },
        {
          id: "attachment",
          type:"file",
          name:"attachment",
          options:{
            fileSizeBase: 1024,
            allowBrowse: true,
            storeAsFile: true,
            checkValidity: true,
            maxFiles: 1,
            dropValidation: true
          },
          label: "Attachment?",
          required: false,
          enhanced: true
        },
        {
          id: "event",
          type:"text",
          name:"event",
          label: "Type of Event",
          placeholder: "Ex: Jennifer’s 50th Bday Party",
          required: true
        },
        {
          id: "locale",
          type:"text",
          name: "locale",
          label: "Address of Event",
          placeholder: "Ex: 1787 Botanical Boulevard, Houston, Texas",
          required: true
        },
        {
          id: "workhrs",
          type:"select",
          name: "workhrs",
          label: "Hours",
          enhance: true,
          multiple: false,
          required: true,
          options: {
            plugins: ["remove_button","checkbox_options"]
          },
          placeholder: "Choose from the selection.",
          optionsList: [
            {
              value: "1",
              label: "1 hour",
            },
            {
              value: "2",
              label: "2 hours",
            },
            {
              value: "3 hours",
              label: "3 hours",
            },
            {
              value: "4",
              label: "4 hours",
            }
          ],
        },
        {
          id: "selection",
          type:"select",
          name: "selection",
          label: "Type of Music",
          enhance: true,
          multiple: true,
          required: true,
          options: {
            plugins: ["remove_button","checkbox_options"]
          },
          placeholder: "Choose as many from the selection.",
          optionsList: [
            {
              value: "Open Format",
              label: "Open Format",
            },
            {
              value: "Lo-Fi",
              label: "Lo-Fi",
            },
            {
              value: "Pop",
              label: "Pop",
            },
            {
              value: "Rock",
              label: "Rock",
            },
            {
              value: "R&B",
              label: "R&B",
            },
            {
              value: "Hip-Hop/Rap",
              label: "Hip-Hop/Rap",
            },
            {
              value: "Disco",
              label: "Disco",
            },
            {
              value: "Oldies",
              label: "Oldies",
            },
            {
              value: "Motown",
              label: "Motown",
            },
            {
              value: "Indie",
              label: "Indie",
            },
            {
              value: "Jazz",
              label: "Jazz",
            },
            {
              value: "Techno/House",
              label: "Techno/House",
            },
            {
              value: "Dubstep",
              label: "Dubstep",
            },
          ],
        },
        {
          id: "requests",
          type:"textarea",
          name: "requests",
          label: "Requests?",
          placeholder: "List Artist and Song; or send link playlist (website, Spotify, YouTube)",
          required: false
        },
        {
          id:"dislikes",
          type:"textarea",
          name:"dislikes",
          label:"Dislikes?",
          placeholder:"Songs or artists that you do not want to be played.",
          required: false
        },
        {
         id: "comments",
         type:"textarea",
         name:"comments",
         label: "Comments?",
         placeholder: "Please list anything or any notes that you want DJ EV to know beforehand.",
         required: false
        },
        {
          id: "token",
          name: "token",
          type: "hidden"
        },
        {
          id: "subscribe-toggle",
          type:"checkbox",
          label: "Subscribe?",
          toggle: true
          //className:"pure-checkbox"
        },
        {
          id: "submit-button",
          type: "button",
          buttonType:"submit",
          template: "Submit",
          className: "pure-button-primary pure-button",
        }
        /*{
          id:"button-group",
          type:"group",
          schema:[
            {
              id: "submit-button",
              type:"button",
              label: "Submit",
              className: "pure-button-primary pure-button"
            },
          ]
        },*/
        ]
    });
    window.addEventListener("load", function () {
      document.getElementById("submit-button").disabled = true;
      document.getElementById("form").setAttribute("enctype","multipart/form-data");
      document.getElementById("form").classList.add("pure-form","pure-form-stacked");
      document.getElementById("form").addEventListener("submit", async (e) => {
        e.preventDefault();
        fillout.validate();
        if (document.getElementById("subscribe-toggle").checked) {
          const inputData = new FormData(document.getElementById("form"));
          inputData.append("htoken", window.rqid);
          const resp = await fetch("/go/subscribe", {
            method: "POST",
            body: inputData
          });
        }
        if (window.rqid && fillout.isValid()) {
          fillout.getField("token").setValue(window.rqid);
          e.currentTarget.submit();
        }
      });
      let offspring = document.getElementById("form").childNodes;
      van.add(offspring[offspring.length- 2],captcha);
    });
    return bookingForm;
}