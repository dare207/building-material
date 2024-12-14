import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send } from 'lucide-react'

interface EmailFormProps {
  result: any
}

const EmailForm: React.FC<EmailFormProps> = ({ result }) => {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, result }),
      })

      if (!response.ok) {
        throw new Error('Failed to send email')
      }

      setSent(true)
    } catch (err) {
      setError('Failed to send email. Please try again.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return <p className="text-green-600 dark:text-green-400">Email sent successfully!</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      <Button type="submit" disabled={sending}>
        <Send className="mr-2 h-4 w-4" /> {sending ? 'Sending...' : 'Send Report'}
      </Button>
    </form>
  )
}

export default EmailForm

