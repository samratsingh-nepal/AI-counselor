// User profile storage
let userProfile = {
    targetCountry: '',
    intendedLevel: '',
    academicPerformance: '',
    studyGap: '',
    englishTestStatus: '',
    fundingPlan: '',
    completed: false
};

// Conversation state
let currentPhase = 'welcome';
let soundEnabled = true;

// DOM Elements
const chatbot = document.getElementById('chatbot');
const chatBody = document.getElementById('chatBody');
const chatInputArea = document.getElementById('chatInputArea');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const typingIndicator = document.getElementById('typingIndicator');
const notificationSound = document.getElementById('notificationSound');

// Initialize conversation
function initConversation() {
    chatBody.innerHTML = '';
    chatInputArea.innerHTML = '';
    currentPhase = 'welcome';
    updateProgress(0, 'Starting conversation...');
    showWelcomePhase();
}

// Phase 1: Welcome
function showWelcomePhase() {
    showTyping(() => {
        addMessage('bot', `👋 Hi! I'm your Study Abroad Assistant.\n\nI can help you understand requirements, costs, scholarships, and visa expectations — based on your profile.\n\n⏱ Takes about 2–3 minutes.`);
        
        showButtons([
            { text: '🎓 Start Profile Setup', action: () => startProfileSetup(), type: 'primary' },
            { text: '👀 Just Exploring', action: () => showTopicSelection() }
        ]);
    });
}

function startProfileSetup() {
    updateProgress(10, 'Profile Setup - Step 1 of 6');
    showCountrySelection();
}

// Phase 2: Profile Collection
function showCountrySelection() {
    showTyping(() => {
        addMessage('bot', '🌍 Which country are you planning to study in?');
        
        showButtons([
            { text: '🇦🇺 Australia', action: () => saveAnswer('targetCountry', 'Australia', showLevelSelection) },
            { text: '🇨🇦 Canada', action: () => saveAnswer('targetCountry', 'Canada', showLevelSelection) },
            { text: '🇬🇧 UK', action: () => saveAnswer('targetCountry', 'UK', showLevelSelection) },
            { text: '🇺🇸 USA', action: () => saveAnswer('targetCountry', 'USA', showLevelSelection) },
            { text: '🇳🇿 New Zealand', action: () => saveAnswer('targetCountry', 'New Zealand', showLevelSelection) },
            { text: '🤔 Not Sure', action: () => saveAnswer('targetCountry', 'Not Sure', showLevelSelection) }
        ]);
    });
}

function showLevelSelection() {
    updateProgress(25, 'Profile Setup - Step 2 of 6');
    showTyping(() => {
        addMessage('bot', '🎓 What level are you planning to study?');
        
        showButtons([
            { text: 'Diploma', action: () => saveAnswer('intendedLevel', 'Diploma', showAcademicPerformance) },
            { text: 'Bachelor\'s', action: () => saveAnswer('intendedLevel', 'Bachelor\'s', showAcademicPerformance) },
            { text: 'Master\'s', action: () => saveAnswer('intendedLevel', 'Master\'s', showAcademicPerformance) },
            { text: 'PhD', action: () => saveAnswer('intendedLevel', 'PhD', showAcademicPerformance) }
        ]);
    });
}

function showAcademicPerformance() {
    updateProgress(40, 'Profile Setup - Step 3 of 6');
    showTyping(() => {
        addMessage('bot', '📊 What best describes your academic result?');
        
        showButtons([
            { text: 'Below Average', action: () => saveAnswer('academicPerformance', 'Below Average', showStudyGap) },
            { text: 'Average', action: () => saveAnswer('academicPerformance', 'Average', showStudyGap) },
            { text: 'Good', action: () => saveAnswer('academicPerformance', 'Good', showStudyGap) },
            { text: 'Strong', action: () => saveAnswer('academicPerformance', 'Strong', showStudyGap) }
        ]);
    });
}

function showStudyGap() {
    updateProgress(55, 'Profile Setup - Step 4 of 6');
    showTyping(() => {
        addMessage('bot', '⏳ Do you have any gap after your last study?');
        
        showButtons([
            { text: 'No Gap', action: () => saveAnswer('studyGap', 'No Gap', showEnglishTestStatus) },
            { text: '1 Year', action: () => saveAnswer('studyGap', '1 Year', showEnglishTestStatus) },
            { text: '2-3 Years', action: () => saveAnswer('studyGap', '2-3 Years', showEnglishTestStatus) },
            { text: 'More than 3 Years', action: () => saveAnswer('studyGap', 'More than 3 Years', showEnglishTestStatus) }
        ]);
    });
}

