#!/usr/bin/env ts-node --esm
import express, { Request, Response } from "express"

export const app = express()
const port = 3000

app.use(express.json())

// Beispiel-Daten
let todos = [
	{ id: 1, text: "Kaufe Milch" },
	{ id: 2, text: "Erledige Hausaufgaben" },
]

app.get("/todos", (req: Request, res: Response) => {
	res.json(todos)
})

app.post("/todos", (req: Request, res: Response) => {
	const newTodo = req.body
	todos.push(newTodo)
	res.status(201).json(newTodo)
})

app.get("/todos/:id", (req: Request, res: Response) => {
	const id = parseInt(req.params.id)
	const todo = todos.find((todo) => todo.id === id)
	if (todo) {
		res.json(todo)
	} else {
		res.status(404).json({ message: "Todo not found" })
	}
})

app.delete("/todos/:id", (req: Request, res: Response) => {
	const id = parseInt(req.params.id)
	todos = todos.filter((todo) => todo.id !== id)
	res.status(204).end()
})

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`)
})
