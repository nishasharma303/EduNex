const API_URL = 'http://localhost:5000/api';

// Create or get user in MongoDB
export const syncUserWithDB = async (clerkUser) => {
  console.log('🔄 START: Syncing user with DB...');
  console.log('👤 Clerk User Data:', {
    id: clerkUser?.id,
    email: clerkUser?.primaryEmailAddress?.emailAddress,
    firstName: clerkUser?.firstName,
    lastName: clerkUser?.lastName
  });

  if (!clerkUser) {
    console.log('❌ No clerkUser provided');
    return null;
  }

  if (!clerkUser.id) {
    console.log('❌ No clerkId found in user');
    return null;
  }

  try {
    console.log('📤 Sending request to backend...');
    
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clerkId: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        profileImage: clerkUser.imageUrl,
      }),
    });
    
    console.log('📨 Response status:', response.status);
    console.log('📨 Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Server error response:', errorText);
      throw new Error(`Server error: ${response.status}`);
    }
    
    const userData = await response.json();
    console.log('✅ SUCCESS: User synced with DB:', userData);
    return userData;
    
  } catch (error) {
    console.error('❌ ERROR syncing user with DB:', error);
    return null;
  }
};

// Get user data from MongoDB
export const getUserData = async (clerkId) => {
  try {
    const response = await fetch(`${API_URL}/users/${clerkId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// Debug: Check all users in DB
export const debugGetAllUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/debug/users`);
    return await response.json();
  } catch (error) {
    console.error('Error debugging users:', error);
    return null;
  }
};