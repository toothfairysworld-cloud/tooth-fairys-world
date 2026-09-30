(async () => {
  const attempts = 6;
  let sawGeneric = 0;
  let sawTooMany = 0;
  let last = "";

  for (let i = 1; i <= attempts; i++) {
    const e = document.getElementById("admin-email");
    const p = document.getElementById("admin-password");
    if (!e || !p) return "FORM_MISSING";
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    ).set;
    setter.call(e, "admin@toothfairysworld.com");
    setter.call(p, "wrong-password-" + i);
    e.dispatchEvent(new Event("input", { bubbles: true }));
    p.dispatchEvent(new Event("input", { bubbles: true }));

    const form = e.closest("form");
    form.querySelector("button[type=submit]").click();
    await new Promise((r) => setTimeout(r, 2500));

    const alert = document.querySelector('[role="alert"]');
    last = alert ? alert.innerText : "";
    if (last.includes("محاولات كثيرة") || last.includes("Too many")) sawTooMany++;
    else if (last) sawGeneric++;
  }

  return JSON.stringify({ sawGeneric, sawTooMany, last });
})()
