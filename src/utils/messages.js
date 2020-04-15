const generateMessage = (text) => {
    return {
        text,
        creeatedAt: new Date().getTime()
    }
}

const generateLocation = (text) => {
    return {
        url,
        creeatedAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage, generateLocation
}