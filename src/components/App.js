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
      <HandsonTable />
    </>
  );
}

export default App;
