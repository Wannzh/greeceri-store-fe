import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { login, logout, user } = useAuth();

  return (
    <div>
      <button className="bg-amber-700" onClick={() => login("greeceri.store@gmail.com", "Greeceri@123")}>
        TEST LOGIN
      </button>

      <button className="bg-black" onClick={logout}>LOGOUT</button>

      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
