// eslint-disable-next-line import/prefer-default-export
export function getRelativeTime(dateStr) {
    const now = new Date()
    const targetDate = new Date(dateStr)

    const timeDifference = now - targetDate
    const seconds = Math.floor(timeDifference / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) {
        return `${seconds} second${seconds === 1 ? '' : 's'} ago`
    }
    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    }
    if (hours < 24) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`
    }
    return `${days} day${days === 1 ? '' : 's'} ago`
}
