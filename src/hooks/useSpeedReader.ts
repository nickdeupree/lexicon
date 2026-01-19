import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeedReader(initialText: string = "") {
    const [text, setText] = useState(initialText);
    const [wpm, setWpm] = useState(300);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const words = text.split(/\s+/).filter(w => w.length > 0);
    const totalWords = words.length;
    const currentWord = words[currentIndex] || "";

    const timerRef = useRef<number | null>(null);

    const stop = useCallback(() => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentIndex(0);
        if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const pause = useCallback(() => {
        setIsPlaying(false);
        setIsPaused(true);
        if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const play = useCallback(() => {
        // If we were stopped or finished, start from 0.
        // If we were paused, resume from current position.
        if (!isPaused && !isPlaying) {
            setCurrentIndex(0);
        }
        setIsPlaying(true);
        setIsPaused(false);
    }, [isPaused, isPlaying]);

    useEffect(() => {
        if (isPlaying) {
            const interval = 60000 / wpm;
            timerRef.current = window.setInterval(() => {
                setCurrentIndex((prev) => {
                    if (prev >= totalWords - 1) {
                        // Use a small delay before stopping to show the last word
                        setTimeout(stop, interval);
                        return prev;
                    }
                    return prev + 1;
                });
            }, interval);
        } else {
            if (timerRef.current) {
                window.clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }

        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current);
        };
    }, [isPlaying, wpm, totalWords, stop]);

    return {
        text,
        setText,
        wpm,
        setWpm,
        isPlaying,
        isPaused,
        currentWord,
        currentIndex,
        totalWords,
        play,
        pause,
        stop
    };
}
