export function formatScore(num) {
    if (num > 1000000000) {
        return `${(num / 1000000000).toFixed(1)}B`;
    }
    else if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    else {
        return num.toString();
    }
}

export function formatText(text) {
    if (text.length > 6) {
        return text.slice(0, 5) + "...";
    } else {
        return text;
    }
}

export function formatPosition(text) {
    if (text.length > 6) {
        return text.slice(0, -6) + "M";
    } else
    if (text.length > 3) {
        return text.slice(0, -3) + "K";
    } else  {
        return text;
    }
}

export function formatName(text) {
    if (text.length > 8) {
        return text.slice(0, 7) + "...";
    } else {
        return text;
    }
}