function showEnglishTestStatus() {
    updateProgress(70, 'Profile Setup - Step 5 of 6');
    showTyping(() => {
        addMessage('bot', '🗣️ What is your English test status?');
        
        showButtons([
            { text: 'IELTS/PTE Completed', action: () => saveAnswer('englishTestStatus', 'Completed', showFundingPlan) },
            { text: 'Booked/Planning', action: () => saveAnswer('englishTestStatus', 'Booked/Planning', showFundingPlan) },
            { text: 'Not Started', action: () => saveAnswer('englishTestStatus', 'Not Started', showFundingPlan) }
        ]);
    });
}

function showFundingPlan() {
    updateProgress(85, 'Profile Setup - Step 6 of 6');
    showTyping(() => {
        addMessage('bot', '💰 How do you plan to fund your studies?');
        
        showButtons([
            { text: 'Parents/Sponsor', action: () => saveAnswer('fundingPlan', 'Parents/Sponsor', showProfileConfirmation) },
            { text: 'Education Loan', action: () => saveAnswer('fundingPlan', 'Education Loan', showProfileConfirmation) },
            { text: 'Combination', action: () => saveAnswer('fundingPlan', 'Combination', showProfileConfirmation) },
            { text: 'Not Sure Yet', action: () => saveAnswer('fundingPlan', 'Not Sure', showProfileConfirmation) }
        ]);
    });
}

function showProfileConfirmation() {
    userProfile.completed = true;
    updateProgress(100, 'Profile Complete!');
    
    showTyping(() => {
        addMessage('bot', `✅ Thanks! I've saved your profile:\n
• Country: ${userProfile.targetCountry}
• Level: ${userProfile.intendedLevel}
• Academic: ${userProfile.academicPerformance}
• Gap: ${userProfile.studyGap}
• English: ${userProfile.englishTestStatus}
• Funding: ${userProfile.fundingPlan}\n\nNow choose what you'd like to know.`);
        
        setTimeout(() => {
            showTopicSelection();
        }, 1000);
    });
}

// Phase 3: Topic Selection
function showTopicSelection() {
    currentPhase = 'topicSelection';
    updateProgress(100, 'Ready to help! Choose a topic:');
    
    showTyping(() => {
        addMessage('bot', 'What would you like to understand better?');
        
        showButtons([
            { text: '💰 Financial Requirements', action: () => showFinancialRequirements(), type: 'primary' },
            { text: '🎓 Scholarships', action: () => showScholarships() },
            { text: '📄 Visa Expectations', action: () => showVisaExpectations() },
            { text: '🗣️ English Test Guidance', action: () => showEnglishGuidance() },
            { text: '📅 Intake & Timelines', action: () => showIntakeTimelines() },
            { text: '🤝 Talk to Counselor', action: () => showCounselorConnection() }
        ]);
    });
}

// Phase 4: Topic-wise Responses
function showFinancialRequirements() {
    showTyping(() => {
        let message = `For your chosen country (${userProfile.targetCountry}) and study level (${userProfile.intendedLevel}), visa officers expect clear evidence that tuition and living costs can be covered for the duration of your studies.`;
        
        if (userProfile.fundingPlan === 'Education Loan') {
            message += `\n\nSince you are planning to use an education loan, it's important that the funding source and repayment ability are clearly explained.`;
        } else if (userProfile.fundingPlan === 'Parents/Sponsor') {
            message += `\n\nIf parents are involved as sponsors, the financial relationship and income stability should also be consistent with your study plan.`;
        } else if (userProfile.fundingPlan === 'Combination') {
            message += `\n\nWith a combination funding approach, ensure each source is properly documented and the total covers all expenses.`;
        }
        
        message += `\n\n💡 Tip: Most countries require proof of funds for 1 year of tuition + living expenses.`;
        
        addMessage('bot', message);
        
        showButtons([
            { text: '🎓 Scholarships', action: () => showScholarships() },
            { text: '📄 Visa Expectations', action: () => showVisaExpectations() },
            { text: '🔙 Back to Menu', action: () => showTopicSelection(), type: 'secondary' }
        ]);
    });
}

