import { useState } from 'react'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError('')
    setMessage('')

    if (!email) {
      setError('El correo electrónico es obligatorio')
      return
    }

    try {
      // Aquí va tu lógica real: por ejemplo, llamar a tu API de recuperación
      // await forgotPasswordApi(email)
      setMessage('Si existe una cuenta con ese correo, recibirás un enlace para restablecer la contraseña.')
      setEmail('')
    } catch (err) {
      setError('Ocurrió un error al intentar recuperar la contraseña.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">¿Olvidaste tu contraseña?</h2>
        
        {message && <div className="text-green-600 mb-4 text-sm">{message}</div>}
        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="tucorreo@ejemplo.com"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 mt-6 rounded-md transition duration-300"
          >
            Enviar enlace de recuperación
          </button>
        </form>

        <div className="mt-6 text-sm text-center">
          <a href="/auth/login" className="text-blue-600 hover:underline">Volver al login</a>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
