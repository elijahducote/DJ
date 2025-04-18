import { PDFDocument, StandardFonts } from "pdf-lib";

// Helper function to split text into lines based on maxWidth
function splitTextIntoLines(text, font, size, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];
  
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = font.widthOfTextAtSize(currentLine + ' ' + word, size);
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

// Function to draw multi-line text with wrapping
function drawMultiLineText(page, text, x, startY, font, size, maxWidth, lineHeight) {
  const paragraphs = text.split('\n');
  let y = startY;
  
  for (const paragraph of paragraphs) {
    const lines = splitTextIntoLines(paragraph, font, size, maxWidth);
    for (const line of lines) {
      page.drawText(line, { x, y, font, size, maxWidth, lineHeight });
      y -= lineHeight;
    }
    y -= lineHeight; // Extra space between paragraphs
  }
  return y; // Return final y position for subsequent content
}

// Main function to create the PDF
export async function createPDF(data,signaturePad) {
  // Destructure the data object
  const {
    date,
    djName,
    clientName,
    eventDate,
    startTime,
    endTime,
    venueName,
    venueAddress,
    eventType,
    hours,
    totalFee,
    retainerAmount,
    balanceAmount,
    dueDate,
    paymentMethod,
    cancellationDays,
    setupHours,
    stateProvince,
    countyCity,
  } = data;
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Embed Times Roman font
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  
  // Add three pages
  const page1 = pdfDoc.addPage();
  const page2 = pdfDoc.addPage();
  const page3 = pdfDoc.addPage();
  
  // Get page dimensions
  const { width, height } = page1.getSize();
  
  // Define font sizes and margins
  const titleFontSize = 18;
  const bodyFontSize = 12;
  const margin = 50;
  const maxWidth = width - 2 * margin;
  const lineHeight = bodyFontSize * 1.2;
  
  // **Page 1: Introduction and Sections 1-4**
  let yPosition = height - margin;
  
  // Title
  page1.drawText('DJ PERFORMANCE AGREEMENT', {
    x: margin,
    y: yPosition,
    font: timesRomanFont,
    size: titleFontSize,
  });
  yPosition -= titleFontSize * 1.5;
  
  // Introduction
  const introText = `
  This DJ Performance Agreement ("Agreement") is entered into on ${date}, between ${djName}, hereinafter referred to as "DJ," and ${clientName}, hereinafter referred to as "Client," collectively referred to as "the Parties."
    `;
  yPosition = await drawMultiLineText(
    page1,
    introText.trim(),
    margin,
    yPosition,
    timesRomanFont,
    bodyFontSize,
    maxWidth,
    lineHeight
  );
  
  // Section 1: Event Details
  const eventDetailsText = `
  1. Event Details
  - Event Date: ${eventDate}
  - Event Start Time: ${startTime}
  - Event End Time: ${endTime}
  - Venue Name: ${venueName}
  - Venue Address: ${venueAddress}
  - Event Type: ${eventType}
    `;
  yPosition = await drawMultiLineText(
    page1,
    eventDetailsText.trim(),
    margin,
    yPosition,
    timesRomanFont,
    bodyFontSize,
    maxWidth,
    lineHeight
  );
  
  // Section 2: Services Provided
  const servicesText = `
  2. Services Provided
  The DJ agrees to provide musical entertainment and related services (e.g., sound equipment, lighting, MC services if applicable) for the duration of the event as outlined above. The DJ will perform for a minimum of ${hours} hours, unless otherwise agreed upon in writing.
    `;
  yPosition = await drawMultiLineText(
    page1,
    servicesText.trim(),
    margin,
    yPosition,
    timesRomanFont,
    bodyFontSize,
    maxWidth,
    lineHeight
  );
  
  // Section 3: Compensation
  const compensationText = `
  3. Compensation
  - Total Fee: The total fee for the DJ's services is ${totalFee} USD.
  - Retainer: A non-refundable retainer of 50% of the total fee, amounting to ${retainerAmount} USD, is due upon signing this Agreement to secure the DJ's services for the event date.
  - Balance: The remaining balance of ${balanceAmount} USD is due ${dueDate}.
  - Payment Method: Payments shall be made via ${paymentMethod}.
    `;
  yPosition = await drawMultiLineText(
    page1,
    compensationText.trim(),
    margin,
    yPosition,
    timesRomanFont,
    bodyFontSize,
    maxWidth,
    lineHeight
  );
  
  // Section 4: Non-Refundable Retainer
  const retainerText = `
  4. Non-Refundable Retainer
  The 50% retainer is non-refundable under any circumstances, including but not limited to cancellation by the Client, rescheduling, or unforeseen events. This retainer compensates the DJ for reserving the event date and turning down other bookings.
    `;
  yPosition = await drawMultiLineText(
    page1,
    retainerText.trim(),
    margin,
    yPosition,
    timesRomanFont,
    bodyFontSize,
    maxWidth,
    lineHeight
  );
  
  // **Page 2: Sections 5-12**
  yPosition = height - margin;
  
  // Section 5: Cancellation Policy
  const cancellationText = `
  5. Cancellation Policy
  - If the Client cancels the event more than ${cancellationDays} days prior to the event date, the retainer remains non-refundable, but no additional payment will be due.
  - If the Client cancels within ${cancellationDays} days of the event, the full balance of ${balanceAmount} USD will also be due as liquidated damages, unless a replacement booking is secured by the DJ.
  - If the DJ cancels due to unforeseen circumstances (e.g., illness, emergency), the retainer will be refunded, and the DJ will make reasonable efforts to recommend a substitute DJ of similar skill and reputation.
    `;
  yPosition = await drawMultiLineText(
    page2,
    cancellationText.trim(),
    margin,
    yPosition,
    timesRomanFont,
    bodyFontSize,
    maxWidth,
    lineHeight
  );
  
  // Section 6: Force Majeure
  const forceMajeureText = `
  6. Force Majeure
  Neither party shall be liable for failure to perform due to acts of God, natural disasters, government restrictions, or other events beyond their reasonable control. In such cases, the retainer remains non-refundable, but the Client will not owe the remaining balance.
    `;
  yPosition = await drawMultiLineText(
    page2,
    forceMajeureText.trim(),
    margin,
    yPosition,
    timesRomanFont,
    bodyFontSize,
    maxWidth,
    lineHeight
  );
  
  // Section 7: Equipment and Setup
  const equipmentText = `
  7. Equipment and Setup
  The DJ will provide all necessary equipment, including turntables, speakers, microphones, unless otherwise specified. The Client agrees to provide adequate space, power supply, and access to the venue for setup at least ${setupHours} hour prior to the event start time.
    `;
  yPosition = await drawMultiLineText(
    page2,
    equipmentText.trim(),
    margin,
    yPosition,
    timesRomanFont,
    bodyFontSize,
    maxWidth,
    lineHeight
  );
  
  // Section 8: Performance Conditions
  const performanceConditionsText = `
  8. Performance Conditions
  The Client agrees to ensure a safe working environment for the DJ, including protection from harassment, unsafe conditions, or interference with equipment. The DJ reserves the right to cease performance if conditions become unsafe, without refund of the retainer.
    `;
  yPosition = await drawMultiLineText(
    page2,
    performanceConditionsText.trim(),
    margin,
    yPosition,
    timesRomanFont,
    bodyFontSize,
    maxWidth,
    lineHeight
  );
  
  // Section 9: Music Selection
  const musicSelectionText = `
  9. Music Selection
  The Client may provide a playlist or preferences in advance. The DJ retains artistic discretion to adjust selections based on the event's atmosphere, unless specific songs are mutually agreed upon in writing.
    `;
  yPosition = await drawMultiLineText(
    page2,
    musicSelectionText.trim(),
    margin,
    yPosition,
    timesRomanFont,
    bodyFontSize,
    maxWidth,
    lineHeight
  );
  
  // Section 10: Liability
  const liabilityText = `
  10. Liability
  The DJ is not responsible for damages or injuries caused by guests, venue staff, or equipment provided by the Client or venue. The Client agrees to indemnify the DJ against any claims arising from the event, except in cases of the DJ's gross negligence.
    `;
  yPosition = await drawMultiLineText(
    page2,
    liabilityText.trim(),
    margin,
    yPosition,
    timesRomanFont,
    bodyFontSize,
    maxWidth,
    lineHeight
  );
  
  // Section 11: Governing Law
  const governingLawText = `
  11. Governing Law
  This Agreement shall be governed by the laws of ${stateProvince} and any disputes shall be resolved in ${countyCity} courts.
    `;
  yPosition = await drawMultiLineText(
    page2,
    governingLawText.trim(),
    margin,
    yPosition,
    timesRomanFont,
    bodyFontSize,
    maxWidth,
    lineHeight
  );
  
  // Section 12: Entire Agreement
  const entireAgreementText = `
  12. Entire Agreement
  This document constitutes the entire agreement between the Parties and supersedes any prior agreements or understandings. Any amendments must be made in writing and signed by both Parties.
    `;
  yPosition = await drawMultiLineText(
    page2,
    entireAgreementText.trim(),
    margin,
    yPosition,
    timesRomanFont,
    bodyFontSize,
    maxWidth,
    lineHeight
  );
  
  // **Page 3: Signatures**
  yPosition = height - margin;
  
  // Title
  page3.drawText('Signatures', {
    x: margin,
    y: yPosition,
    font: timesRomanFont,
    size: titleFontSize,
  });
  yPosition -= titleFontSize * 1.5;
  
  // Signatures Section
  const signaturesText = `
  By signing below, the Parties agree to the terms and conditions outlined in this Agreement.
  
  DJ:
  Name: ${djName}
  Signature: ____________________
  Date: ${date}
  
  Client:
  Name: ${clientName}
  Signature: ____________________
  Date: ${date}
    `;
  
  // Draw signatures text and track line positions
  const lines = signaturesText.trim().split('\n');
  let yPositionStart = yPosition;
  for (const line of lines) {
    page3.drawText(line, { x: margin, y: yPosition, font: timesRomanFont, size: bodyFontSize });
    yPosition -= lineHeight;
  }
  
  // Embed DJ's signature image
  const djSignatureBytes = await fetch("/cdn/media/img/signature.png").then((res) => res.arrayBuffer());
  const djSignatureImage = await pdfDoc.embedPng(djSignatureBytes);
  const djSignatureDims = djSignatureImage.scale(0.05); // Scale to 50% size
  
  // Calculate position for DJ's signatureg (first "Signature:" line)
  const signatureIndices = lines
  .map((line, index) => (line.trim().startsWith('Signature:') ? index : -1))
  .filter((index) => index !== -1);
  const djSignatureLineIndex = signatureIndices[0]; // First "Signature:" is for DJ
  const djSignatureY = yPositionStart - djSignatureLineIndex * lineHeight;
  
  page3.drawImage(djSignatureImage, {
    x: margin + 110, // Adjust x position as needed
    y: djSignatureY,
    width: djSignatureDims.width,
    height: djSignatureDims.height,
  });
  
  // Embed client's signature from signaturePad
  const clientSignatureDataUrl = signaturePad.toDataURL(); // Get PNG data URL from signature pad
  const clientSignatureImage = await pdfDoc.embedPng(clientSignatureDataUrl);
  const clientSignatureDims = clientSignatureImage.scale(0.5); // Scale to 50% size
  
  // Calculate position for client's signature (second "Signature:" line)
  const clientSignatureLineIndex = signatureIndices[1]; // Second "Signature:" is for client
  const clientSignatureY = yPositionStart - clientSignatureLineIndex * lineHeight;
  
  page3.drawImage(clientSignatureImage, {
    x: margin + 100, // Adjust x position as needed
    y: clientSignatureY,
    width: clientSignatureDims.width,
    height: clientSignatureDims.height,
  });
  
  // Serialize the PDF to bytes and return
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}


