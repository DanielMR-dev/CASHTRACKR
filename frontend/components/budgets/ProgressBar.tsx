"use client"

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ProgressBar({percentage}: {percentage: number}) {
    return (
        <div className="flex justify-center p-5">
            <CircularProgressbar
                value={percentage}
                text={`${percentage}% Gastado`}
                styles={buildStyles({
                    pathColor: percentage >= 100 ? "#dc2626" : "#f59e0b",
                    trailColor: "#e1e1e1",
                    textColor: percentage >= 100 ? "#dc2626" : "#f59e0b",
                    textSize: "8px",
                })}
            />
        </div>
    );
}
