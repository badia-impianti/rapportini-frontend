import "@fontsource/jetbrains-mono";
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
import SetName from './Pages/SetName';
import Edit from './Pages/Edit';
import NewEdit from "./Pages/NewEdit";
import Search from './Pages/Search';
import OnCallCalendar from "./Pages/Calendar";
import RefuelingAdd from "./Pages/Refueling/RefuelingAdd";
import Refueling from "./Pages/Refueling/Refueling";

function App() {

  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route path="/setname" element={<SetName />} />
            <Route path="/home" element={<Home />} />
            <Route path="/add" element={<Add />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/newedit/:id" element={<NewEdit />} />
            <Route path="/work/:id" element={<Work />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/search" element={<Search />} />
            <Route path="/calendar" element={<OnCallCalendar />} />
              <Route path="/refueling" element={<Refueling />} />
              <Route path="/refueling/add" element={<RefuelingAdd />} />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
