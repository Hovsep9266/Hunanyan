import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ScrollToTop } from "./ScrollToTop";
import { I18nProvider } from "./i18n/I18nProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ScrollToTop />
    <I18nProvider>
      <App />
    </I18nProvider>
  </BrowserRouter>
);
