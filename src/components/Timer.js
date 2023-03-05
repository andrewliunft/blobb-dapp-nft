import { useEffect, useMemo, useState } from "react";
import classes from "./Timer.module.css"

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export const Timer = ({ deadline = new Date().toString() }) => {
	const parsedDeadline = useMemo(() => Date.parse(deadline), [deadline])
	const [time, setTime] = useState(parsedDeadline - Date.now())

	useEffect(() => {
		const interval = setInterval(
			() => setTime(parsedDeadline - Date.now()),
			1000,
		)

		return () => clearInterval(interval)
	}, [parsedDeadline])

	return (
		<div className={classes.timer_div}>
			{Object.entries({
				Days: time / DAY,
				Hours: (time / HOUR) % 24,
				Minutes: (time / MINUTE) % 60,
				Seconds: (time / SECOND) % 60,
			}).map(([label, value]) => (
				<div key={label} className={classes.section_div}>
					<span className={classes.value_span}>{`${Math.floor(value)}`.padStart(2, "0")}</span>
					<span className={classes.label_span}>{" "+label}</span>
				</div>
			))}
		</div>
	)
}