import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Splash from './Pages/Splash';
import RequireAuth from './RequireAuth';
import AuthProvider from './useAuth';
import Add from './Pages/Add';
import Work from './Pages/Work';
import Settings from './Pages/Settings';
import Edit from './Pages/Edit';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route path="/home" element={<Home />} />
            <Route path="/add" element={<Add />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/work/:id" element={<Work />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
