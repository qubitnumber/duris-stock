import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import services from './services'
import './App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const authService = services.auth

  useEffect(() => {
    // Fetch the user email and token from local storage
    const user = JSON.parse(localStorage.getItem('user') || '{}')
  
    // If the token/email does not exist, mark the user as logged out
    if (!user || !user.token) {
      setLoggedIn(false)
      return
    }

    // If the token exists, verify it with the auth server to see if it is valid
    if (loggedIn) {
      authService.authToken()
        .then((r) => r.data)
        .then((r) => {
          if (r.email) {
            setLoggedIn(true)
            setEmail(r.email)
          } else {
            setLoggedIn(false)
            setEmail('')
          }
        })
    }
  }, [authService, loggedIn])

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} setEmail={setEmail}/>} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
