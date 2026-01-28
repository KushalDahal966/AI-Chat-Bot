const API_KEY = import.meta.env.VITE_API_KEY;

const chatSection = document.querySelector(".chat-section");
const promptContainer = document.querySelector(".prompt-section-container");
const imagePreview = document.querySelector(".image-preview");
const imageCloseBtn = document.querySelector(".image-close-button");
const imageInputBtn = document.querySelector(".user-input-image");
const imageInput = document.querySelector("#input-image");
const inputArea = document.querySelector(".user-input-field");
const userInput = document.querySelector("#input-text");
const sendBtn = document.querySelector(".send-button");

let imageUrl = null;
let selectedImageFile = null;

const createImage = () => {
    const file = imageInput.files[0];

    if (!file) return;

    selectedImageFile = file;

    imageUrl = URL.createObjectURL(file)
    imagePreview.src = imageUrl;
    imagePreview.style.display = "block";
    imageCloseBtn.style.display = "block";
    imageInputBtn.disabled = true;
    imageInputBtn.style.opacity = 0.5;
    imageInputBtn.style.cursor = "not-allowed";
}

const removeImage = () => {
    if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
        imageUrl = null;
    }

    selectedImageFile = null;

    imagePreview.src = "";
    imagePreview.style.display = "none";
    imageCloseBtn.style.display = "none";
    imageInputBtn.disabled = false;
    imageInputBtn.style.opacity = 1;
    imageInputBtn.style.cursor = "pointer";
}

const toBase64 = () => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(selectedImageFile);
    });
}

const createChatBubble = (type, content, image = null) => {
    const chatBubble = document.createElement("div");
    chatBubble.classList.add(`${type}-chat-section`);

    const imgSrc = type === "user" ? "src/images/user.png" : "src/images/chat-bot.png";
    const imgAlt = type === "user" ? "user image" : "ai image";

    chatBubble.innerHTML = ` <img src="${imgSrc}" class="${type}-image" alt = "${imgAlt}"/>
        <div class="${type}-chat-text">
            ${image ? `<img src="${image}" alt="Uploaded image" />` : ""}
            ${content}
        </div>  
    `;

    chatSection.append(chatBubble);
    return chatBubble;
}

const getResponse = async () => {
    if (!userInput.value) return;

    createChatBubble("user", userInput.value, imageUrl);
    const chatBubble = createChatBubble("ai", `<i class="fa-solid fa-spinner fa-spin"></i>`);

    let parts = [{ text: userInput.value }];

    if (imageUrl) {
        const userImage = await toBase64();

        parts.unshift({
            inlineData: {
                mimeType: selectedImageFile.type,
                data: userImage.split(",")[1],
            },
        });

        removeImage();
    }

    try {
        let response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": `${API_KEY} `,
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts,
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            chatBubble.querySelector(".ai-chat-text").innerHTML = "Something Went Wrong, Try Again";
            userInput.value = "";
        }

        let data = await response.json();

        let text = data.candidates[0].content.parts[0].text;

        text = text.replace(/^#+\s?/gm, "");
        text = text.replace(/\*\*(.*?)\*\*/g, "$1");
        text = text.replace(/\*(.*?)\*/g, "$1");
        text = text.replace(/^\s*[-•]\s*/gm, "");
        text = text.replace(/\n{3,}/g, "\n\n");

        chatBubble.querySelector(".ai-chat-text").innerText = text;

        userInput.value = "";
    } catch (error) {
        chatBubble.querySelector(".ai-chat-text").innerHTML = "Something Went Wrong, Try Again";
        userInput.value = "";
    }
};

sendBtn.addEventListener("click", getResponse);
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") getResponse();
    return;
});

imageCloseBtn.addEventListener("click", removeImage);

imageInput.addEventListener("change", createImage);

imageInputBtn.addEventListener("click", () => {
    imageInput.click();
})

userInput.addEventListener("focus", () => {
    setTimeout(() => {
        promptContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 300);
});