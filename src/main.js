const API_KEY = import.meta.env.VITE_API_KEY;

const chatSection = document.querySelector(".chat-section");
const promptContainer = document.querySelector(".prompt-section-container");
const imageInputBtn = document.querySelector(".user-input-image");
const imageInput = document.querySelector("#input-image");
const inputArea = document.querySelector(".user-input-text");
const userInput = document.querySelector("#input-text");
const sendBtn = document.querySelector(".send-button");

const showLoading = () => {
    const aiChatBubble = document.createElement("div");
    aiChatBubble.classList.add("ai-chat-section");
    aiChatBubble.innerHTML = `<div class="ai-chat-section">
    <img src="src/images/chat-bot.png" alt="ai image"
    class="ai-image"/> <p class="ai-chat-text"><i class="fa-solid fa-spinner fa-spin"></i>
    </p> </div>`;
    chatSection.append(aiChatBubble);
};

const showChatBubble = () => {
    const userChatBubble = document.createElement("div");
    userChatBubble.classList.add("user-chat-section");
    userChatBubble.innerHTML = `<img src="src/images/user.png" alt="user image" class="user-image" />
    <p class="user-chat-text">${userInput.value}</p>`
    chatSection.append(userChatBubble);
    userInput.value = "";
};

const getResponse = async () => {
    showChatBubble();
    showLoading();
};
hi
sendBtn.addEventListener("click", getResponse);
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") getResponse();
    return;
});

userInput.addEventListener("focus", () => {
    setTimeout(() => {
        promptContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 300);
});