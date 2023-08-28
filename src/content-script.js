const preEls = document.querySelectorAll("pre");

[...preEls].forEach(el => {

    const root = document.createElement("div");

    root.style.position = "relative";

    const shadowRoot = root.attachShadow({mode: "open"})

    const cssUrl = chrome.runtime.getURL("content-script.css")

    shadowRoot.innerHTML = `<link rel="stylesheet" href="${cssUrl}">`
    const button = document.createElement("button")
    button.innerText = "COPY!!!";
    button.type = "button";

    shadowRoot.prepend(button);

    el.prepend(root);

    const codeEl = el.querySelector("code");
    button.addEventListener("click", () => {
        navigator.clipboard.writeText(codeEl.innerText).then(() => {
            notify()
        });
    })
})

chrome.runtime.onMessage.addListener((req, info, cb) => {
    if (req.action === "copy-all") {
        const allCode = getAllCode();
        navigator.clipboard.writeText(allCode).then(() => {
            cb(allCode);
            notify();
        })
        return true;
    }
})

function getAllCode() {
    return [...preEls].map(preEls => {
        return preEls.querySelector("code").innerText
    }).join("");
}

function notify() {
    const scriptEl = document.createElement("script");
    scriptEl.src = chrome.runtime.getURL("execute.js");

    document.body.appendChild(scriptEl);

    scriptEl.onload = () => {
        scriptEl.remove();
    }
}