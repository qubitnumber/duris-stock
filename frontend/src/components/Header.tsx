import Search from "./Search";
import RightHeader from "./RightHeader";

interface HeaderProps {
  name: string;
  onLogout: () => void;
}

const Header = ({ onLogout }: HeaderProps) => {
  return (
    <>
      <div className="header">
        <Search />
      </div>
      <div className='rightHeader'>
        <RightHeader onLogout={onLogout}/>
      </div>
    </>
  );
};

export default Header;