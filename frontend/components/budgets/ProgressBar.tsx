"use client"

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ProgressBar() {
    return (
        <div className="flex justify-center p-5">
            <CircularProgressbar
                value={50}
                text={`50% Gastado`}
                styles={buildStyles({
                    pathColor: "#f59e0b",
                    trailColor: "#e1e1e1",
                    textColor: "#f59e0b",
                    textSize: "8px",
                })}
            />
        </div>
    );
}