function showScholarships() {
    showTyping(() => {
        let message = `Scholarship opportunities depend mainly on academic performance, course level, and institution.\n\n`;
        
        if (userProfile.academicPerformance === 'Strong' || userProfile.academicPerformance === 'Good') {
            message += `With your ${userProfile.academicPerformance.toLowerCase()} academic background, you may be eligible for merit-based scholarships offered directly by universities.`;
        } else {
            message += `While scholarships are competitive, there are still opportunities available. Focus on universities that offer automatic tuition reductions for international students.`;
        }
        
        if (userProfile.intendedLevel === 'Master\'s' || userProfile.intendedLevel === 'PhD') {
            message += `\n\nAt the ${userProfile.intendedLevel} level, research scholarships and teaching assistantships are common.`;
        }
        
        addMessage('bot', message);
        
        showButtons([
            { text: '💰 Financial Requirements', action: () => showFinancialRequirements() },
            { text: '📅 Intake Timelines', action: () => showIntakeTimelines() },
            { text: '🤝 Talk to Counselor', action: () => showCounselorConnection() },
            { text: '🔙 Back to Menu', action: () => showTopicSelection(), type: 'secondary' }
        ]);
    });
}

function showVisaExpectations() {
    showTyping(() => {
        let message = `For ${userProfile.targetCountry}, visa officers closely assess:\n\n`;
        message += `1. **Genuine Student Test**: Is your study plan realistic?\n`;
        message += `2. **Financial Capacity**: Can you afford the studies?\n`;
        message += `3. **English Proficiency**: Can you succeed academically?\n\n`;
        
        if (userProfile.studyGap !== 'No Gap') {
            message += `📝 Since you have a ${userProfile.studyGap.toLowerCase()} study gap, clearly explain how your past activities connect to your future studies.`;
        }
        
        message += `\n\n✅ Your academic background, financial planning, and post-study goals must be consistent and logical.`;
        
        addMessage('bot', message);
        
        showButtons([
            { text: '💰 Financial Requirements', action: () => showFinancialRequirements() },
            { text: '🗣️ English Guidance', action: () => showEnglishGuidance() },
            { text: '🤝 Talk to Counselor', action: () => showCounselorConnection() },
            { text: '🔙 Back to Menu', action: () => showTopicSelection(), type: 'secondary' }
        ]);
    });
}

function showEnglishGuidance() {
    showTyping(() => {
        let message = '';
        
        if (userProfile.englishTestStatus === 'Completed') {
            message += `Great! You've completed your English test. Make sure your scores meet the requirements for your target universities.\n\n`;
        } else if (userProfile.englishTestStatus === 'Booked/Planning') {
            message += `Good progress! Align your test timeline with your intended intake. Most universities need test results before making offers.\n\n`;
        } else {
            message += `Since your English test is still pending, it's important to:\n1. Book your test ASAP\n2. Allow 2-4 weeks for results\n3. Factor this into your application timeline\n\n`;
        }
        
        message += `📊 Score requirements vary:\n`;
        message += `• Diploma/Bachelor's: IELTS 6.0-6.5 / PTE 50-58\n`;
        message += `• Master's/PhD: IELTS 6.5-7.0 / PTE 58-65\n\n`;
        message += `🎯 Tip: Aim for higher scores for scholarship eligibility!`;
        
        addMessage('bot', message);
        
        showButtons([
            { text: '📅 Intake Timelines', action: () => showIntakeTimelines() },
            { text: '🎓 Scholarships', action: () => showScholarships() },
            { text: '🔙 Back to Menu', action: () => showTopicSelection(), type: 'secondary' }
        ]);
    });
}

