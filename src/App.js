import './App.css';
import Header from './components/Header';
import BasicTabs from './components/TabPanel';

function App() {
  return (
    <div className='main'>
      <Header/>
      <div className='primary-container' >
        <BasicTabs/>
      </div>
    </div>
  );
}

export default App;
