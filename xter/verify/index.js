import axios from "axios";

exports.handler = function (event) {
  try {
    const {body: {token}} = event,
    params = new URLSearchParams();
    
    let captchaVerify;
      
    params.append("secret", process.env.HCAPTCHA_SECRET);
    params.append("response", token);
      
    await axios.post("https://api.hcaptcha.com/siteverify", params).then((resp) => {
      captchaVerify = resp.data.success;
    }).catch((err) => {
      captchaVerify = false;
    });
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {captchaVerify}
    }
  }
  catch (err) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: {captchaVerify:false}
    }
  }
}