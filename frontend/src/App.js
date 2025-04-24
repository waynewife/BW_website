import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GenrePage from './components/GenrePage';
import Library from './components/Library';
import SearchResults from './components/SearchResults';
import Profile from './components/Profile';
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
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;