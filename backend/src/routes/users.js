import { randomUUID } from "node:crypto"
import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"

const DB_PATH = join(process.cwd(), "database", "users.json")

async function readUsers() {
    const data = await readFile(DB_PATH, "utf-8")
    return JSON.parse(data)
}

async function writeUsers(users) {
    await writeFile(DB_PATH, JSON.stringify(users, null, 2))
}

export async function usersRouter(req, res) {
    if (req.url === "/users") {

        if (req.method === "GET") {
            const users = await readUsers()
            return res.end(JSON.stringify(users))
        }

        if (req.method === "POST") {
            let body = ""
            req.on("data", (chunk) => body += chunk)

            req.on("end", async () => {
                try {
                    const dataUser = JSON.parse(body)
                    const { fullName, email, number, subject, message } = dataUser

                    if (!fullName || !email || !number || !subject || !message) {
                        res.statusCode = 400
                        return res.end(JSON.stringify({ message: "Campos obrigatórios faltando no corpo da requisição" }))
                    }

                    const users = await readUsers()

                    const user = {
                        id: randomUUID(),
                        fullName,
                        email,
                        number,
                        subject,
                        message
                    }

                    users.push(user)
                    await writeUsers(users)

                    res.statusCode = 201
                    return res.end(JSON.stringify(user))

                } catch (err) {
                    res.statusCode = 400
                    return res.end(JSON.stringify({ message: "JSON inválido" }))
                }
            })
        }
    }

    if (req.url.startsWith("/users/")) {
        const idUser = req.url.split("/")[2]

        if (req.method === "PUT") {
            let body = ""
            req.on("data", (chunk) => body += chunk)

            req.on("end", async () => {
                try {
                    const dataUser = JSON.parse(body)
                    const { fullName, email, number, subject, message } = dataUser

                    const users = await readUsers()
                    const index = users.findIndex(u => u.id === idUser)

                    if (index === -1) {
                        res.statusCode = 404
                        return res.end(JSON.stringify({ message: "Usuário não encontrado" }))
                    }

                    users[index] = {
                        id: idUser,
                        fullName,
                        email,
                        number,
                        subject,
                        message
                    }

                    await writeUsers(users)
                    return res.end(JSON.stringify(users[index]))
                } catch (err) {
                    res.statusCode = 400
                    return res.end(JSON.stringify({ message: "JSON inválido" }))
                }
            })
        }

        if (req.method === "DELETE") {
            const users = await readUsers()
            const index = users.findIndex(u => u.id === idUser)

            if (index === -1) {
                res.statusCode = 404
                return res.end(JSON.stringify({ message: "Usuário não encontrado" }))
            }

            users.splice(index, 1)
            await writeUsers(users)

            return res.end(JSON.stringify({ message: "Usuário removido" }))
        }
    }
}
