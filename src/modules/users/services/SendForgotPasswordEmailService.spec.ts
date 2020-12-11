import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUsersTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Marcos',
      email: 'marcospsw96@gmail.com',
      password: '123456789',
    });

    await sendForgotPasswordEmail.execute({
      email: 'marcospsw96@gmail.com',
    });

    await expect(sendMail).toHaveBeenCalled();
  });

  it('should not be ableto recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'marcospsw@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Marcos',
      email: 'marcospsw96@gmail.com',
      password: '123456789',
    });

    await sendForgotPasswordEmail.execute({
      email: 'marcospsw96@gmail.com',
    });

    await expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
