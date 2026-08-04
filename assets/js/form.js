/* ==========================================================================
   Lead form — validate, capture consent, submit.

   WHERE THE LEAD GOES
   -------------------
   Set ENDPOINT below to the URL that should receive the lead (a GHL inbound
   webhook, a Supabase edge function, anything that accepts a JSON POST).
   Leave it null and the form still works end to end — it validates, captures
   the consent flags with a timestamp, prints the payload to the browser
   console and shows the thank-you panel. Nothing is silently swallowed and
   nothing is faked: with no endpoint set, the status line says so.
   ========================================================================== */

var ENDPOINT = null; // e.g. "https://services.leadconnectorhq.com/hooks/xxxx"

(function () {
  "use strict";

  var form = document.getElementById("lead-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var card = document.getElementById("form-card");
  var button = form.querySelector(".submit");

  function say(message, kind) {
    status.textContent = message;
    status.className = "form-status" + (kind ? " " + kind : "");
  }

  function showThanks(note) {
    card.innerHTML =
      '<div class="form-done">' +
      "<h3>Thank you.</h3>" +
      "<p>Your details are in. I will be in touch shortly.</p>" +
      (note ? '<p style="margin-top:14px;font-size:13px;color:#7a7a7a">' + note + "</p>" : "") +
      "</div>";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var data = new FormData(form);
    var phone = (data.get("phone") || "").toString().trim();
    var email = (data.get("email") || "").toString().trim();

    if (!phone) {
      say("Please enter your phone number.", "error");
      form.phone.focus();
      return;
    }

    // Ten or more digits, ignoring spaces, dashes, brackets and a leading +.
    if (phone.replace(/[^0-9]/g, "").length < 10) {
      say("Please enter a phone number with at least 10 digits.", "error");
      form.phone.focus();
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      say("Please enter a valid email address.", "error");
      form.email.focus();
      return;
    }

    var payload = {
      first_name: (data.get("first_name") || "").toString().trim(),
      last_name: (data.get("last_name") || "").toString().trim(),
      phone: phone,
      email: email,
      consent_marketing_sms: form.consent_marketing.checked,
      consent_transactional_sms: form.consent_transactional.checked,
      consent_text_shown: {
        marketing: form.consent_marketing
          .closest(".consent")
          .querySelector("label")
          .textContent.trim(),
        transactional: form.consent_transactional
          .closest(".consent")
          .querySelector("label")
          .textContent.trim()
      },
      submitted_at: new Date().toISOString(),
      page_url: window.location.href
    };

    if (!ENDPOINT) {
      // No destination configured. Say so plainly rather than pretending a
      // lead was delivered somewhere.
      console.log("[lead-form] no ENDPOINT set — payload was:", payload);
      showThanks("No submission endpoint is configured yet, so this lead was logged to the browser console instead of being sent. Set ENDPOINT in assets/js/form.js.");
      return;
    }

    button.disabled = true;
    say("Sending…");

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        showThanks("");
      })
      .catch(function (error) {
        button.disabled = false;
        say("Something went wrong sending that (" + error.message + "). Please try again.", "error");
        console.error("[lead-form] submit failed", error, payload);
      });
  });
})();
