import type { Profile, User } from 'types'
import { mockDb } from './mock/mockDb'

export const authService = {
  async login(email: string, password?: string): Promise<{ user: User; profile: Profile } | { error: { message: string } }> {
    // In mock showcase mode, accept any non-empty password or match demo user
    let user = mockDb.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    if (!user) {
      user = {
        id: 'user-' + Date.now(),
        email,
        user_metadata: { full_name: email.split('@')[0] },
        created_at: new Date().toISOString(),
      }
      mockDb.users.push(user)
      mockDb.updateProfile(user.id, {
        full_name: email.split('@')[0],
        email,
      })
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
    const newUser: User = {
      id: 'user-' + Date.now(),
      email,
      user_metadata: { full_name: fullName },
      created_at: new Date().toISOString(),
    }
    mockDb.users.push(newUser)
    mockDb.updateProfile(newUser.id, {
      full_name: fullName,
      email,
    })
    mockDb.save()
    mockDb.emit('auth_state_change', { event: 'SIGNED_IN', session: { user: newUser } })
    return { error: null }
  },

  async signOut(): Promise<{ error: null }> {
    mockDb.emit('auth_state_change', { event: 'SIGNED_OUT', session: null })
    return { error: null }
  },

  async getUser(userId: string): Promise<User | null> {
    return mockDb.users.find((u) => u.id === userId) ?? null
  },

  async getProfile(userId: string): Promise<Profile | null> {
    return mockDb.getProfile(userId)
  },

  async updateProfile(userId: string, userProfile: Partial<Profile>, imageFile?: File | null): Promise<{ profile: Profile | null; error: null | { message: string } }> {
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
