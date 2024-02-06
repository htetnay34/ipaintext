import { useEffect, useState } from "react";
import Message from "./message";

export default function PromptForm({
  initialPrompt,
  isFirstPrompt,
  onSubmit,
  disabled = false,
}) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isMyanmar, setIsMyanmar] = useState(false);

  useEffect(() => {
    setPrompt(initialPrompt);
    setIsMyanmar(isMyanmarLanguage(initialPrompt));
  }, [initialPrompt]);

  const isMyanmarLanguage = (text) => {
    const myanmarCharacterRegex = /[\u1000-\u109F]/;
    return myanmarCharacterRegex.test(text);
  };

  const translateToEnglish = (text) => {
    return new Promise((resolve, reject) => {
      const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=my&tl=en&dt=t&q=${encodeURIComponent(text)}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data && data[0] && data[0][0] && data[0][0][0]) {
            resolve(data[0][0][0]);
          } else {
            reject('Translation to English failed');
          }
        })
        .catch((error) => {
          console.error('Translation to English failed:', error);
          reject(error);
        });
    });
  };

  const handleInputChange = (text) => {
    setPrompt(text);
    setIsMyanmar(isMyanmarLanguage(text));

    // If the language is Myanmar, trigger translation after a delay
    if (isMyanmar) {
      setTimeout(() => {
        translateToEnglish(text)
          .then((translation) => setPrompt(translation))
          .catch((error) => console.error('Translation error:', error));
      }, 2000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  if (disabled) {
    return null; // or any other fallback for disabled state
  }

  return (
    <form onSubmit={handleSubmit} className="animate-in fade-in duration-700">
      <Message sender="replicate" isSameSender>
        <label htmlFor="prompt-input">
          {isFirstPrompt
            ? "What should we change?"
            : "What should we change now?"}
        </label>
      </Message>

      <div className="flex mt-8">
        <input
          id="prompt-input"
          type="text"
          name="prompt"
          value={prompt}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Your message..."
          className={`block w-full flex-grow${
            disabled ? " rounded-md" : " rounded-l-md"
          }`}
          disabled={disabled}
        />
      </div>
    </form>
  );
}
