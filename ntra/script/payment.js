import {htm} from "./utility";


// Stripe
import { handleServerResponse } from "./utility.js";
import { v4 as uuid } from "@lukeed/uuid";
import axios from "axios";

// Forms 
import { Form } from "@forms.js/core";
import { formatCurrency } from "./utility.js";
import "@hcaptcha/vanilla-hcaptcha";

// PDF
import SignaturePad from "signature_pad";
import { createPDF, closePDFModal, batchHide, batchShow } from "./service.js";

// DayJS
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.tz.setDefault("America/Lima");


let signaturePad;

const stripe = Stripe("pk_live_51PVFAM07xQtIlHl5nneheqyHshNmnrBOzRIgxXQs6GYp7cmtOWsgQnRlQYwUFez0teYb8OYUlIKi91XLMvEm4gts00iISFGmfg");

let paymentfillout,
portnumbr = "",
srcURL,
idempotencyKey = uuid(),
idempotencyKey2 = uuid(),
idempotencyKey3 = uuid(),
paymentType = "card";

if (window.location.port.length > 1) portnumbr = `:${window.location.port}`;
srcURL = `${window.location.protocol}//${window.location.hostname}${portnumbr}`;

const fontSize = window.getComputedStyle(document.getElementsByClassName("wrapper")[0]).fontSize;


const elements = stripe.elements({
  mode: "payment",
  locale: "en",
  currency: "usd",
  amount: 50, // minium value, update this later
  externalPaymentMethodTypes: [
   "external_line_pay",
   "external_paysafecard",
   "external_samsung_pay",
   "external_sezzle"
  ],
  captureMethod: "automatic_async", // manual automatic_async
  loader: "always",
  appearance: {
    theme: "flat",
    labels: "above",
    disableAnimations: true,
    rules: {
      ".Label": {
        color: "#FFF"
      }
    },
    variables: {
      fontSizeBase: fontSize
    }
  }
}),
paymentElement = elements.create("payment", {
  layout: {
    type: "tabs",
    defaultCollapsed: false
  },
  defaultValues: {
    billingDetails: {
      name: "",
      email: "",
      phone: "",
      address: {
        line1: "",
        city: "",
        state: "TX",
        country: "US",
        postal_code: ""
      }
    }
  },id: "payment-submit",
          type: "button",
          buttonType:"submit",
          template: "Pay",
          className: "pure-button-primary pure-button",
  business: {
    name: "DJ EV"
  }
});
paymentElement.on("change", function(e) {
  paymentType = e.value.type;
});

async function makePDF() {

  const payform = document.getElementById("payment-form"),
  date = dayjs(payform.elements["datentime"].value, "YYYY-MM-DD HH:mm").utc().tz("America/Lima"),
  when = dayjs(date);
  let bal = payform.elements["stripe-amount"].value.indexOf("US$ ");
  if (!bal) ++bal;

  const formatted = parseFloat(payform.elements["stripe-amount"].value.substring(bal*4).split(",").join("")),
  pdfBytes = await createPDF({
    date: dayjs().utc().tz("America/Lima").format("MM-DD-YYYY"),
    djName: "Evan Ducote",
    clientName: payform.elements["givenname"].value?.[0] || "[REDACTED]",
    eventDate: date, 
    startTime: when.format("h:mm A"), 
    endTime: when.add(parseFloat(payform.elements["hoursoptions"].value?.[0] || "0"), "hour").format("h:mm A"),
    venueName: payform.elements["placeof"].value?.[0] || "N/A",
    venueAddress: payform.elements["location"].value?.[0] || "N/A",
    eventType: payform.elements["eventtype"].value?.[0] || "N/A",
    hours: payform.elements["hoursoptions"].value?.[0] || "N/A",
    totalFee: formatted*2 || "N/A",
    retainerAmount: formatted || "N/A",
    balanceAmount: formatted || "N/A",
    dueDate: date,
    paymentMethod: paymentType.split("_").join(" ").toUpperCase(),
    cancellationDays: "30",
    setupHours: "1",
    stateProvince: "Texas",
    countyCity: "Houston-Galveston area"
  },signaturePad),
  blob = new Blob([pdfBytes], { type:"application/pdf"}),
  url = URL.createObjectURL(blob);
  document.getElementById("pdf-frame").src = url;
  document.getElementById("pdf-modal").style.display = "block";
  return blob;
}

