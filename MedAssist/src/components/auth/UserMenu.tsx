import { useAuth } from "@/context/AuthContext";

export default function UserMenu() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <div className="flex items-center gap-3">
      {user.photoURL && <img src={user.photoURL} className="w-8 h-8 rounded-full" />}
      <div className="text-sm">
        <div className="font-medium">{user.displayName || user.email}</div>
        <button onClick={logout} className="text-blue-600">Logout</button>
      </div>
    </div>
  );
}