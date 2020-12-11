import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import HandsonTable from './components/HandsonTable';
import AntdTable from './components/AntdTable';


const BasicRoute = () => (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={HandsonTable}/>
            <Route exact path="/antdTable" component={AntdTable}/>
        </Switch>
    </HashRouter>
);


export default BasicRoute;