import { useState } from 'react'

function App() {
  const [status, setStatus] = useState(null)

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health')
      const data = await res.json()
      setStatus({ ok: res.ok, data })
    } catch (err) {
      setStatus({ ok: false, error: err.message })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">IFTS 29 — Nueva Web</h1>
        <p className="mt-2 text-gray-500">GoSoftware · entorno funcionando correctamente.</p>
        <button
          onClick={checkHealth}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Verificar backend /api/health 
        </button>
        {status && (
          <pre className="mt-4 p-2 bg-gray-100 text-left text-sm rounded">
            {JSON.stringify(status, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}

export default App
