import { HashRouter as Router, Route } from 'react-router-dom';

import Home from './pages/Home';
import Match from './pages/Match';
import './App.css';

function App() {
  return (
    <Router>
      <header className="App-header">
        <Route exact path={'/'} component={Home} />
        <Route path={'/match/:roomId'} component={Match} />
      </header>
    </Router>
  );
}

export default App;
