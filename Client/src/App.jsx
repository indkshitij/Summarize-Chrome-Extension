import React, { useContext } from "react";
import Loading from "./components/Loading";
import InitialScreen from "./components/InitialScreen.jsx";
import FinalScreen from "./components/FinalScreen.jsx";
import { AppContext } from "./Context/AppContext.jsx";

function App() {
  const { loading, summary } = useContext(AppContext);

  return (
    <>
      <div className="App w-[500px] ">
        {/* <InitialScreen /> */}
        {loading ? <Loading /> : summary ? <FinalScreen /> : <InitialScreen />}
      </div>
    </>
  );
}

export default App;
