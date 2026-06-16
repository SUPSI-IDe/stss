function parseTimecode(timecode) {

	let totalMilliseconds = 0;

	if (timecode.length > 13){
		const parts = timecode.split("_");
		const datePart = parts[0]; // "2025-07-16"
		const timePart = parts[1].replace(/-/g, ":"); // "10:11:11"

		const isoDate = `${datePart}T${timePart}`;

		const dateObj = new Date(isoDate);
		totalMilliseconds = dateObj.getTime();
	}
	else {
		const [hh, mm, rest] = timecode.split(':');
		const [ss, ff] = rest.split('.');
	
		const hours = parseInt(hh, 10);
		const minutes = parseInt(mm, 10);
		const seconds = parseInt(ss, 10);
		const fraction = parseInt(ff, 10); // Assume hundredths of a second
	
		// Convert to milliseconds
		totalMilliseconds = 
			(hours * 3600000) +
			(minutes * 60000) +
			(seconds * 1000) +
			(fraction * 10); // .79 means 790 ms
	}

	if (totalMilliseconds == NaN){
		totalMilliseconds = 1
	}

	return totalMilliseconds;
}

function parseTimeToSeconds(timeString) {
	if (typeof timeString !== 'string') return NaN;
	const parts = timeString.split(':');
	if (parts.length < 3) return NaN;
	const hours = parseInt(parts[0]);
	const minutes = parseInt(parts[1]);
	const seconds = parseFloat(parts[2]);
	return hours * 3600 + minutes * 60 + seconds;
}