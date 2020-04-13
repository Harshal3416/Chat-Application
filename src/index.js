const path = require('path')
const express = require('express')
const app = express()

const port = process.env.PORT || 3000

// Windows does paths with backslashes where Unix does paths with forward slashes. 
// node.js provides path.join() to always use the correct slash.
// here __dirname is E:\chat-app\src
const publicDirectoryPath = path.join(__dirname, '../public')

// To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
app.use(express.static(publicDirectoryPath))

app.listen(port, ()=>{
    console.log(`listening to port ${port}`)
})