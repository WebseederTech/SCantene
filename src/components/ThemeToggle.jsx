import { FaSun, FaMoon } from "react-icons/fa";
import { useState, useEffect } from "react";

const ThemeToggle = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.body.classList.remove("light", "dark");
        document.body.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative inline-flex items-center justify-between w-16 h-8 rounded-full p-1 transition-all duration-300 ease-in-out bg-gray-300 dark:bg-gray-700"
        >
            <span>
                <FaSun
                    className={`absolute right-2 top-2 w-4 h-4 text-yellow-500 transition-all duration-300 ${theme === "light" ? "opacity-100" : "opacity-0"
                        }`}
                />
            </span>
            <span>
                <FaMoon
                    className={`absolute left-2 top-2 w-4 h-4 text-white transition-all duration-300 ${theme === "dark" ? "opacity-100" : "opacity-0"
                        }`}
                />
            </span>
            <span
                className={`absolute w-6 h-6 bg-white dark:bg-gray-900 rounded-full transition-all duration-300 transform ${theme === "light" ? "left-1" : "left-9"
                    }`}
            />
        </button>
    );
};

export default ThemeToggle;