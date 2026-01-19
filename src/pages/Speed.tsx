import { useSpeedReader } from "@/hooks/useSpeedReader";
import { useFeedbackToast } from "@/hooks/useFeedbackToast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FeedbackToast } from "@/components/ui/feedback-toast";
import { Play, Pause, Square, Clipboard as ClipboardIcon } from "lucide-react";

export default function Speed() {
    const {
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
    } = useSpeedReader("Welcome to Lexi. This tool uses Rapid Serial Visual Presentation to help you read faster.");

    const { message: toastMsg, showToast } = useFeedbackToast();

    const handleDisplayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;

        if (x < width / 3) {
            // Left side: Slow down
            const newWpm = Math.max(10, wpm - 10);
            setWpm(newWpm);
            showToast(`${newWpm} WPM`);
        } else if (x > (2 * width) / 3) {
            // Right side: Speed up
            const newWpm = wpm + 10;
            setWpm(newWpm);
            showToast(`${newWpm} WPM`);
        } else {
            // Middle: Play/Pause
            if (isPlaying) {
                pause();
                showToast("Paused");
            } else {
                play();
                showToast("Playing");
            }
        }
    };

    const handleWpmChange = (vals: number[]) => {
        setWpm(vals[0]);
    };

    const progress = totalWords > 0 ? ((currentIndex + 1) / totalWords) * 100 : 0;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold">Speed Reader</h1>
                    <p className="text-muted-foreground">High-velocity reading training (RSVP).</p>
                </div>
            </div>

            <div className="grid gap-6">

                {/* Display Area */}
                <Card
                    className="min-h-[300px] flex flex-col justify-center items-center bg-secondary/20 cursor-pointer select-none relative"
                    onClick={handleDisplayClick}
                >
                    {/* Feedback Toast */}
                    <FeedbackToast message={toastMsg} />

                    <div className="absolute inset-0 flex">
                        <div className="h-full w-1/3 hover:bg-primary/5 transition-colors" title="Slow down (-10 WPM)"></div>
                        <div className="h-full w-1/3 hover:bg-primary/5 transition-colors" title="Play / Pause"></div>
                        <div className="h-full w-1/3 hover:bg-primary/5 transition-colors" title="Speed up (+10 WPM)"></div>
                    </div>
                    <CardContent className="p-4 md:p-10 w-full text-center relative z-10 pointer-events-none flex items-center justify-center min-h-[300px]">
                        {isPlaying || isPaused ? (
                            <div className="w-full">
                                <div className={`font-black tracking-tight font-mono text-primary break-words hyphens-auto ${currentWord.length <= 5
                                    ? "text-6xl md:text-8xl"
                                    : currentWord.length <= 8
                                        ? "text-5xl md:text-7xl"
                                        : currentWord.length <= 12
                                            ? "text-4xl md:text-6xl"
                                            : "text-3xl md:text-5xl"
                                    }`}>
                                    {currentWord}
                                </div>

                                {/* Static Progress Indicator at bottom */}
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mt-2">
                                        {currentIndex + 1} <span className="opacity-50">/</span> {totalWords}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-muted-foreground">Press Play to Start</div>
                        )}
                    </CardContent>
                </Card>

                {/* Controls */}
                <Card>
                    <CardHeader>
                        <CardTitle>Controls</CardTitle>
                        <CardDescription>Adjust speed and input text.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label>Speed: {wpm} WPM</Label>
                            </div>
                            <Slider
                                min={10}
                                max={1000}
                                step={10}
                                value={[wpm]}
                                onValueChange={handleWpmChange}
                            />
                        </div>

                        <div className="flex items-center justify-center space-x-4">
                            {!isPlaying && !isPaused ? (
                                <Button size="lg" onClick={play} disabled={!text}>
                                    <Play className="mr-2 h-5 w-5" /> Start
                                </Button>
                            ) : null}

                            {isPlaying ? (
                                <Button size="lg" variant="secondary" onClick={pause}>
                                    <Pause className="mr-2 h-5 w-5" /> Pause
                                </Button>
                            ) : null}

                            {isPaused ? (
                                <Button size="lg" onClick={play}>
                                    <Play className="mr-2 h-5 w-5" /> Resume
                                </Button>
                            ) : null}

                            <Button size="lg" variant="destructive" onClick={stop} disabled={!isPlaying && !isPaused}>
                                <Square className="mr-2 h-5 w-5 fill-current" /> Stop
                            </Button>
                        </div>

                        <div className="space-y-2 pt-4">
                            <div className="flex justify-between items-center">
                                <Label>Text to Read</Label>
                                <Button variant="ghost" size="sm" onClick={async () => {
                                    try {
                                        const text = await navigator.clipboard.readText();
                                        setText(text);
                                    } catch (err) {
                                        console.error('Failed to read clipboard contents: ', err);
                                    }
                                }} className="h-6 text-xs">
                                    <ClipboardIcon className="mr-1 h-3 w-3" /> Paste
                                </Button>
                            </div>
                            <Textarea
                                className="min-h-[150px] resize-y"
                                placeholder="Enter text to speed reader..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
