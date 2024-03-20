import { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import { MoonIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import { ThemeContextType } from '../../types';

interface RightHeaderProps {
  onLogout: () => void;
}

const RightHeader = ({ onLogout }: RightHeaderProps) => {
  const { darkMode, setDarkMode } = useContext(ThemeContext) as ThemeContextType;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const LogoutIcon = () => (
    <button
      onClick={onLogout}
      className={`rounded-lg border-1 border-neutral-400 p-2 shadow-lg transition duration-300 hover:scale-125`}
    >
      <UserCircleIcon className={`h-5 w-5 cursor-pointer stroke-1`}/>
    </button>
  )

  const DarkModeIcon = () => (
    <button
      onClick={toggleDarkMode}
      className={`rounded-lg border-1 border-neutral-400 p-2 shadow-lg transition duration-300 hover:scale-125 ${
        darkMode ? "shadow-gray-800" : null
      }`}
    >
      <MoonIcon
        className={`h-5 w-5 cursor-pointer stroke-1 ${
          darkMode
            ? "fill-yellow-400 stroke-yellow-400"
            : "fill-none stroke-neutral-400"
        }`}
      />
    </button>
  )

  return (
    <>
    <LogoutIcon />
    <DarkModeIcon />
    </>
  );
};

export default RightHeader;