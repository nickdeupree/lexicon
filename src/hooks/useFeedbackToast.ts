import { useState, useEffect, useCallback } from 'react';

export function useFeedbackToast(duration: number = 500) {
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration]);

    const showToast = useCallback((msg: string) => {
        setMessage(msg);
    }, []);

    return { message, showToast };
}
