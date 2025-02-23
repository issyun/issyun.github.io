const chatInputField = document.getElementById("chat-input");
const sendButton = document.getElementById("send");
const chatList = document.getElementById("chat-wrapper");
const apiTypeInput = document.getElementById("api-type");
const mngnoInput = document.getElementById("mngno");
const isYouthInput = document.getElementById("is-youth");
const sessionIdDisplay = document.getElementById("session-id");
const sessionResetButton = document.getElementById("reset-session");

const baseUrl = "http://atfuturelab.sogang.ac.kr:40000";

let sessionId = null;

// TODO add support for unsafe modules

async function sendChat() {
    const question = chatInputField.value;
    if (!question) return;

    chatInputField.disabled = true;
    sendButton.disabled = true;

    chatInputField.value = "";
    const chat = document.createElement("div");
    chat.classList.add("chat");
    chat.classList.add("chat-user");
    chat.textContent = question;
    chatList.appendChild(chat);

    const apiType = apiTypeInput.value;
    const mngno = mngnoInput.value;
    const isYouth = isYouthInput.checked;

    let url, request;

    if (apiType === "mngno") {
        url = baseUrl + "/mngno";
        request = {
            session_id: sessionId,
            mngno: mngno,
            is_youth: isYouth,
            question: question
        };

    } else if (apiType === "general") {
        url = baseUrl + "/general";
        request = {
            session_id: sessionId,
            question: question,
            is_youth: isYouth
        };
    }

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(request)
    });

    const res = await response.json();
    const answer = res.answer;
    const mngnos = res.mngnos;
    sessionId = res.session_id;

    sessionIdDisplay.textContent = sessionId;

    const resBlock = document.createElement("div");
    resBlock.classList.add("chat");
    resBlock.classList.add("chat-agent");
    resBlock.textContent = answer;
    chatList.appendChild(resBlock);

    chatInputField.disabled = false;
    sendButton.disabled = false;
}

async function resetSession() {
    if (!sessionId) return;
    const url = baseUrl + "/flush";
    const request = {
        session_id: sessionId
    };
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(request)
    });

    sessionId = null;
    sessionIdDisplay.textContent = "";
    chatList.innerHTML = "";
}

sendButton.addEventListener("click", sendChat);
chatInputField.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        sendChat();
    }
});

apiTypeInput.addEventListener("change", () => {
    if (apiTypeInput.value === "mngno") {
        mngnoInput.disabled = false;
    } else {
        mngnoInput.disabled = true;
    }
});

sessionResetButton.addEventListener("click", () => {
    resetSession();
});