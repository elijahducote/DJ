import van from "vanjs-core";
let oldGross,
intentSecret,
intentInterval;

export function Dbounce(func, delay) {
  let timeout;
  return function() {
    const context = this,
    args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

export function throttle(functN, Dlay) {
  let pre = 0;
  return function() {
    if (Date.now() - pre > Dlay) {
      pre = Date.now();
      return functN.apply(this, arguments);
    } 
  }
}

export function htm(content,nomer,attr) {
  const args = [];
  if (attr) args[0] = attr;
  if (!nomer) nomer = "span";
  if (Array.isArray(content)) {
    let itR8 = content.length,
    nth = itR8;
    for (;itR8;--itR8) {
      args.push(content[nth - itR8]);
    }
  }
  else args.push(content);
  return van.tags[nomer].apply(null,args);
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function refreshStatus(stripe) {
  const {paymentIntent: {status}} = await stripe.retrievePaymentIntent(intentSecret);
  console.log(status);
  return status;
}

export async function handleServerResponse (response,stripe) {
  const statumMsg = document.getElementById("payment-message");
  if (intentSecret) response.status = await refreshStatus(stripe);
  
  console.log(response.status);
  if (response.error) {
    // Show error from server on payment form
    statumMsg.textContent = `Something is amiss: ${JSON.stringify(response.error)}!`;
  } else if (response.status === "requires_action") {
    // Use Stripe.js to handle the required next action
    const {
      error,
      paymentIntent: {client_secret, status, id}
    } = await stripe.handleNextAction({
      clientSecret: response.client_secret
    });

    if (error) {
      // Show error from Stripe.js in payment form
      statumMsg.textContent = `Something is amiss: ${error.message}!`;
    } else {
      intentSecret = client_secret;
      //intentInterval = setInterval(,1000);

      if (status === "requires_action") {
        statumMsg.textContent = "Payment cancelled prematurely!";
        return handleServerResponse(response,stripe);
      }
      statumMsg.textContent = `Payment successful!!`;
      window.location.href = `/go/message?id=${id}`;
      // Actions handled, show success message
    }
  } else if (response.status === "succeeded") {
    // No actions needed, show success message
    statumMsg.textContent = `Payment successful!`;
    window.location.href = `/go/message?id=${id}`;
  }
}

function formatNumber(n) {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculateGrossAmount(netAmount) {
  // Define Stripe fee structure
  if (!netAmount) netAmount = .5;
  const percent = 2.9,
  fixed = .30,
  grossAmount = (netAmount + fixed) / (1 - percent / 100);
  return Math.round(grossAmount * 100) / 100; // Round to 2 decimal places
}

export function formatCurrency(input, blur) {
    // appends $ to value, validates decimal side
    // and puts cursor back in right position.
    // don't validate empty input
    if (input.value === "") return;
    // get input value
    var input_val = input.value,
    newVal = parseFloat(input_val.substring(4)),
    grossNew = calculateGrossAmount(newVal);
    if (blur === "blur") {
    if (oldGross !== newVal) {
      input_val = "US$ " + grossNew.toString();
      oldGross = grossNew;
    }
    else return;
    }
    
    
    // original length
    var original_len = input_val.length,
    // initial caret position 
    caret_pos = input.selectionStart;

    // check for decimal
    if (input_val.indexOf(".") >= 0) {
        // get position of first decimal
        // this prevents multiple decimals from
        // being entered
        var decimal_pos = input_val.indexOf("."),
        // split number by decimal point
        left_side = input_val.substring(0, decimal_pos),
        right_side = input_val.substring(decimal_pos);

        // add commas to left side of number
        left_side = formatNumber(left_side);

        // validate right side
        right_side = formatNumber(right_side);

        // On blur make sure 2 numbers after decimal
        if (blur === "blur") right_side += "00";

        // Limit decimal to only 2 digits
        right_side = right_side.substring(0, 2);

        // join number by .
        input_val = "US$ " + left_side + "." + right_side;

    } else {
        // no decimal entered
        // add commas to number
        // remove all non-digits
        input_val = formatNumber(input_val);
        input_val = "US$ " + input_val;
        
        // final formatting
        if (blur === "blur" && input_val.length === 4) input_val += "0.50";
        else if (blur === "blur") input_val += ".00";
    }

    // send updated string to input
    input.value = input_val;
    // put caret back in the right position
    var updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input.setSelectionRange(caret_pos, caret_pos);
}