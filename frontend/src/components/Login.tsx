import { useState, Dispatch, SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'

interface LoginProps {
  setEmail: Dispatch<SetStateAction<string>>;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const Login = (props: LoginProps) => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('')

  const navigate = useNavigate()

  const onButtonClick = () => {
    // Set initial error values to empty
    setEmailError('')
    setPasswordError('')

    // Check if the user has entered both fields correctly
    if ('' === email) {
      setEmailError('Please enter your email')
      return
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email')
      return
    }

    if ('' === password) {
      setPasswordError('Please enter a password')
      return
    }

    if (password.length < 7) {
      setPasswordError('The password must be 8 characters or longer')
      return
    }

    checkAccountExists((accountExists: boolean) => {
      // If yes, log in
      if (accountExists) logIn()
      // Else, ask user if they want to create a new account and if yes, then log in
      else if (
        window.confirm(
          'An account does not exist with this email address: ' + email + '. Do you want to create a new account?',
        )
      ) {
        logIn()
      }
    })
  }

  type CallbackType = (response: boolean, error?: string | null) => void

  const checkAccountExists = (callback: CallbackType) => {
    fetch(`${import.meta.env.VITE_SERVER_S_API_BASE_URL}/auth/check-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email }),
    })
      .then((r) => r.json())
      .then((r) => {
        callback(r?.userExists)
      })
  }

  const logIn = () => {
    fetch(`${import.meta.env.VITE_SERVER_S_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password }),
    })
      .then((r) => r.json())
      .then((r) => {
        if ('success' === r.message) {
          localStorage.setItem('user', JSON.stringify({ email, token: r.access_token }))
          props.setLoggedIn(true)
          props.setEmail(email)
          navigate('/')
        } else {
          window.alert('Wrong email or password')
        }
      })
  }

  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <div>Login</div>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={email}
          placeholder="Enter your email here"
          onChange={(ev) => setEmail(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{emailError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Log in'} />
      </div>
    </div>
  )
}

export default Login