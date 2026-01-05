// Added Nepal-specific topics to the main menu
function showTopicSelection() {
  updateProgress(100, 'Ready to help!');
  updateStatus('Choose a topic');

  addMessage('bot', '📚 What would you like to understand better?');

  showActionButtons([
    { text: '💰 Financial Requirements', action: () => showFinancialRequirements(), type: 'primary', icon: 'fas fa-money-check-alt' },
    { text: '🎓 Scholarships & Funding', action: () => showScholarships(), icon: 'fas fa-award' },
    { text: '📄 Visa & Documentation', action: () => showVisaExpectations(), icon: 'fas fa-file-contract' },
    { text: '🗣️ English Test Guidance', action: () => showEnglishGuidance(), icon: 'fas fa-language' },
    { text: '🇳🇵 NOC Process Guide', action: () => showNOCGuide(), icon: 'fas fa-passport' },
    { text: '📋 Nepal Documents', action: () => showNepalDocuments(), icon: 'fas fa-file-alt' },
    { text: '⭐ Profile Strength', action: () => showProfileStrength(), icon: 'fas fa-chart-line' },
    { text: '🏆 Success Stories', action: () => showSuccessStories(), icon: 'fas fa-trophy' },
    { text: '🤝 Talk to Counselor', action: () => showCounselorConnection(), icon: 'fas fa-headset' }
  ]);
}

