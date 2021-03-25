import Router from "./Router";
import './App.css';
import Navigation from "./Component/Navigation/Navigation";
import Footer from "./Component/Footer/Footer";

function App() {
  return (
    <div className="App">
      <Navigation />
      <Router />
      <Footer />
    </div>
  );
}

export default App;
