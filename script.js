const chatBox = document.getElementById('chat-box');
const optionsContainer = document.getElementById('options-container');

// 2026 Knowledge Base
const data = {
    start: ["Canada", "USA", "UK", "Australia", "Japan"],
    topics: ["Admissions and Scholarship", "Financial Documentation"],
    details: {
        "Canada": {
            "Admissions": "For 2026, most colleges require IELTS 6.0/6.5 or PTE 58+. Deadlines for Fall are typically Feb-March.",
            "Scholarship": "Lester B. Pearson and university-specific entrance awards are available for Nepali students with 3.5+ GPA."
        },
        "Australia": {
            "Admissions": "Focus on the 'Genuine Student' (GS) requirement. IELTS 6.0 for UG is standard for 2026.",
            "Financial Documentation": "Mandatory: Bank balance showing approx. NPR 45-55 Lakhs from A-class banks."
        },
        "Common": {
            "Financial Documentation": "All Nepali students must obtain a No Objection Certificate (NOC) from the MoEST portal (NPR 2,000 fee)."
        }
    }
};

let currentSelection = { country: "", topic: "" };

function showOptions(options, callback) {
    optionsContainer.innerHTML = "";
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => callback(opt);
        optionsContainer.appendChild(btn);
    });
}

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function startChat() {
    showOptions(data.start, (country) => {
        currentSelection.country = country;
        addMessage(country, "user");
        addMessage(`Great! What information about ${country} do you need?`, "bot");
        
        showOptions(data.topics, (topic) => {
            currentSelection.topic = topic;
            addMessage(topic, "user");
            
            if (topic === "Admissions and Scholarship") {
                showOptions(["Admissions", "Scholarship"], (sub) => {
                    addMessage(sub, "user");
                    const info = data.details[country]?.[sub] || "Details coming soon for 2026.";
                    addMessage(info, "bot");
                    showOptions(["Start Over"], () => location.reload());
                });
            } else {
                const info = data.details[country]?.["Financial Documentation"] || data.details["Common"]["Financial Documentation"];
                addMessage(info, "bot");
                showOptions(["Start Over"], () => location.reload());
            }
        });
    });
}

startChat();
