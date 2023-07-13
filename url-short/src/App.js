import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Form from "./components/Form";
// shift + alt + f to format
// Two routes to route to the home form page, regardless if just / or /app
function App() {
  return (
    <Router>
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <switch>
              <Route exact path='/' component={Form} />
              <Route path="/app" component={Form} />
            </switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
