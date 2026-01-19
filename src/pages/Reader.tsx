import { useTTS } from "@/hooks/useTTS";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Play, Pause, Square, Clipboard as ClipboardIcon } from "lucide-react";

export default function Reader() {
    const {
        text,
        setText,
        play,
        pause,
        resume,
        stop,
        isPlaying,
        isPaused,
        voice,
        setVoice,
        rate,
        setRate,
        voices,
        supported
    } = useTTS("Welcome to Lexi. Paste your text here to begin reading.");

    if (!supported) {
        return (
            <div className="text-center p-10 text-destructive">
                Text-to-Speech is not supported in this browser.
            </div>
        );
    }

    const handleRateChange = (vals: number[]) => {
        setRate(vals[0]);
    };

    const handleVoiceChange = (voiceURI: string) => {
        const selectedVoice = voices.find(v => v.voiceURI === voiceURI);
        if (selectedVoice) setVoice(selectedVoice);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold">Reader</h1>
                <p className="text-muted-foreground">Listen to your text with natural voices.</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardContent className="pt-6 space-y-2">
                        <div className="flex justify-end">
                            <Button variant="ghost" size="sm" onClick={async () => {
                                try {
                                    const text = await navigator.clipboard.readText();
                                    setText(text);
                                } catch (err) {
                                    console.error('Failed to read clipboard contents: ', err);
                                }
                            }} className="h-8 text-xs">
                                <ClipboardIcon className="mr-2 h-4 w-4" /> Paste
                            </Button>
                        </div>
                        <Textarea
                            className="min-h-[300px] text-lg leading-relaxed resize-y"
                            placeholder="Enter text to read..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Controls</CardTitle>
                        <CardDescription>Adjust voice settings and playback.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="voice-select">Voice</Label>
                                <Select value={voice?.voiceURI} onValueChange={handleVoiceChange}>
                                    <SelectTrigger id="voice-select">
                                        <SelectValue placeholder="Select a voice" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {voices.map((v) => (
                                            <SelectItem key={v.voiceURI} value={v.voiceURI}>
                                                {v.name} ({v.lang})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Speed: {rate}x</Label>
                                <Slider
                                    min={0.5}
                                    max={2}
                                    step={0.1}
                                    value={[rate]}
                                    onValueChange={handleRateChange}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-center space-x-4 pt-4">
                            {/* Play / Pause / Resume Logic */}
                            {!isPlaying && !isPaused ? (
                                <Button size="lg" onClick={play} disabled={!text}>
                                    <Play className="mr-2 h-5 w-5" /> Play
                                </Button>
                            ) : null}

                            {isPlaying ? (
                                <Button size="lg" variant="secondary" onClick={pause}>
                                    <Pause className="mr-2 h-5 w-5" /> Pause
                                </Button>
                            ) : null}

                            {isPaused ? (
                                <Button size="lg" onClick={resume}>
                                    <Play className="mr-2 h-5 w-5" /> Resume
                                </Button>
                            ) : null}

                            <Button size="lg" variant="destructive" onClick={stop} disabled={!isPlaying && !isPaused}>
                                <Square className="mr-2 h-5 w-5 fill-current" /> Stop
                            </Button>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
