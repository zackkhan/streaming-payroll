import { StrictMode } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import { EmployerFlow } from "./EmployerFlow";
import { EmployeeFlow } from "./EmployeeFlow";

import App from "./App";


const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<EmployerFlow />} />
      <Route path="employer" element={<EmployerFlow />} />
      <Route path="employee" element={<EmployeeFlow />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