export function Payment() {
  window.rqid = false;
  const captcha = htm(undefined,"h-captcha",{"auto-render":"true","id":"captcha","site-key":"e2480948-c1cc-4f46-ac56-81ea236a50c8","size":"compact","tabindex":"0"}),
  paymentForm = htm(undefined, "div");
  
  captcha.addEventListener("verified", function (e) {
    window.rqid = e.token;
    document.getElementById("payment-submit").disabled = false;
  });
  captcha.addEventListener("error", function (e) {
    window.rqid = false;
    console.log(e.error);
  });

  paymentfillout = new Form(paymentForm, {
      id: "payment-form",
      schema: [
        {
          id: "contract-toggle",
          type:"checkbox",
          label: "Contract?",
          toggle: true
          //className:"pure-checkbox"
        },
        {
         id: "stripe-amount",
         type:"text",
         name:"amount",
         label: "Amount",
         placeholder: "Ex: US$ 1,000,000.00...",
         required: true
        },
        {
          id: "token",
          name: "token",
          type: "hidden"
        },
        {
          id: "givenname",
          type:"text",
          name:"givenname",
          label: "Legal Name or Entity",
          placeholder: "Your Name or Company Name",
          required: true
        },
        {
          id: "eventtype",
          type:"text",
          name:"eventtype",
          label: "Type of Event",
          placeholder: "Ex: Jennifer’s 50th Bday Party",
          required: true
        },
        {
          id: "placeof",
          type:"text",
          name: "placeof",
          label: "Name of Event",
          placeholder: "Ex: EvWaveCon",
          required: true
        },
        {
          id: "location",
          type:"text",
          name: "location",
          label: "Address of Event",
          placeholder: "Ex: 1787 Botanical Boulevard, Houston, Texas",
          required: true
        },
        {
          id: "datentime",
          type:"datetime",
          name:"datentime",
          label: "Date & Time of Event",
          enhance: true,
          placeholder: "MM/DD/YY 00:00 AM/PM",
          required: true
        },
        {
          id: "hoursoptions",
          type:"select",
          name: "hoursoptions",
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
          id: "preview-button",
          type: "button",
          template: "View Agreement",
          buttonType: "button",
          className: "pure-button-primary pure-button",
        },
        {
          id: "clear-button",
          type: "button",
          template: "Reset",
          buttonType: "button",
          className: "pure-button-primary pure-button",
        },
        {
          id: "payment-submit",
          type: "button",
          buttonType:"submit",
          template: "Pay",
          className: "pure-button-primary pure-button",
        }
        ]
    });



    window.addEventListener("load", function () {
      batchHide(["givenname","eventtype","placeof","location","datentime","hoursoptions","preview-button","clear-button"]);


      document.getElementById("payment-submit").disabled = 
      true;
      document.getElementById("payment-form").classList.add("pure-form","pure-form-stacked");
      
      
      const form = document.getElementById("payment-form"),
      pay = htm(undefined,"div",{id:"payment-element"}),
      currency = document.getElementById("stripe-amount"),
      pdfviewer = htm([htm("Close","button",{id:"close-pdf"}),htm(undefined,"iframe",{id:"pdf-frame",style:"width:100%; height:90%"})],"div",{style:"position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:100%;height:100%;background:white"});

      van.add(document.getElementById("pdf-viewer"),pdfviewer);

      document.getElementById("clear-button").addEventListener("click", async () => {
        signaturePad.clear();
      });
      
      document.getElementById("preview-button").addEventListener("click", makePDF);
      document.getElementById("close-pdf").addEventListener("click", closePDFModal);
      //currency.setAttribute("pattern","^US\$ \d{1,3}(,\d{3})*(\.\d+)?$");
      currency.setAttribute("autofocus","");
      

      currency.addEventListener("keyup", function() {
            formatCurrency(this);
      });
      currency.addEventListener("blur", function() {
            formatCurrency(this, "blur");
      });

      van.add(form.childNodes[form.childNodes.length - 3],htm(undefined,"br"));
      van.add(form.childNodes[form.childNodes.length - 4],pay);
      van.add(form.childNodes[form.childNodes.length - 4],captcha);
      van.add(form.childNodes[form.childNodes.length - 2],htm(undefined,"div",{id:"payment-message"}));      
      van.add(form.children[form.children.length-2],htm(undefined,"br"));

      paymentElement.mount(pay);

      document.getElementById("payment-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        // elements on the page
        const money = document.getElementById("stripe-amount").value,
        submitBtn = document.getElementById("payment-submit"),
        statusMsg = document.getElementById("payment-message");
        
        statusMsg.textContent = "Processing payment...";
        submitBtn.disabled = true;
        
        

        if (document.getElementById("contract-toggle").checked) {
          const inputData = new FormData(document.getElementById("payment-form"));
          inputData.append("pdf",await makePDF(),"Contract.pdf");
          let resp = await axios.post("/go/contract", inputData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
          });
          window.alert(resp);
        }
        
        let bal = money.indexOf("US$ ");
        if (!bal) ++bal;
        const formatted = money.substring(bal*4).split(",").join(""),
        amount = Math.round((parseFloat(formatted) * 100));
        
        
        
        const {selectedPaymentMethod: payment_method, error: submitError} = await elements.submit();
        
        if (submitError) {
         statusMsg.textContent = submitError.message;
         submitBtn.disabled = false;
         return;
        }
        
        const {confirmationToken: {id: confirmation_token}, error: tokenError} = await stripe.createConfirmationToken({
          elements,
          params: {
            return_url: `${srcURL}/go/message`
          }
        },
        {
          idempotencyKey
        });
        
        /*if (confirmation_token && hasMadeTransaction) return;
        else if (confirmation_token) {
          hasMadeTransaction = true;
        }*/
        
        
        if (tokenError) {
          statusMsg.textContent = tokenError;
          return;
        }
        
        const intent_data = {
            amount,
            confirmation_token,
            payment_method,
            idempotencyKey: idempotencyKey2,
            idempotencyKey1: idempotencyKey3
        };
        const {data: msg, data: status} = await axios.post(`${srcURL}/go/create-intent`,
          intent_data
          ,{
          headers: {
            "Content-Type": "application/json"
          },
          //responseType: "json"
        });
        
        if (status !== "succeeded") {
          idempotencyKey = uuid();
          idempotencyKey2 = uuid();
          idempotencyKey3 = uuid();
        }
        
        /*const {error: {message: confirmError}} = await stripe.confirmPayment({
          elements: elements,
          clientSecret,
          confirmParams: {
            // Return URL where the customer should be redirected after the PaymentIntent is confirmed.
            return_url: "https://example.com"
          }
        });
      
        if (confirmError) statusMsg.textContent = confirmError;*/
        handleServerResponse(msg,stripe);
      });
    });


    paymentForm.addEventListener("change",async()=>{
      if (document.getElementById("contract-toggle").checked) {

        batchShow(["givenname","eventtype","placeof","location", "datentime","hoursoptions","preview-button","clear-button"]);

        if (document.getElementById("signature")) {
          batchShow(["signature","signature-label"]);
          return;
        }
        const payment = document.getElementById("payment-form"),
        canvas = htm(undefined, "canvas", {id:"signature"}),
        label = htm("Signature","p",{class:"form-field-label signature-label"});
  
        van.add(payment.children[payment.children.length-4],label);
        van.add(payment.children[payment.children.length-4],canvas);

        canvas.style.width = "12em";
        canvas.style.height = "4em";
        const canvasSize = canvas.getBoundingClientRect();
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        signaturePad = new SignaturePad(canvas,{
          penColor: "#000",
          backgroundColor: "rgba(0,0,0,0)",
          throttle: 20,
          minWidth: 1,
          maxWidth: 1.875,
          minDistance: 1.5
        });  
      } else batchHide(["givenname","eventtype","placeof","location", "datentime","hoursoptions","preview-button","signature","signature-label","clear-button"]);
      /*function resizeCanvas() {
        ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
        signaturePad.clear(); // otherwise isEmpty() might return incorrect value
      }
                
      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();*/
    });
    return paymentForm;
}