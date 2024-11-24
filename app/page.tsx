import Weather from "./components/weather";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-500 text-white">
      <Weather />
    </div>
  );
}
