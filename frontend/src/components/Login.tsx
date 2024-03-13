import { useState, Dispatch, SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import { LockClosedIcon } from "@heroicons/react/20/solid";
import services from '../services'

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
  const authService = services.auth

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

    logIn()
  }

  const LoginIcon = () => (
    <button
      onClick={onButtonClick}
      className={`rounded-lg border-1 border-neutral-400 p-2 shadow-lg transition duration-300 hover:scale-125`}
    >
      <LockClosedIcon className={`h-5 w-5 cursor-pointer stroke-1`}/>
    </button>
  )

  const logIn = async () => {
    const { data } = await authService.authLogin({ username: email, password })
    if (data) {
      const { accessToken, refreshToken} = data
      localStorage.setItem('user', JSON.stringify({ email, token: accessToken, refreshToken }))
      props.setLoggedIn(true)
      props.setEmail(email)
      navigate('/')
    }
    setEmailError('Please enter correct email and password')
  }

  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <div>Login</div>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          type="email"
          name="email"
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
          type="password"
          name="password"
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <LoginIcon />
      </div>
    </div>
  )
}

export default Login