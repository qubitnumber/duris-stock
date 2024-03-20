import { Dispatch, SetStateAction } from "react";
import { useNavigate } from 'react-router-dom'
import DashboardWrapper from './Dashboard/Dashboard';
import services from '../services'

interface HomeProps {
  email: string;
  loggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  setEmail: Dispatch<SetStateAction<string>>;
}

const Home = ({ loggedIn, setLoggedIn, setEmail }: HomeProps) => {
  const navigate = useNavigate()
  const authService = services.auth

  const onLogin = () => {
    localStorage.removeItem('user')
    setLoggedIn(false)
    setEmail('')
    navigate('/login')
  }

  const onLogout = async () => {
    authService.authLogout()
    localStorage.removeItem('user')
    setLoggedIn(false)
    setEmail('')
    navigate('/')
  }

  return (
    <>
    {loggedIn ? (
      <DashboardWrapper onLogout={onLogout}/>
    ) : (
      <div className="mainContainer">
        <div className={'titleContainer'}>
          <div>Welcome!</div>
        </div>
        <div className={'buttonContainer'}>
          <input
            className={'inputButton'}
            type="button"
            onClick={onLogin}
            value={'Log in'}
          />
        </div>
      </div>
    )}
    </>
  )
}

export default Home