export function closePDFModal() {
  const modal = document.getElementById("pdf-modal");
  const frame = document.getElementById("pdf-frame");
  URL.revokeObjectURL(frame.src);
  frame.src = "";
  modal.style.display = "none";
}

export function batchHide(items) {
  let cur,
  elm,
  i = items.length;
  for (;i;--i) {
    cur = i - 1;
    elm = document.getElementById(items[cur]);
    if (!elm) elm = document.getElementsByClassName(items[cur])[0];
    if (elm.nodeName === "INPUT" || elm.nodeName === "SELECT") {
      elm.required = false;
      elm.disabled = true;
      elm = document.getElementById(items[cur] + "_container");
    }
    if (elm.nodeName === "BUTTON") elm.disabled = true;
    if (!elm) continue;
    elm.style.setProperty("display","none","important");
    elm.style.setProperty("visiblity","hidden","important");
    elm.style.setProperty("opacity","1","important");
    // elm.style.setProperty("user-select","none","important");
    //elm.style.setProperty("pointer-events","none","important");
    //elm.style.setProperty("touch-action","none","important");
  }
}
export function batchShow(items) {
  let cur,
  elm,
  i = items.length;
  for (;i;--i) {
    cur = i - 1;
    elm = document.getElementById(items[cur]);
    if (!elm) elm = document.getElementsByClassName(items[cur])[0];
    if (elm.nodeName === "INPUT" || elm.nodeName === "SELECT") {
      elm.required = true;
      elm.disabled = false;
      elm = document.getElementById(items[cur] + "_container");
    }
    if (elm.nodeName === "BUTTON") elm.disabled = false;
    if (!elm) continue;
    elm.style.setProperty("display","revert","important");
    elm.style.setProperty("visiblity","visible","important");
    elm.style.setProperty("opacity","1","important");
    //  elm.style.setProperty("user-select","initial","important");
    // elm.style.setProperty("pointer-events","initial","important");
    // elm.style.setProperty("touch-action","initial","important");
  }
}