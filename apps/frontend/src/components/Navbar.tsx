import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <div className="fixed top-0 w-full backdrop-blur-md bg-white/60 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl font-bold text-blue-600">MediCare</h1>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <Link className="hover:text-blue-600" to="/login">
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
