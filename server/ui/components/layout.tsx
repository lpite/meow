import type { FC, PropsWithChildren } from "hono/jsx";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html>
      <head>
        <script src="https://unpkg.com/htmx.org@2.0.4"></script>
      </head>
      <body class="p-4">
        {children}
      </body>
    </html>
  );
};