import {type ReactElement} from "react";
import {render} from "@testing-library/react";
import {MemoryRouter, Route, Routes} from "react-router-dom";

export function renderWithRoute(
  ui: ReactElement,
  {route = "/", path = "/"}: {route?: string; path?: string} = {}
) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={ui} />
        <Route path="/home" element={<div>HOME</div>} />
        <Route path="/family/:id" element={<div>FAMILY OK</div>} />
      </Routes>
    </MemoryRouter>
  );
}
