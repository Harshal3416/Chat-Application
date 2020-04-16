const generateMessage = (username, text) => {
    return {
        username,
        text,
        creeatedAt: new Date().getTime()
    }
}

const generateLocation = (username, url) => {
    return {
        username,
        url,
        creeatedAt: new Date().getTime()        
    }
}

module.exports = {
    generateMessage, generateLocation
}