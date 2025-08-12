import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../services/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Convert Firebase user to our User interface - optimized version
  const createUserProfile = async (firebaseUser: FirebaseUser): Promise<User> => {
    console.log('Creating user profile for:', firebaseUser.uid);
    
    // Create basic user profile immediately
    const basicProfile: User = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'User',
      email: firebaseUser.email || ''
    };

    // Try to get additional data from Firestore (non-blocking)
    getDoc(doc(db, 'users', firebaseUser.uid))
      .then(userDoc => {
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('Found existing user data:', userData);
          // Update with Firestore data if available
          setUser({
            ...basicProfile,
            name: userData.name || basicProfile.name
          });
        }
      })
      .catch(error => {
        console.error('Error getting user profile (non-blocking):', error);
      });

    // Return basic profile immediately
    return basicProfile;
  };

  // Monitor auth state changes
  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? firebaseUser.uid : 'null');
      
      if (firebaseUser) {
        try {
          // Get basic profile immediately
          const userProfile = await createUserProfile(firebaseUser);
          console.log('Setting user profile:', userProfile);
          setUser(userProfile);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error creating user profile:', error);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('No user, setting state to null');
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    console.log('Starting signup for:', email);
    
    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      console.log('Firebase user created:', firebaseUser.uid);

      // 2. Set local user state immediately (don't wait for profile update)
      const newUser = {
        id: firebaseUser.uid,
        name: name,
        email: email
      };
      console.log('Setting local user state immediately:', newUser);
      setUser(newUser);
      setIsAuthenticated(true);

      // 3. Update Firebase Auth profile and Firestore in parallel (non-blocking)
      Promise.all([
        updateProfile(firebaseUser, { displayName: name }),
        setDoc(doc(db, 'users', firebaseUser.uid), {
          name: name,
          email: email,
          createdAt: new Date(),
          problemsSolved: 0,
          totalProblems: 0,
          averageTime: '0m 0s',
          successRate: 0,
          weeklyGoal: 5,
          currentStreak: 0
        })
      ]).then(() => {
        console.log('Profile and Firestore updated successfully');
      }).catch(error => {
        console.error('Background update error (non-blocking):', error);
      });

    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const login = async (email: string, password: string) => {
    console.log('Starting login for:', email);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      console.log('Login successful for:', firebaseUser.uid);
      
      // Get user profile from Firestore (non-blocking)
      createUserProfile(firebaseUser).then(userProfile => {
        console.log('Setting user profile from login:', userProfile);
        setUser(userProfile);
        setIsAuthenticated(true);
      }).catch(error => {
        console.error('Error getting user profile:', error);
        // Fallback to basic profile
        const basicProfile = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || ''
        };
        setUser(basicProfile);
        setIsAuthenticated(true);
      });

    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const logout = async () => {
    console.log('Starting logout');
    
    try {
      await signOut(auth);
      console.log('Logout successful');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    signup
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};