import { cn } from "@/utils/classnames";
import { SVGAttributes } from "react";

export default function Logo({
    className,
    ...props
}: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 153.19 198.47"
            className={cn(className, "text-foreground")}
        >
            <path
                className="fill-current"
                d="M152.47,121.96c0-.53-.07-.99-.19-1.36-1.73-5.77-11.28-7.01-21.6-6.54,9.3-6.16,19.89-14.86,18.85-21.93h.11c-3.52-27.61-9.62-56.28-18.65-87.64v-.25l-.23-.5c-.31-.68-.7-1.22-1.17-1.65-5.66-5.18-19.16-.65-36.1,12.13-8.47,6.39-17.09,15.75-21.7,23.32-2.79-3.72-6.92-7.8-10.77-11.51l-.66-.64C56.35,21.58,28.58-.06,19.43,3.19c-1.88.67-3.06,2.18-3.31,4.22-.12.8-.12,1.55,0,2.29C17.3,78.79,6.64,140.77.16,171.6c-.47,1.91-.3,5.69,5.81,10.01,3.91,2.77,9.38,5.15,15.4,6.69,13.13,3.39,21.88,1.84,24.03-4.26l4.83-13.93,1.3,15.31c.5,6.69,8.77,11.21,21.6,11.8,13.42.6,23.74-3.27,25.12-9.4l2.66-18.35,3.28,19.77c1.12,5.81,8.39,9.22,19.28,9.22,1.11,0,2.26-.04,3.44-.11,12.49-.76,23.24-6.14,23.97-12.01,2.39-20.63,2.93-42.29,1.59-64.39ZM119.41,115.13c-9.82,1.32-20.83,3.71-31.88,6.94-14.64,4.27-28.28,9.67-38.48,15.23-1.23.72-3.04,1.27-3.65,1.15-.01-.04-.03-.09-.04-.15-.92-4.34,15.3-22.15,45.47-35.26,13.51-5.88,26.77-10.06,37.33-11.77,11.68-1.89,15.81,0,16.37,1.3,0,0,.03.08.07.28.47,2.94-5.87,11.27-25.18,22.28ZM37.91,15.11c7.79,4.84,15.92,10.99,18.97,13.9l.66.63c2.61,2.5,7.42,7.13,10.3,10.99-5.21-.41-12.73-5.31-21.19-10.84-1.89-1.24-3.84-2.51-5.85-3.79-15.26-9.77-19.16-14.48-19.69-16.74,0-.22,0-.45,0-.67,0-.21,0-.43,0-.64,0-.03,0-.05,0-.06.87-.41,5.42.13,16.81,7.2Z"
            />
            <ellipse
                className="fill-current text-white"
                cx="84.12"
                cy="65.09"
                rx="10.3"
                ry="18.63"
                transform="translate(-2.75 3.72) rotate(-2.49)"
            />
            <path
                className="fill-current"
                d="M90.15,64.83c-.19-4.33-2.28-7.75-4.67-7.65-.55.02-1.06.24-1.53.59.82.53,1.36,1.44,1.36,2.49,0,1.63-1.33,2.96-2.96,2.96-.28,0-.54-.05-.8-.12-.07.67-.1,1.38-.07,2.11.19,4.33,2.28,7.75,4.67,7.65s4.18-3.7,3.99-8.02Z"
            />
            <ellipse
                className="fill-current text-white"
                cx="118.03"
                cy="60.66"
                rx="10.3"
                ry="18.63"
                transform="translate(-.83 1.65) rotate(-.8)"
            />
            <path
                className="fill-current"
                d="M124.06,60.58c-.06-4.33-2.05-7.81-4.44-7.78-.55,0-1.07.21-1.54.55.8.55,1.32,1.48,1.29,2.52-.05,1.63-1.41,2.92-3.05,2.87-.28,0-.54-.07-.79-.15-.09.67-.14,1.37-.13,2.1.06,4.33,2.05,7.81,4.44,7.78s4.29-3.57,4.23-7.9Z"
            />
        </svg>
    );
}