// New NOC Guide function
function showNOCGuide() {
  updateStatus('NOC Guidance');

  addMessage('bot', `🇳🇵 **NOC (No Objection Certificate) Guide**\n\nTo pay fees from Nepal, you MUST have an NOC from the Ministry of Education.\n\n📝 **Process:**\n1. Apply online at the MOEST NOC portal\n2. Required: Offer letter, citizenship copy\n3. Fee: NPR 2,000 per country/level\n\n⚠️ **Important:**\n• Apply immediately after receiving offer letter\n• Processing takes 7-15 working days\n• Keep digital and printed copies\n\n🔗 **Official Link:**\nhttps://noc.moest.gov.np`);

  showActionButtons([
    { text: '🇳🇵 Nepal Bank Loans', action: () => showNepalBankInfo(), icon: 'fas fa-university' },
    { text: '📄 Visa Documents', action: () => showVisaExpectations(), icon: 'fas fa-file-alt' },
    { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
  ]);
}

// Nepal Document Checklist
function showNepalDocuments() {
  updateStatus('Nepal-Specific Docs');

  addMessage('bot', `📋 **Nepal-Specific Document Checklist**\n\n📑 **Mandatory Documents:**\n✅ Citizenship Certificate (notarized English translation)\n✅ Birth Certificate (notarized English translation)\n✅ Relationship Certificates (if sponsored by parents)\n✅ Academic Certificates (transcript, character certificate)\n✅ Police Clearance Certificate\n\n🏦 **Bank Specifics:**\n• Nabil Bank - Education Loan specialists\n• Global IME - Balance certificate experts\n• SBI Nepal - Popular for student loans\n\n💡 **Tip:** Get documents translated by registered translators only`);

  showActionButtons([
    { text: '🇳🇵 NOC Process', action: () => showNOCGuide(), icon: 'fas fa-passport' },
    { text: '💰 Financial Planning', action: () => showFinancialRequirements(), icon: 'fas fa-calculator' },
    { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
  ]);
}

// Nepal Bank Information
function showNepalBankInfo() {
  updateStatus('Nepal Bank Info');

  addMessage('bot', `🏦 **Nepal Bank Guide for Education Loans**\n\n**Top Banks for Students:**\n\n🏆 **Nabil Bank**\n• Special education loan packages\n• Collateral: 100% of loan amount\n• Rate: 8-10% p.a.\n\n🏆 **Global IME Bank**\n• Fast balance certificates\n• Good forex rates\n• Multiple branch verification\n\n🏆 **SBI Nepal**\n• Parent bank in India\n• Easy remittance to India/Australia\n• Education loan specialists\n\n📝 **Requirements:**\n• Collateral (property/fixed deposit)\n• Income proof of co-applicant\n• Admission letter from university`);

  showActionButtons([
    { text: '📋 Document Checklist', action: () => showNepalDocuments(), icon: 'fas fa-file-alt' },
    { text: '💰 Financial Planning', action: () => showFinancialRequirements(), icon: 'fas fa-calculator' },
    { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
  ]);
}

// Profile Strength Evaluation
function showProfileStrength() {
  updateStatus('Profile Evaluation');

  const score = calculateProfileScore();
  const feedback = getProfileFeedback(score);

  addMessage('bot', `⭐ **Your Profile Strength: ${score}/10**\n\n${feedback}\n\n📊 **Breakdown:**\n• Academic: ${getAcademicScore()}/3\n• English: ${getEnglishScore()}/3\n• Planning: ${getPlanningScore()}/3\n• Gap: ${getGapScore()}/1`);

  showActionButtons([
    { text: '🎓 Improve Profile', action: () => showImprovementTips(), icon: 'fas fa-chart-line-up' },
    { text: '🗣️ English Test Help', action: () => showEnglishGuidance(), icon: 'fas fa-language' },
    { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
  ]);
}

function calculateProfileScore() {
  let score = 5; // Base score
  
  // Academic Performance
  if (userProfile.academicPerformance === 'Strong') score += 3;
  else if (userProfile.academicPerformance === 'Good') score += 2;
  else if (userProfile.academicPerformance === 'Average') score += 1;
  
  // English Test
  if (userProfile.englishTestStatus === 'Completed') score += 3;
  else if (userProfile.englishTestStatus === 'Booked') score += 2;
  
  // Study Gap
  if (userProfile.studyGap === 'No Gap') score += 1;
  else if (userProfile.studyGap === 'More than 3 Years') score -= 1;
  
  // Funding Plan
  if (userProfile.fundingPlan === 'Family Sponsor') score += 1;
  else if (userProfile.fundingPlan === 'Education Loan') score += 1;
  
  return Math.min(10, Math.max(1, score));
}

function getProfileFeedback(score) {
  if (score >= 9) return '🎉 **Excellent Profile!** You have strong chances at top universities. Focus on application essays and references.';
  if (score >= 7) return '👍 **Good Profile!** You are competitive for most programs. Work on strengthening your statement of purpose.';
  if (score >= 5) return '📝 **Average Profile.** Consider improving English scores or getting work experience to strengthen application.';
  return '💡 **Needs Improvement.** We recommend:\n1. Boost English test scores\n2. Consider pathway programs\n3. Stronger financial documentation';
}

// Success Stories
function showSuccessStories() {
  updateStatus('Success Stories');

  addMessage('bot', `🏆 **Success Stories from Nepal**\n\n👨‍🎓 **Sushant from Kathmandu**\n• GPA: 3.2/4.0 | IELTS: 7.0\n• Admitted: Monash University (Australia)\n• Key: Strong personal statement + internship experience\n\n👩‍🎓 **Anjali from Pokhara**\n• Gap: 2 years | No English test initially\n• Admitted: Centennial College (Canada)\n• Key: Pathway program + strong recommendation letters\n\n👨‍🎓 **Rajan from Butwal**\n• Academic: Average | PTE: 65\n• Admitted: University of Auckland\n• Key: Professional work experience + clear career goals`);

  showActionButtons([
    { text: '⭐ Check My Profile', action: () => showProfileStrength(), icon: 'fas fa-chart-line' },
    { text: '🤝 Talk to Counselor', action: () => showCounselorConnection(), icon: 'fas fa-headset' },
    { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
  ]);
}

// Updated Visa Expectations with official links
function showVisaExpectations() {
  updateStatus('Visa Guidance');

  const gap = userProfile.studyGap || 'No Gap';

  addMessage('bot', `📄 **Visa Requirements for Nepali Students**\n\n📑 **Key Documents:**\n✅ University offer letter\n✅ Financial proof (bank statement last 6 months)\n✅ English test results (IELTS/PTE)\n✅ Genuine student statement (SOP)\n✅ Police clearance certificate\n✅ Health insurance\n\n${gap !== 'No Gap' ? `📝 **Gap Explanation:** Since you have a ${gap.toLowerCase()}, prepare a detailed explanation letter with supporting documents.` : ''}\n\n🔗 **Official Resources:**\n• Australia: https://immi.homeaffairs.gov.au\n• Canada: https://www.canada.ca/en/immigration-refugees-citizenship.html\n• UK: https://www.gov.uk/student-visa\n• USA: https://www.ustraveldocs.com/np\n• VFS Nepal: https://visa.vfsglobal.com/npl/en`);

  showActionButtons([
    { text: '🇳🇵 NOC Process', action: () => showNOCGuide(), icon: 'fas fa-passport' },
    { text: '📋 Nepal Documents', action: () => showNepalDocuments(), icon: 'fas fa-file-alt' },
    { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
  ]);
}
