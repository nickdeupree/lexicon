import { useState, useEffect, useCallback, useRef } from 'react';

export interface TTSOptions {
    voice?: SpeechSynthesisVoice | null;
    rate?: number;
    pitch?: number;
    volume?: number;
}

export const useTTS = (initialText: string = "") => {
    const [text, setText] = useState(initialText);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [volume, setVolume] = useState(1);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [supported, setSupported] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);

    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            setSupported(true);
            const updateVoices = () => {
                const vs = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
                setVoices(vs);
                if (vs.length > 0 && !voice) {
                    // Prefer a local voice or default
                    const defaultVoice = vs.find(v => v.default) || vs[0];
                    setVoice(defaultVoice);
                }
            };

            updateVoices();
            window.speechSynthesis.onvoiceschanged = updateVoices;
            return () => {
                window.speechSynthesis.onvoiceschanged = null;
            }
        }
    }, [voice]);

    const speak = useCallback(() => {
        if (!supported) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        // If we were paused, resume? No, speak starts over or continues.
        // If strictly starting over:

        if (voice) utterance.voice = voice;
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        utterance.onstart = () => {
            setIsPlaying(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentWordIndex(-1);
        };

        utterance.onerror = (e) => {
            console.error("TTS Error", e);
            setIsPlaying(false);
            setIsPaused(false);
        };

        utterance.onpause = () => {
            setIsPaused(true);
            setIsPlaying(false);
        };

        utterance.onresume = () => {
            setIsPlaying(true);
            setIsPaused(false);
        }

        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                // charIndex tells us where the word starts
                // We can use this to find which word we are on if needed.
                // For now, simpler to just expose charIndex or try to map to token
                // But raw character index is most reliable.
                setCurrentWordIndex(event.charIndex);
            }
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [text, voice, rate, pitch, volume, supported]);

    const pause = useCallback(() => {
        if (!supported) return;
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            setIsPaused(true);
            setIsPlaying(false);
        }
    }, [supported]);

    const resume = useCallback(() => {
        if (!supported) return;
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsPlaying(true);
        }
    }, [supported]);

    const stop = useCallback(() => {
        if (!supported) return;
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentWordIndex(-1);
    }, [supported]);

    return {
        text,
        setText,
        play: speak,
        pause,
        resume,
        stop,
        isPlaying,
        isPaused,
        voice,
        setVoice,
        rate,
        setRate,
        pitch,
        setPitch,
        volume,
        setVolume,
        voices,
        supported,
        currentWordIndex // The character index of the current boundary
    };
};
