import { useState } from "react";


export const useTranslation = () => {
    const [translation, setTranslation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Use Lingva Translate (Google Translate scraper) for better reliability
    const translate = async (text, sourceLang, targetLang) => {
        if (!text) return;
        console.log("text", text);
        console.log("sourceLang", sourceLang);
        console.log("targetLang", targetLang);

        // Strip region codes to get 2-letter language codes (e.g. 'en-US' -> 'en')
        const source = sourceLang.split('-')[0];
        const target = targetLang.split('-')[0];

        if (source === target) {
            setTranslation(text);
            return text;
        }

        setLoading(true);
        setError(null);

        try {
            // Lingva Translate API
            const url = `https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(text)}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.translation) {
                setTranslation(data.translation);
                return data.translation;
            } else {
                throw new Error('Translation failed');
            }
        } catch (err) {
            console.error("Translation error:", err);

            // Fallback to MyMemory if Lingva fails
            try {
                console.log("Falling back to MyMemory API...");
                const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.responseStatus === 200) {
                    setTranslation(data.responseData.translatedText);
                    return data.responseData.translatedText;
                } else {
                    throw new Error('Fallback failed');
                }
            } catch (fallbackErr) {
                console.error("Fallback translation error:", fallbackErr);
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        translate,
        translation,
        loading,
        error
    }

}   