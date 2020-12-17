interface IMailCOnfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      name: string;
      email: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'marcospsw96@gmail.com',
      name: 'Marcos Wergles',
    },
  },
} as IMailCOnfig;
