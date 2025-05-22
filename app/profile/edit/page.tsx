import ProfileSettings from "@/components/profile/profile-settings"
import ProtectedRoute from "@/components/auth/protected-route"

export default function ProfileEditPage() {
  return (
    <main className="container py-8">
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
          <ProfileSettings />
        </div>
      </ProtectedRoute>
    </main>
  )
}
