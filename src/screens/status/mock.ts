import { User } from '@/api/modules/users/types'
import { CURRENT_USER } from '../account/mock'

export interface StatusUpdate {
  id: string
  time: string
  image: string
  imageBlurhash: string
  caption: string
  viewed: boolean
}

export interface StatusContact {
  id: string
  name: string
  avatar: string
  avatarBlurhash: string
  statuses: StatusUpdate[]
}

export type StatusListItem =
  | { type: 'my-status'; id: 'my-status' }
  | { type: 'empty'; id: 'empty' }
  | { type: 'section'; id: string; title: string }
  | ({ type: 'status' } & StatusContact)

// Hardcoded once for the mock; every remote image still gets a TurboImage placeholder.
const BLURHASHES = [
  'LCJa[$=}D$xZ?cWUkCay4Tt8%Moz',
  'L99%*W8{DP_3.9IBax%M4U%M%zD%',
  'LcM7fP}?slR*Ten*RjfiogR,o0s:',
  'LXLXf2M_tQ-;~qk9M{M_Ioj[j?kD',
  'LuF$w~RiIoxu_4tRIUt7t7xuRjRP',
  'LMKUi^M{t6IV~q-;t7Rj_3of9FRj',
  'LQE4P#n2MING^Us*VqV@%$M{jEs+',
  'L56khr-=4:M|9GRQxZn$0OIV-UxV',
]

const STATUS_IMAGES = [
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511497584788-876760111969?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=900&auto=format&fit=crop&q=80&sat=-15',
  'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&auto=format&fit=crop&q=80&sat=-20',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&auto=format&fit=crop&q=80&sat=-15',
  'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&auto=format&fit=crop&q=80&hue=20',
]

const CAPTIONS = [
  'Finding peace in nature’s embrace.',
  'A quiet corner of the city.',
  'Small details, big mood.',
  'Making space for good ideas.',
  'A little sunshine goes a long way.',
  'Weekend energy.',
  'Out and about.',
  'A fresh start.',
  'Taking the scenic route.',
  'Slow mornings, clear thoughts.',
  'Collecting little moments.',
  'Somewhere worth remembering.',
]

const TIME_SETS = [
  ['Just now', '8m ago', '19m ago'],
  ['12m ago', '35m ago', '1h ago'],
  ['46m ago', '1h ago', '2h ago'],
  ['1h ago', '2h ago', '3h ago'],
  ['2h ago', '3h ago', '5h ago'],
  ['3h ago', '5h ago', '6h ago'],
]

export function createStatusContacts(users: User[]): StatusContact[] {
  return users.map((user, index) => {
    const statusCount = 2 + (index % 2)
    const imageStart = (user.id * 3 + index) % STATUS_IMAGES.length
    const times = TIME_SETS[index % TIME_SETS.length]
    const viewed = index >= 4

    return {
      id: String(user.id),
      name: user.name,
      avatar: user.avatar,
      avatarBlurhash: BLURHASHES[index % BLURHASHES.length],
      statuses: Array.from({ length: statusCount }, (_, statusIndex) => {
        const imageIndex = (imageStart + statusIndex) % STATUS_IMAGES.length

        return {
          id: `${user.id}-${statusIndex}`,
          time: times[statusIndex],
          image: STATUS_IMAGES[imageIndex],
          imageBlurhash: BLURHASHES[imageIndex % BLURHASHES.length],
          caption: CAPTIONS[(imageIndex + index) % CAPTIONS.length],
          viewed,
        }
      }),
    }
  })
}

export const MY_STATUS = {
  name: 'My Status',
  time: '46m ago',
  avatar: CURRENT_USER.avatar,
  avatarBlurhash: CURRENT_USER.blurhash,
}

export function buildStatusList(contacts: StatusContact[]): StatusListItem[] {
  if (contacts.length === 0) {
    return [
      { type: 'my-status', id: 'my-status' },
      { type: 'empty', id: 'empty' },
    ]
  }

  return [
    { type: 'my-status', id: 'my-status' },
    { type: 'section', id: 'recent', title: 'Recent Updates' },
    ...contacts
      .filter((contact) => contact.statuses.some((status) => !status.viewed))
      .map((contact) => ({ type: 'status' as const, ...contact })),
    { type: 'section', id: 'viewed', title: 'Viewed' },
    ...contacts
      .filter((contact) => contact.statuses.every((status) => status.viewed))
      .map((contact) => ({ type: 'status' as const, ...contact })),
  ]
}
