import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Marcos Souza',
      email: 'marcospsw96@gmail.com',
      password: '123456789',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Marcos Wergles',
      email: 'marcos@gmail.com',
    });

    await expect(updatedUser.name).toBe('Marcos Wergles');
    await expect(updatedUser.email).toBe('marcos@gmail.com');
  });

  it('should not able to update the profile from a non-existing user', async () => {
    expect(
      updateProfile.execute({
        user_id: 'non-existing-user',
        name: 'test',
        email: 'test@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to chenge the email to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Marcos Souza',
      email: 'marcospsw96@gmail.com',
      password: '123456789',
    });

    const user = await fakeUsersRepository.create({
      name: 'renata',
      email: 'renata@gmail.com',
      password: '123456789',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Marcos Wergles',
        email: 'marcospsw96@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Marcos Souza',
      email: 'marcospsw96@gmail.com',
      password: '123456789',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Marcos Wergles',
      email: 'marcos@gmail.com',
      old_password: '123456789',
      password: '123456',
    });

    await expect(updatedUser.password).toBe('123456');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Marcos Souza',
      email: 'marcospsw96@gmail.com',
      password: '123456789',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Marcos Wergles',
        email: 'marcos@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Marcos Souza',
      email: 'marcospsw96@gmail.com',
      password: '123456789',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Marcos Wergles',
        email: 'marcos@gmail.com',
        old_password: 'wrong-old-password',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
