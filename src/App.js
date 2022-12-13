import React from "react"
import './App.css';
import PaginationTable from './components/AllCoinsTable';

function App() {
    return (
        <div>
            <nav className="relative flex justify-center align-center max-w-md mx-auto bg-white overflow-hidden md:max-w-2xl mt-2 mb-2">
              <h4 className="text-xl sm: text-sm font-semibold leading-normal mt-2 mb-2">All Cryptocurrencies</h4>
            </nav>
            <PaginationTable />
        </div>
    )
}

export default App;