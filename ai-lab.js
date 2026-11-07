/* KARIM SAAB AI LAB — Gemini API Integration */
const GEMINI_API_KEY = "AQ.Ab8RN6LA7baJd3DoL4KA2jyqP_vhGRLJ9DFgmE2I4OonGQZ6jw";

'use strict';
(function() {
  const isAr = () => document.documentElement.lang !== 'en';

  const t = {
    btn: () => isAr() ? '✨ اسأل مساعد الرحلات' : '✨ Ask Travel AI',
    title: () => isAr() ? 'مساعد عبدالكريم الصعب' : 'Karim Saab AI Guide',
    welcome: () => isAr() 
      ? 'مرحباً بك! أنا رفيقك الذكي في أرشيف عبدالكريم الصعب. اسألني عن رحلات الدراجة في أوروبا، قمم الجبال، أو مؤلفات الصعب.'
      : 'Welcome! I am your AI guide to Karim Saab’s archive. Ask me about European cycling trips, mountain summits, or books.',
    placeholder: () => isAr() ? 'اكتب سؤالك هنا…' : 'Ask a question…',
    send: () => isAr() ? 'إرسال' : 'Send'
  };

  function buildContext() {
    if (!window.KARIM_LIBRARY) return '';
    let entries = Object.values(window.KARIM_LIBRARY).map(item => {
      let title = isAr() ? item.ar : item.en;
      let summary = isAr() ? item.summary_ar : item.summary_en;
      return `- ${title}: ${summary}`;
    });
    return 'قاعدة المعرفة المعتمدة:\n' + entries.slice(0, 40).join('\n');
  }

  const widget = document.createElement('div');
  widget.innerHTML = `
    <button id="ks-ai-btn">${t.btn()}</button>
    <div id="ks-ai-modal">
      <div id="ks-ai-header">
        <h3>${t.title()}</h3>
        <button id="ks-ai-close">✕</button>
      </div>
      <div id="ks-ai-messages">
        <div class="ks-msg bot">${t.welcome()}</div>
      </div>
      <div id="ks-ai-input-area">
        <input id="ks-ai-input" type="text" placeholder="${t.placeholder()}" />
        <button id="ks-ai-send">${t.send()}</button>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  const btn = document.getElementById('ks-ai-btn');
  const modal = document.getElementById('ks-ai-modal');
  const close = document.getElementById('ks-ai-close');
  const input = document.getElementById('ks-ai-input');
  const sendBtn = document.getElementById('ks-ai-send');
  const msgs = document.getElementById('ks-ai-messages');

  btn.onclick = () => modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
  close.onclick = () => modal.style.display = 'none';

  async function handleSend() {
    const q = input.value.trim();
    if (!q) return;

    const uDiv = document.createElement('div');
    uDiv.className = 'ks-msg user';
    uDiv.textContent = q;
    msgs.appendChild(uDiv);
    input.value = '';
    msgs.scrollTop = msgs.scrollHeight;

    const bDiv = document.createElement('div');
    bDiv.className = 'ks-msg bot';
    bDiv.textContent = '…';
    msgs.appendChild(bDiv);
    msgs.scrollTop = msgs.scrollHeight;

    try {
      const systemInstruction = `أنت المساعد الذكي لموقع المسافر والكاتب عبدالكريم الصعب. أجب دائماً بلطف واختصار ودقة، مستنداً فقط إلى البيانات التالية دون اختلاق أو مبالغة:\n${buildContext()}`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemInstruction}\n\nالسؤال: ${q}` }] }]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0].content) {
        bDiv.textContent = data.candidates[0].content.parts[0].text;
      } else if (data.error) {
        bDiv.textContent = 'تنبيه من Google: ' + data.error.message;
      } else {
        bDiv.textContent = 'تعذر جلب الإجابة، يرجى مراجعة صلاحية المفتاح.';
      }
    } catch (err) {
      bDiv.textContent = 'حدث خطأ في الاتصال: ' + err.message;
    }
    msgs.scrollTop = msgs.scrollHeight;
  }

  sendBtn.onclick = handleSend;
  input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };
})();
