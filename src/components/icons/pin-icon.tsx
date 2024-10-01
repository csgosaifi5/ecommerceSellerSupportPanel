import React, { PropsWithChildren } from "react";

function PinIcon({ className }: PropsWithClassName) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
        >
            <path
                fill="#fff"
                d="M12 2a7.992 7.992 0 00-6.583 12.535.999.999 0 00.12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 001.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.926.926 0 00.122-.192A8 8 0 0012 2zm0 5a3 3 0 110 6 3 3 0 010-6z"
            ></path>
        </svg>
    );
}

export default PinIcon;