import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

const ThemeContext = createContext({
    theme: "system",
    setTheme: () => { },
});

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("system");

    useEffect(() => {
        // Load theme from backend
        const loadTheme = async () => {
            try {
                const response = await api.get("/settings");
                if (response.data.success && response.data.settings?.appearance?.theme) {
                    setTheme(response.data.settings.appearance.theme);
                }
            } catch (error) {
                // If not authenticated or error, use system theme
                console.log("Using system theme");
            }
        };

        loadTheme();
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
