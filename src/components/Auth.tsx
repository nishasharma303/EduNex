import { UserButton, useUser } from '@clerk/clerk-react'

export function Auth() {
  const { isSignedIn, user } = useUser()

  return (
    <div style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
      {isSignedIn ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Welcome, {user.firstName}!</span>
          <UserButton />
        </div>
      ) : (
        <span>Please sign in</span>
      )}
    </div>
  )
}