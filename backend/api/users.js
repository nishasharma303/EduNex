// --- MongoDB API Routes ---

// Debug route - Get all users
app.get('/api/debug/users', async (req, res) => {
  try {
    const users = await User.find();
    console.log(`📊 DEBUG: Total users in database: ${users.length}`);
    
    if (users.length === 0) {
      console.log('📭 Database is EMPTY - no users found');
    } else {
      console.log('👥 Users in database:');
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.email} (${user.clerkId})`);
      });
    }
    
    res.json({
      totalUsers: users.length,
      users: users
    });
  } catch (error) {
    console.error('❌ DEBUG Error:', error);
    res.status(500).json({ error: 'Debug error' });
  }
});

// Create or get user - WITH DETAILED LOGGING
app.post('/api/users', async (req, res) => {
  console.log('🔵 ========== /api/users CALLED ==========');
  console.log('📨 Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { clerkId, email, firstName, lastName, profileImage } = req.body;
    
    // Log all received data
    console.log('📋 Received data:', {
      clerkId,
      email,
      firstName, 
      lastName,
      profileImage
    });
    
    if (!clerkId) {
      console.log('❌ ERROR: Missing clerkId');
      return res.status(400).json({ error: 'clerkId is required' });
    }
    
    // Check if user exists
    console.log('🔍 Checking if user exists with clerkId:', clerkId);
    let user = await User.findOne({ clerkId });
    
    if (user) {
      console.log('✅ User already exists in DB:', {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      });
      return res.json(user);
    }
    
    // Create new user
    console.log('🆕 Creating NEW user in MongoDB...');
    user = new User({
      clerkId,
      email: email || 'no-email@example.com',
      firstName: firstName || 'Unknown',
      lastName: lastName || 'User',
      profileImage: profileImage || '',
      points: 0
    });
    
    console.log('💾 Saving user to database...');
    await user.save();
    
    console.log('✅ SUCCESS: New user created in MongoDB:', {
      id: user._id,
      clerkId: user.clerkId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
    
    // Verify the user was saved by fetching it again
    const verifiedUser = await User.findOne({ clerkId });
    console.log('🔍 Verification - user found in DB:', verifiedUser ? 'YES' : 'NO');
    
    res.json(user);
    
  } catch (error) {
    console.error('❌ ERROR in /api/users:', error);
    console.error('🔴 Stack trace:', error.stack);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get user by Clerk ID
app.get('/api/users/:clerkId', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});