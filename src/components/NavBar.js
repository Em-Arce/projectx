import '../NavBar.css';
const NavBar = () => {
  return (
    <div className="navbar responsive bg-white h-14 flex items-center min-w-full">
      <div className="max-w-5xl px-2 min-w-full">
        <div className="flex items-center justify-center align-center">
          <span className="text-l sm:text-sm font-semibold leading-normal">All Cryptocurrencies</span>
        </div>
      </div>
    </div>
  );
};

export default NavBar;