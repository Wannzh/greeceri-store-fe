export default function ProfileCard({ profile }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
          {profile.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-xl font-bold">{profile.name}</p>
          <p className="text-sm text-gray-500">{profile.email}</p>
        </div>
      </div>
    </div>
  );
}
