import ProfileHeader from "@/components/profile/profile-header"
import ProfileStats from "@/components/profile/profile-stats"
import ProfileActivity from "@/components/profile/profile-activity"
import ProtectedRoute from "@/components/auth/protected-route"

export default function ProfilePage() {
  return (
    <main className="container py-8">
      <ProtectedRoute>
        <div className="space-y-8">
          <ProfileHeader />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <ProfileActivity />
            </div>
            <div>
              <ProfileStats />
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </main>
  )
}
