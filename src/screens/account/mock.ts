export interface UserAccount {
  name: string
  username: string
  email: string
  phone: string
  status: string
  bio: string
  avatar: string
  blurhash: string
  accountId: string
}

export const CURRENT_USER: UserAccount = {
  name: 'Aliff Azfar',
  username: '@aliffazfar',
  email: 'aliffazfararis@gmail.com',
  phone: '+60 12-345 6789',
  status: 'Available',
  bio: 'Mobile Engineer • Building 60fps chats',
  avatar:
    'https://aliffazfar.com/_next/image?url=%2Fimages%2Fvsco%2Fimg7.webp&w=1080&q=90',
  blurhash: 'LKEWK^$z-nxucue-MyoL7ibvNKbH',
  accountId: 'usr_aliff_8921',
}
