import React, { useEffect } from "react";
import { useSelector, useStore } from "react-redux";

import HandsonTable from './HandsonTable';

function App() {
  const stores = useStore();
  useEffect(() => {
    console.log(stores.getState());
  });
  return (
    <>
      <h3>Resume</h3>
      <HandsonTable />
    </>
  );
}

export default App;