function showIntakeTimelines() {
    showTyping(() => {
        const intakes = {
            'Australia': ['February', 'July', 'November'],
            'Canada': ['January', 'May', 'September'],
            'UK': ['January', 'September'],
            'USA': ['January', 'August'],
            'New Zealand': ['February', 'July'],
            'Not Sure': ['Varies by country']
        };
        
        const countryIntakes = intakes[userProfile.targetCountry] || ['Varies'];
        
        let message = `📅 Key intake periods for ${userProfile.targetCountry}:\n\n`;
        message += `• Main intakes: ${countryIntakes.join(', ')}\n\n`;
        message += `⏰ Recommended timeline:\n`;
        message += `1. 12-18 months before: Research & shortlist\n`;
        message += `2. 9-12 months before: Take English test\n`;
        message += `3. 6-9 months before: Submit applications\n`;
        message += `4. 3-6 months before: Visa application\n`;
        message += `5. 1-2 months before: Travel preparation\n\n`;
        
        if (userProfile.englishTestStatus === 'Not Started') {
            message += `⚠️ Since you haven't started English test prep, consider the next available intake after allowing 3-4 months for test preparation and results.`;
        }
        
        addMessage('bot', message);
        
        showButtons([
            { text: '🤝 Talk to Counselor', action: () => showCounselorConnection() },
            { text: '🔙 Back to Menu', action: () => showTopicSelection(), type: 'secondary' }
        ]);
    });
}

// Phase 5: Counselor Connection
function showCounselorConnection() {
    showTyping(() => {
        addMessage('bot', `👨‍💼 **Free Counselor Connection Available!**\n\nA specialized counselor can now:\n\n✅ Review your complete profile\n✅ Suggest university shortlists\n✅ Guide you step-by-step\n✅ Help with applications\n\nAll guidance is free and personalized.`);
        
        showButtons([
            { text: '📲 WhatsApp Consultation', action: () => connectViaWhatsApp(), type: 'primary' },
            { text: '📅 Book Appointment', action: () => bookAppointment() },
            { text: '🔙 Back to Menu', action: () => showTopicSelection(), type: 'secondary' }
        ]);
    });
}

function connectViaWhatsApp() {
    const phone = '+1234567890'; // Replace with actual number
    const message = `Hi! I need study abroad consultation. My profile:\nCountry: ${userProfile.targetCountry}\nLevel: ${userProfile.intendedLevel}\nAcademic: ${userProfile.academicPerformance}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    addMessage('user', 'Requested WhatsApp consultation');
    showTyping(() => {
        addMessage('bot', 'Great! A counselor will contact you shortly on WhatsApp. Is there anything else I can help with?');
        setTimeout(showTopicSelection, 1500);
    });
}

function bookAppointment() {
    addMessage('user', 'Requested appointment booking');
    showTyping(() => {
        addMessage('bot', 'Our booking system will open in a new window. You can choose a convenient time slot.');
        // In real implementation, open booking calendar
        setTimeout(() => {
            alert('Booking system would open here in production');
            showTopicSelection();
        }, 1000);
    });
}

// Utility Functions
function saveAnswer(field, value, nextFunction) {
    userProfile[field] = value;
    addMessage('user', value);
    
    if (soundEnabled) {
        notificationSound.currentTime = 0;
        notificationSound.play().catch(e => console.log('Sound play failed:', e));
    }
    
    setTimeout(nextFunction, 500);
}

function showTyping(callback, duration = 800) {
    typingIndicator.style.display = 'inline';
    
    setTimeout(() => {
        typingIndicator.style.display = 'none';
        callback();
    }, duration);
}

function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messageDiv.innerHTML = `${text}<span class="message-time">${time}</span>`;
    
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function showButtons(buttons) {
    chatInputArea.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'buttons-container';
    
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = `option-btn ${btn.type || ''}`;
        button.innerHTML = btn.text;
        button.onclick = btn.action;
        container.appendChild(button);
    });
    
    chatInputArea.appendChild(container);
}

function updateProgress(percent, text) {
    progressFill.style.width = `${percent}%`;
    progressText.textContent = text;
}

// Chat Controls
function openChat() {
    chatbot.style.display = 'flex';
    if (!userProfile.completed) {
        initConversation();
    } else {
        showTopicSelection();
    }
}

function closeChat() {
    chatbot.style.display = 'none';
}

function resetChat() {
    userProfile = {
        targetCountry: '',
        intendedLevel: '',
        academicPerformance: '',
        studyGap: '',
        englishTestStatus: '',
        fundingPlan: '',
        completed: false
    };
    initConversation();
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const icon = document.getElementById('soundIcon');
    icon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add some sample messages if chat is opened
    setTimeout(() => {
        if (window.innerWidth > 768) {
            openChat();
        }
    }, 2000);
});

// Close chat when clicking outside (for mobile)
document.addEventListener('click', (e) => {
    if (!chatbot.contains(e.target) && !e.target.classList.contains('cta-button')) {
        if (window.innerWidth <= 768) {
            closeChat();
        }
    }
});
