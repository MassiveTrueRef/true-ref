import './InputEmail.css'
import React, { useState } from 'react'

const InputEmail = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isTouched, setIsTouched] = useState(false)

  // A basic regular expression for email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validateEmail = (value: string) => {
    if (!value) {
      return 'Email is required'
    }
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address'
    }
    return '' // No error
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setEmail(value)
    if (isTouched) {
      setError(validateEmail(value))
    }
  }

  const handleBlur = () => {
    setIsTouched(true)
    setError(validateEmail(email))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationError = validateEmail(email)
    if (validationError) {
      setError(validationError)
    } else {
      // Form is valid, proceed with submission (e.g., API call)
      alert(`Valid email submitted: ${email}`)
      setError('')
      setIsTouched(false)
      // Further steps like sending to backend for verification via an activation email
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email:</label>
      <input
        type="email" // Provides basic built-in browser validation and a mobile-friendly keyboard
        id="email"
        value={email}
        onChange={handleInputChange}
        onBlur={handleBlur} // Validate when the input loses focus
        className={error ? 'invalid' : ''}
        aria-invalid={!!error}
        aria-describedby="email-error"
      />
      {error && (
        <p id="email-error" style={{ color: 'red' }}>
          {error}
        </p>
      )}
      {/* <button type="submit">Submit</button> */}
    </form>
  )
}

export default InputEmail
