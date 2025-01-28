import React, { useState } from 'react';
import './Help.css';

const Help = ({ t }) => {
  const [question, setQuestion] = useState('');

  const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;

  const handleSubmit = async () => {
    if (!question.trim()) return;

    const message = `New question:\n${question}`;
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      });
      if(res.ok) {
        alert("Success")
      } else {
        alert("Try again later :(")
      }
      setQuestion('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="help">
      <h1>{t.help}</h1>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={t.askQuestionPlaceholder} 
      />
      <button onClick={handleSubmit}>{t.send}</button>
    </div>
  );
};

export default Help;
