import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import Library from './components/Library'; 
import SearchResults from './components/SearchResults';
import GenrePage from './components/GenrePage';
import CreateList from './components/CreateList';
import Profile from './pages/ProfilePage';
import PublicProfile from './pages/PublicProfile';
import { ThemeProvider } from './theme';
import './styles/App.css';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="/library" component={Library} />
          <Route path="/search" component={SearchResults} />
          <Route path="/genre/:genre" component={GenrePage} />
          <Route path="/create-list" component={CreateList} />
          <Route exact path="/profile" component={Profile} />
          <Route path="/profile/:username" component={PublicProfile} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;