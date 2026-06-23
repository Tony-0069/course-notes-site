import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const databasePath = join(__dirname, 'database', 'notes.json')
const port = Number(process.env.PORT) || 4174

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

async function readNotes() {
  const file = await readFile(databasePath, 'utf8')
  return JSON.parse(file)
}

async function writeNotes(notes) {
  await writeFile(databasePath, `${JSON.stringify(notes, null, 2)}\n`, 'utf8')
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''
    request.on('data', (chunk) => {
      body += chunk
      if (body.length > 1_000_000) {
        request.destroy()
        reject(new Error('Request body is too large'))
      }
    })
    request.on('end', () => resolve(body))
    request.on('error', reject)
  })
}

function send(response, statusCode, payload) {
  response.writeHead(statusCode, jsonHeaders)
  response.end(JSON.stringify(payload))
}

function sanitizeNote(note, id = randomUUID()) {
  const requiredFields = ['title', 'course', 'category', 'summary', 'content']
  const hasRequiredFields = requiredFields.every((field) => String(note[field] || '').trim())

  if (!hasRequiredFields) {
    return null
  }

  return {
    id,
    title: String(note.title).trim(),
    course: String(note.course).trim(),
    category: String(note.category).trim(),
    summary: String(note.summary).trim(),
    content: String(note.content).trim(),
    updatedAt: note.updatedAt || new Date().toISOString().slice(0, 10),
  }
}

createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, jsonHeaders)
    response.end()
    return
  }

  try {
    if (request.url === '/api/notes' && request.method === 'GET') {
      const notes = await readNotes()
      send(response, 200, notes)
      return
    }

    if (request.url === '/api/notes' && request.method === 'POST') {
      const body = await readRequestBody(request)
      const note = sanitizeNote(JSON.parse(body))

      if (!note) {
        send(response, 400, { message: '請填寫所有欄位' })
        return
      }

      const notes = await readNotes()
      await writeNotes([note, ...notes])
      send(response, 201, note)
      return
    }

    if (request.url?.startsWith('/api/notes/') && request.method === 'PUT') {
      const id = decodeURIComponent(request.url.replace('/api/notes/', ''))
      const body = await readRequestBody(request)
      const updatedNote = sanitizeNote(JSON.parse(body), id)

      if (!updatedNote) {
        send(response, 400, { message: '請填寫所有欄位' })
        return
      }

      const notes = await readNotes()
      const index = notes.findIndex((note) => note.id === id)

      if (index === -1) {
        send(response, 404, { message: '找不到這篇筆記' })
        return
      }

      const nextNotes = notes.map((note) => (note.id === id ? updatedNote : note))
      await writeNotes(nextNotes)
      send(response, 200, updatedNote)
      return
    }

    if (request.url?.startsWith('/api/notes/') && request.method === 'DELETE') {
      const id = decodeURIComponent(request.url.replace('/api/notes/', ''))
      const notes = await readNotes()
      const nextNotes = notes.filter((note) => note.id !== id)

      if (nextNotes.length === notes.length) {
        send(response, 404, { message: '找不到這篇筆記' })
        return
      }

      await writeNotes(nextNotes)
      send(response, 200, { id })
      return
    }

    send(response, 404, { message: 'API route not found' })
  } catch (error) {
    send(response, 500, { message: error.message || 'Server error' })
  }
}).listen(port, () => {
  console.log(`Course notes API running on http://localhost:${port}`)
})