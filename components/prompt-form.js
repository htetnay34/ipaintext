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
  const [isTranslated, setIsTranslated] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    setPrompt(initialPrompt);
    setIsMyanmar(isMyanmarLanguage(initialPrompt));
  }, [initialPrompt]);

  const isMyanmarLanguage = (text) => {
    const myanmarCharacterRegex = /[\u1000-\u109F]/;
    return myanmarCharacterRegex.test(text);
  };

  const handleInputChange = (text) => {
    setPrompt(text);
    setIsMyanmar(isMyanmarLanguage(text));

    // Clear any previous typing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout to trigger translation after 2 seconds of no typing
    setTypingTimeout(
      setTimeout(() => {
        if (isMyanmar) {
          translateToEnglish(text)
            .then((translation) => {
              setPrompt(translation);
              setIsTranslated(true);
            })
            .catch((error) => console.error('Translation error:', error));
        } else {
          setIsTranslated(false);
        }
      }, 2000)
    );
  };

  const translateToEnglish = (text) => {
    return new Promise((resolve, reject) => {
      const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=my&tl=en&dt=t&q=${encodeURIComponent(text)}`;

      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          // Extract the translated text from the response
          if (data && data[0] && data[0][0] && data[0][0][0]) {
            resolve(data[0][0][0]);
          } else {
            reject('Translation to English failed');
          }
        })
        .catch(error => {
          console.error('Translation to English failed:', error);
          reject(error);
        });
    });
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

      <div className={`flex mt-8 ${isTranslated ? 'translated' : ''}`}>
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
        
        <button
          className="bg-black text-white rounded-r-md text-small inline-block p-3 flex-none"
          type="submit"
        >
          Paint
        </button>
      </div>
    </form>
  );
}
