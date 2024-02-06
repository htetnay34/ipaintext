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

  const isEnglishLanguage = (text) => {
    const englishCharacterRegex = /^[A-Za-z0-9\s.,?!]+$/;
    return englishCharacterRegex.test(text);
  };

  const handleInputChange = (text) => {
    setPrompt(text);
    setIsMyanmar(isMyanmarLanguage(text));

    // If the language is English, show the "Paint" button
    if (isEnglishLanguage(text)) {
      setIsMyanmar(false);
    } else {
      // If the language is Myanmar, trigger translation after a delay
      if (isMyanmar) {
        setTimeout(() => {
          translateToEnglish(text)
            .then((translation) => setPrompt(translation))
            .catch((error) => console.error('Translation error:', error));
        }, 2000);
      }
    }
  };

  const translateToEnglish = (text) => {
    // Assume you have a translation function here (like the previous examples)
    return Promise.resolve(`Translated: ${text}`);
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
        
        {isMyanmar || !isEnglishLanguage(prompt) || disabled ? null : (
          <button
            className="bg-black text-white rounded-r-md text-small inline-block p-3 flex-none"
            type="submit"
          >
            Paint
          </button>
        )}
      </div>
    </form>
  );
}
