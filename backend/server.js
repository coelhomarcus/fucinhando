import { createServer } from "node:http"
import { usersRouter } from "./src/routes/users.js"

const server = createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    if (req.method === "OPTIONS") {
        res.writeHead(204)
        res.end()
        return
    }
    usersRouter(req, res)
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})