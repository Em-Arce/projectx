import React from "react";
import './App.css';
import NavBar from './components/NavBar.js';
import AllCoinsTable from './components/AllCoinsTable';

function App() {
    return (
      <div>
        <NavBar />
        <AllCoinsTable />
      </div>
    );
};

export default App;