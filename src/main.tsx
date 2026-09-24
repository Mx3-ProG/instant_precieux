import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root")!;
// Les pages publiques sont pré-rendues au build : on hydrate le HTML existant.
// Les autres URL (administration, liens inconnus) reçoivent la coquille vide et sont rendues côté client.
if (root.dataset.prerendered === window.location.pathname) hydrateRoot(root, <App />);
else {
  root.replaceChildren();
  createRoot(root).render(<App />);
}
