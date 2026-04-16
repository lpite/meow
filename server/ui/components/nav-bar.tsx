export function NavBar() {
  return (
    <nav class="flex justify-between text-white pb-10 max-w-5xl w-full">
      <span class="text-2xl">EcoSwarm</span>
      <ul class="flex gap-6">
        <li>
          <a href="/">Dashboard</a>
        </li>
        <li>
          <a href="/robots">Robots</a>
        </li>
        <li>
          <a href="/sensors">Sensors</a>
        </li>
        <li>
          <a href="/ventilations">Ventilations</a>
        </li>
      </ul>
      <span>Username</span>
    </nav>
  );
}
