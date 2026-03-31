import React, { useState } from 'react'
import { supabase } from '../../utils/supabaseClient'

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async () => {
    setLoading(true)
    setMessage('')

    if (isLogin) {
      // Login
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) {
        setMessage(error.message)
        setLoading(false)
      } else {
        setMessage('')
        if (onSuccess) onSuccess()
      }
    } else {
      // Signup
      const { error } = await supabase.auth.signUp({
        email,
        password
      })
      if (error) {
        setMessage(error.message)
        setLoading(false)
      } else {
        setMessage('Check email to confirm!')
        setLoading(false)
      }
    }
  }

  return (
    <div className="bg-gradient-to-b from-gray-900/98 to-gray-950/98 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl border-4 border-[#58cc02]/40 max-w-md w-full mx-4 relative overflow-hidden">
      {/* Decorative corner accents */}
      <div className="absolute -top-2 -left-2 w-16 h-16 border-t-2 border-l-2 border-[#58cc02]/30 rounded-tl-lg" />
      <div className="absolute -bottom-2 -right-2 w-16 h-16 border-b-2 border-r-2 border-[#58cc02]/30 rounded-br-lg" />

      <h1 className="text-3xl font-black text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#58cc02] via-[#8cff02] to-[#58cc02] tracking-tight">
        {isLogin ? 'Login' : 'Sign Up'}
      </h1>
      <p className="text-gray-400 text-center mb-4 text-sm font-medium">
        Welcome to Bodyncraft - Your Fitness Adventure
      </p>

      {/* Info box about how login works */}
      <div className="mb-6 p-4 bg-gradient-to-r from-[#58cc02]/15 via-[#46a302]/15 to-[#58cc02]/15 border-2 border-[#58cc02]/40 rounded-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        <h3 className="text-sm font-bold text-[#58cc02] mb-2 flex items-center gap-2 relative z-10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How it works:
        </h3>
        <ul className="text-xs text-gray-300 space-y-1.5 relative z-10">
          <li className="flex items-start gap-2">
            <span className="text-[#58cc02] font-bold mt-0.5">•</span>
            <span>Login to sync your progress to the cloud</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#58cc02] font-bold mt-0.5">•</span>
            <span>Your character, XP, and workout history are saved</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#58cc02] font-bold mt-0.5">•</span>
            <span>Enable n8n automations: Google Sheets, Discord, Email</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#58cc02] font-bold mt-0.5">•</span>
            <span>Real email works — no confirmation needed for login</span>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-[#58cc02] focus:border-[#58cc02] text-white placeholder-gray-500 transition-all"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-[#58cc02] focus:border-[#58cc02] text-white placeholder-gray-500 transition-all"
            disabled={loading}
          />
        </div>

        <motion.button
          onClick={handleAuth}
          disabled={loading || !email || !password}
          className="w-full bg-gradient-to-r from-[#58cc02] to-[#46a302] hover:from-[#46a302] hover:to-[#3a8300] text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-[#58cc02]/30 relative overflow-hidden group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
          {loading ? (
            <span className="flex items-center justify-center gap-2 relative z-10">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Please wait...
            </span>
          ) : isLogin ? 'Login' : 'Create Account'}
        </motion.button>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-[#58cc02] hover:text-[#8cff02] font-medium py-2 text-sm transition-colors"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : 'Already have an account? Login'}
        </button>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg text-center border-2 ${
              message.includes('error') || message.includes('invalid')
                ? 'bg-red-900/50 text-red-200 border-red-700/50'
                : 'bg-green-900/50 text-green-200 border-green-700/50'
            }`}
          >
            {message}
          </motion.div>
        )}
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        <p>Powered by Supabase Auth 🔒</p>
      </div>
    </div>
  )
}
