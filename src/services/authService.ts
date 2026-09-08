import type { Profile, User } from 'types'
import { mockDb } from './mock/mockDb'
import { simulateLatency } from './delay'

export const authService = {
  async login(email: string, password?: string): Promise<{ user: User; profile: Profile } | { error: { message: string } }> {
    await simulateLatency(450, 650)
    const trimmedEmail = email?.trim()
    if (!trimmedEmail || !password) {
      return { error: { message: 'Please provide both email and password' } }
    }

    const user = mockDb.users.find((u) => u.email?.toLowerCase() === trimmedEmail.toLowerCase())
    if (!user) {
      return { error: { message: 'Invalid email or password' } }
    }

    const expectedPassword = user.password ?? (user.email?.toLowerCase() === 'admin@admin.com' ? 'password' : null)
    if (!expectedPassword || password !== expectedPassword) {
      return { error: { message: 'Invalid email or password' } }
    }

    // Ensure password is saved on user object
    if (!user.password && expectedPassword) {
      user.password = expectedPassword
      mockDb.save()
    }

    const profile = mockDb.getProfile(user.id) || {
      id: user.id,
      full_name: user.user_metadata?.full_name ?? 'Demo User',
      profile_image: null,
      email: user.email ?? null,
      phone_number: null,
      address: null,
      city: null,
      country: null,
      state: null,
    }

    mockDb.emit('auth_state_change', { event: 'SIGNED_IN', session: { user } })
    return { user, profile }
  },

  async signUp(email: string, password: string, fullName: string): Promise<{ error: null | { message: string } }> {
    await simulateLatency(500, 750)
    const trimmedEmail = email?.trim()
    const trimmedName = fullName?.trim()

    if (!trimmedEmail || !password || !trimmedName) {
      return { error: { message: 'Please fill in all fields' } }
    }

    const existingUser = mockDb.users.find((u) => u.email?.toLowerCase() === trimmedEmail.toLowerCase())
    if (existingUser) {
      return { error: { message: 'An account with this email already exists' } }
    }

    const newUser: User = {
      id: 'user-' + Date.now(),
      email: trimmedEmail,
      password,
      user_metadata: { full_name: trimmedName },
      created_at: new Date().toISOString(),
    }
    mockDb.users.push(newUser)
    mockDb.updateProfile(newUser.id, {
      full_name: trimmedName,
      email: trimmedEmail,
    })
    mockDb.save()
    mockDb.emit('auth_state_change', { event: 'SIGNED_IN', session: { user: newUser } })
    return { error: null }
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ error: null | { message: string } }> {
    await simulateLatency(450, 650)
    const user = mockDb.users.find((u) => u.id === userId)
    if (!user) {
      return { error: { message: 'User not found' } }
    }

    const expectedPassword = user.password ?? (user.email?.toLowerCase() === 'admin@admin.com' ? 'password' : null)
    if (expectedPassword && currentPassword !== expectedPassword) {
      return { error: { message: 'Incorrect current password' } }
    }

    mockDb.updateUserPassword(userId, newPassword)
    return { error: null }
  },

  async signOut(): Promise<{ error: null }> {
    await simulateLatency(200, 350)
    mockDb.emit('auth_state_change', { event: 'SIGNED_OUT', session: null })
    return { error: null }
  },

  async getUser(userId: string): Promise<User | null> {
    await simulateLatency(80, 150)
    return mockDb.users.find((u) => u.id === userId) ?? null
  },

  async getProfile(userId: string): Promise<Profile | null> {
    await simulateLatency(80, 150)
    return mockDb.getProfile(userId)
  },

  async updateProfile(userId: string, userProfile: Partial<Profile>, imageFile?: File | null): Promise<{ profile: Profile | null; error: null | { message: string } }> {
    await simulateLatency(450, 650)
    let imagePath: string | null = null
    if (imageFile) {
      try {
        imagePath = await mockDb.fileToBase64(imageFile)
      } catch (e: any) {
        return { profile: null, error: { message: e.message || 'Failed to upload image' } }
      }
    }

    const updates = {
      ...userProfile,
      ...(imagePath ? { profile_image: imagePath } : {}),
    }

    const updated = mockDb.updateProfile(userId, updates)
    mockDb.emit('auth_state_change', { event: 'USER_UPDATED', session: { user: mockDb.users.find((u) => u.id === userId) } })
    return { profile: updated, error: null }
  },

  onAuthStateChange(callback: (event: string, session: { user: User } | null) => void): () => void {
    return mockDb.on('auth_state_change', ({ event, session }) => callback(event, session))
  },
}
