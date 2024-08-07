import './App.css';
import MainContent from './commponents/MainContent';
import { Container } from '@mui/material';

function App() {
  return (
    <>
      <div style={{display: "flex", justifyContent: "center", width: "100vw",}}>
        <Container maxWidth="xl">
          <MainContent />
        </Container>
      </div>
    </>
  );
}

export default App;
