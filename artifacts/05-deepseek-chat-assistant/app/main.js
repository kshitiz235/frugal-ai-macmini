const chatEl = document.getElementById('chat');
const form = document.getElementById('chat-form');
const textarea = document.getElementById('message');
const template = document.getElementById('bubble-template');

const appendBubble = (role, text) => {
  const clone = template.content.cloneNode(true);
  const article = clone.querySelector('.bubble');
  article.classList.toggle('bubble--user', role === 'You');
  clone.querySelector('.bubble__meta').textContent = role;
  clone.querySelector('.bubble__body').innerText = text.trim();
  chatEl.appendChild(clone);
  chatEl.scrollTop = chatEl.scrollHeight;
};

const setLoading = (isLoading) => {
  form.querySelector('button').disabled = isLoading;
  form.querySelector('button').textContent = isLoading ? 'Thinking…' : 'Send';
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = textarea.value.trim();
  if (!message) return;
  appendBubble('You', message);
  textarea.value = '';

  setLoading(true);
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error || 'Request failed');
    }

    const { output } = await response.json();
    appendBubble('DeepSeek', output || 'No answer returned.');
  } catch (error) {
    appendBubble('System', `Error: ${error.message}`);
  } finally {
    setLoading(false);
  }
});
