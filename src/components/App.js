import React, { useEffect } from "react";
import { useSelector, useStore } from "react-redux";

import HandsonTable from './HandsonTable';
import AntdTbale from './AntdTable';

function App() {
  const stores = useStore();
  useEffect(() => {
    console.log(stores.getState());
  });
  return (
    <>
      {/* <Link to="/antdtable">跳转到antd table页面</Link> */}
      <HandsonTable />
    </>
  );
}

export default App;
