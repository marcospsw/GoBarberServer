import 'reflect-metadata';
import AppError from '../../../shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let autheticateUser: AuthenticateUserService;

describe('AthenticatedUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    autheticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to autheticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Marcos Souza',
      email: 'marcospsw96@gmail.com',
      password: '123456789',
    });

    const response = await autheticateUser.execute({
      email: 'marcospsw96@gmail.com',
      password: '123456789',
    });

    await expect(response).toHaveProperty('token');
    await expect(response.user).toEqual(user);
  });

  it('should be able to autheticate with non existing user', async () => {
    await expect(
      autheticateUser.execute({
        email: 'marcospsw96@gmail.com',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to autheticate with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'Marcos Souza',
      email: 'marcospsw96@gmail.com',
      password: '123456789',
    });

    await expect(
      autheticateUser.execute({
        email: 'marcospsw96@gmail.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
