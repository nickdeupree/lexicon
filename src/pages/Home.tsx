export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 text-center py-10">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                Welcome to Lexicon
            </h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6 text-xl text-muted-foreground max-w-lg">
                The ultimate tool for text-to-speech reading and speed reading training.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md pt-8">
                <a href="/reader" className="flex flex-col items-center p-6 border rounded-lg shadow-sm hover:bg-accent transition-colors">
                    <span className="text-2xl font-bold mb-2">TTS Reader</span>
                    <span className="text-sm text-muted-foreground">Listen to your text with natural voices.</span>
                </a>
                <a href="/speed" className="flex flex-col items-center p-6 border rounded-lg shadow-sm hover:bg-accent transition-colors">
                    <span className="text-2xl font-bold mb-2">Speed Reader</span>
                    <span className="text-sm text-muted-foreground">Train to read faster with RSVP.</span>
                </a>
            </div>
        </div>
    );
}
