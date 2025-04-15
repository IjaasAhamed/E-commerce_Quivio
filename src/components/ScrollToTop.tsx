import { useState, useEffect } from "react";
import Top from '../assets/top.png';

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollPercent, setScrollPercent] = useState(0);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

    const handleScroll = () => {
        const scrollY = window.scrollY;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const percent = (scrollY / windowHeight) * 100;

        setScrollPercent(percent);

        if (scrollY > 300) {
            setIsVisible(true);
            setIsAnimatingOut(false);
        } else {
            setIsAnimatingOut(true);
            setTimeout(() => {
                setIsVisible(false);
            }, 300);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const circleRadius = 23;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const progressOffset = circleCircumference - (scrollPercent / 100) * circleCircumference;

    console.log("log:", isAnimatingOut);

    return (
        <div
            style={{
                position: 'fixed',
                bottom: isVisible ? '25px' : '-80px',
                right: '20px',
                display: 'block',
                cursor: 'pointer',
                transition: 'bottom 0.3s ease-in-out',
            }}
            onClick={scrollToTop}
        >
            <svg width="55" height="55">
                <circle
                    cx="27.5" // Adjusted cx
                    cy="27.5" // Adjusted cy
                    r={circleRadius}
                    stroke="#e0e0e0"
                    strokeWidth="3"
                    fill="#ffffff"
                />
                <circle
                    cx="27.5" // Adjusted cx
                    cy="27.5" // Adjusted cy
                    r={circleRadius}
                    stroke="#155dfc"
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={progressOffset}
                    style={{ transition: 'stroke-dashoffset 0.3s' }}
                    transform="rotate(-90 27.5 27.5)"
                />
                <image
                    href={Top}
                    x="15"
                    y="15"
                    width="25"
                    height="25"
                />
            </svg>
        </div>
    );
};