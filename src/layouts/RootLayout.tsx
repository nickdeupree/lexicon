import { useState, useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import { BookOpen, Zap, Home, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RootLayout() {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            if (document.documentElement.classList.contains('dark')) return 'dark';
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
            return 'light';
        }
        return 'light';
    });

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show if we scrolled up, hide if we scrolled down
            // But always show if near the top
            if (currentScrollY < 10) {
                setIsVisible(true);
            } else if (Math.abs(currentScrollY - lastScrollY) > 10) { // Threshold for sensitivity
                setIsVisible(currentScrollY < lastScrollY);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between p-4">
                    <div className="mr-4 flex">
                        <Link to="/" className="mr-6 flex items-center space-x-2">
                            <BookOpen className="h-6 w-6" />
                            <span className="hidden font-bold sm:inline-block">Lexi</span>
                            <span className="font-bold sm:hidden">Lexi</span>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                            <Link to="/reader" className="transition-colors hover:text-foreground/80 text-foreground/60">Reader</Link>
                            <Link to="/speed" className="transition-colors hover:text-foreground/80 text-foreground/60">Speed</Link>
                        </nav>
                    </div>
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container pt-6 pb-20 md:pb-6 mx-auto max-w-screen-md px-4">
                <Outlet />
            </main>

            {/* Mobile Bottom Nav - Floating Dock */}
            <div className={`md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-32'}`}>
                <nav className="flex items-center justify-around bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-2 px-6">
                    <Link to="/reader" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary transition-colors">
                        <BookOpen size={20} />
                        <span className="text-[10px] font-medium mt-1">Read</span>
                    </Link>
                    <Link to="/" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary transition-colors">
                        <Home size={20} />
                        <span className="text-[10px] font-medium mt-1">Home</span>
                    </Link>
                    <Link to="/speed" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary transition-colors">
                        <Zap size={20} />
                        <span className="text-[10px] font-medium mt-1">Speed</span>
                    </Link>
                </nav>
            </div>
        </div>
    );
}
