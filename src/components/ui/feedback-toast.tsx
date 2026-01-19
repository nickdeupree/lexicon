import React from 'react';

interface FeedbackToastProps {
    message: string | null;
}

export function FeedbackToast({ message }: FeedbackToastProps) {
    if (!message) return null;

    return (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in zoom-in duration-200 pointer-events-none">
            <div className="bg-background text-foreground px-4 py-2 rounded-full text-sm font-bold shadow-lg whitespace-nowrap border border-border">
                {message}
            </div>
        </div>
    );
}
