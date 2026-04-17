import type { FC, PropsWithChildren } from "hono/jsx";
import { NavBar } from "./nav-bar";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html>
      <head>
        <script src="https://unpkg.com/htmx.org@2.0.4"></script>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </head>
      <body class="p-4 bg-gray-800 flex flex-col items-center">
        <NavBar />
        <div id="container" class="max-w-5xl w-full">
          {children}
        </div>
      </body>
    </html>
  );
};
