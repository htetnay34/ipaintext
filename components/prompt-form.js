import { useEffect, useState } from "react";
import Message from "./message";
import langdetect from "langdetect";

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
    detectLanguage(initialPrompt);
  }, [initialPrompt]);

  const detectLanguage = (text) => {
    const detectedLanguage = langdetect.detectOne(text);
    setIsMyanmar(detectedLanguage === "my");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPrompt("");
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
          onChange={(e) => {
            setPrompt(e.target.value);
            detectLanguage(e.target.value);
          }}
          placeholder="Your message..."
          className={`block w-full flex-grow${
            disabled ? " rounded-md" : " rounded-l-md"
          }`}
          disabled={disabled}
        />

        {isMyanmar || disabled ? null : (
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
