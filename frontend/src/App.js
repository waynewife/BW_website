import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GenrePage from './components/GenrePage';
import Library from './components/Library';
import SearchResults from './components/SearchResults';
import Profile from './components/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateList from './components/CreateList';
import { ThemeProvider } from './theme';
import './styles/App.css';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/genre/:genre" component={GenrePage} />
          <Route path="/library" component={Library} />
          <Route path="/search" component={SearchResults} />
          <Route path="/profile" component={Profile} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/create-list" component={CreateList} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;