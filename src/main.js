const API_KEY = import.meta.env.VITE_API_KEY;

const chatSection = document.querySelector(".chat-section");
const promptContainer = document.querySelector(".prompt-section-container");
const imageInputBtn = document.querySelector(".user-input-image");
const imageInput = document.querySelector("#input-image");
const inputArea = document.querySelector(".user-input-text");
const userInput = document.querySelector("#input-text");
const sendBtn = document.querySelector(".send-button");

const createChatBubble = (type, content) => {
    const chatBubble = document.createElement("div");
    chatBubble.classList.add(`${type}-chat-section`);

    const imgSrc = type === "user" ? "src/images/user.png" : "src/images/chat-bot.png";
    const imgAlt = type === "user" ? "user image" : "ai image";

    chatBubble.innerHTML = `
        <img src="${imgSrc}" alt="${imgAlt}" class="${type}-image" />
        <p class="${type}-chat-text">${content}</p>
    `;

    chatSection.append(chatBubble);

    return chatBubble;
}

const getResponse = async () => {
    createChatBubble("user", userInput.value);
    const chatBubble = createChatBubble("ai", `<i class="fa-solid fa-spinner fa-spin"></i>`);

    try {
        let response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": `${API_KEY}`,
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: userInput.value }]
                        }
                    ]
                })
            }
        )

        if (!response.ok) {
            chatBubble.querySelector(".ai-chat-text").innerHTML = "Something Went Wrong, Try Again";
        }

        let data = await response.json();

        chatBubble.querySelector(".ai-chat-text").innerHTML = data.candidates[0].content.parts[0].text;

        userInput.value = "";
    } catch (error) {
        chatBubble.querySelector(".ai-chat-text").innerHTML = "Something Went Wrong, Try Again";
    }
};

sendBtn.addEventListener("click", getResponse);
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") getResponse();
    return;
});

imageInputBtn.addEventListener("click", () => {
    alert("Wrok In Progress!");
})

userInput.addEventListener("focus", () => {
    setTimeout(() => {
        promptContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 300);
});