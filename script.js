
function openChat() {
  document.getElementById('chatbot').style.display = 'flex';
}

function closeChat() {
  document.getElementById('chatbot').style.display = 'none';
}

function sendMessage() {
  const input = document.getElementById('userInput');
  const chat = document.getElementById('chatBody');
  if (!input.value) return;

  chat.innerHTML += `<p><strong>You:</strong> ${input.value}</p>`;
  chat.innerHTML += `<p class="bot">Thanks! A counselor-like response will appear here.</p>`;
  input.value = '';
  chat.scrollTop = chat.scrollHeight;
}
