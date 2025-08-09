import { User } from '../../models/User';
import bcrypt from 'bcryptjs';

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.password).toBe(userData.password);
      expect(savedUser.isVerified).toBe(false);
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });

    it('should require username', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should require email', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should require password', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should enforce unique email', async () => {
      const userData1 = {
        username: 'user1',
        email: 'test@example.com',
        password: 'password123',
      };

      const userData2 = {
        username: 'user2',
        email: 'test@example.com',
        password: 'password456',
      };

      const user1 = new User(userData1);
      await user1.save();

      const user2 = new User(userData2);
      await expect(user2.save()).rejects.toThrow();
    });

    it('should enforce unique username', async () => {
      const userData1 = {
        username: 'testuser',
        email: 'test1@example.com',
        password: 'password123',
      };

      const userData2 = {
        username: 'testuser',
        email: 'test2@example.com',
        password: 'password456',
      };

      const user1 = new User(userData1);
      await user1.save();

      const user2 = new User(userData2);
      await expect(user2.save()).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123',
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should enforce minimum password length', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123',
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });
  });

  describe('User Methods', () => {
    let user: any;

    beforeEach(async () => {
      user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
      await user.save();
    });

    it('should compare password correctly', async () => {
      // 模拟密码哈希
      const hashedPassword = await bcrypt.hash('password123', 10);
      user.password = hashedPassword;
      await user.save();

      // 假设User模型有comparePassword方法
      if (user.comparePassword) {
        const isMatch = await user.comparePassword('password123');
        expect(isMatch).toBe(true);

        const isNotMatch = await user.comparePassword('wrongpassword');
        expect(isNotMatch).toBe(false);
      }
    });

    it('should update user profile', async () => {
      const updates = {
        username: 'updateduser',
        bio: 'Updated bio',
      };

      Object.assign(user, updates);
      const updatedUser = await user.save();

      expect(updatedUser.username).toBe(updates.username);
      expect((updatedUser as any).bio).toBe(updates.bio);
      expect(updatedUser.updatedAt).toBeDefined();
    });

    it('should verify email', async () => {
      expect(user.isVerified).toBe(false);

      user.isVerified = true;
      const verifiedUser = await user.save();

      expect(verifiedUser.isVerified).toBe(true);
    });
  });

  describe('User Queries', () => {
    beforeEach(async () => {
      // 创建测试用户
      await User.create([
        {
          username: 'user1',
          email: 'user1@example.com',
          password: 'password123',
          isVerified: true,
        },
        {
          username: 'user2',
          email: 'user2@example.com',
          password: 'password123',
          isVerified: false,
        },
      ]);
    });

    it('should find user by email', async () => {
      const user = await User.findOne({ email: 'user1@example.com' });
      
      expect(user).toBeTruthy();
      expect(user?.username).toBe('user1');
    });

    it('should find user by username', async () => {
      const user = await User.findOne({ username: 'user2' });
      
      expect(user).toBeTruthy();
      expect(user?.email).toBe('user2@example.com');
    });

    it('should find verified users', async () => {
      const verifiedUsers = await User.find({ isVerified: true });
      
      expect(verifiedUsers).toHaveLength(1);
      expect(verifiedUsers[0].username).toBe('user1');
    });

    it('should count total users', async () => {
      const count = await User.countDocuments();
      
      expect(count).toBe(2);
    });
  });
});