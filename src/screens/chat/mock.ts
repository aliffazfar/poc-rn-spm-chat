export interface MediaItem {
  uri: string
  blurhash: string
}

export const MEDIA_ITEMS: MediaItem[] = [
  {
    uri: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=300&auto=format&fit=crop&q=80',
    blurhash: 'LCJa[$=}D$xZ?cWUkCay4Tt8%Moz',
  },
  {
    uri: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&auto=format&fit=crop&q=80',
    blurhash: 'L99%*W8{DP_3.9IBax%M4U%M%zD%',
  },
  {
    uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80',
    blurhash: 'LcM7fP}?slR*Ten*RjfiogR,o0s:',
  },
  {
    uri: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&auto=format&fit=crop&q=80',
    blurhash: 'LXLXf2M_tQ-;~qk9M{M_Ioj[j?kD',
  },
  {
    uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80',
    blurhash: 'LuF$w~RiIoxu_4tRIUt7t7xuRjRP',
  },
  {
    uri: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&auto=format&fit=crop&q=80',
    blurhash: 'LMKUi^M{t6IV~q-;t7Rj_3of9FRj',
  },
  {
    uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&auto=format&fit=crop&q=80',
    blurhash: 'LQE4P#n2MING^Us*VqV@%$M{jEs+',
  },
  {
    uri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80',
    blurhash: 'L56khr-=4:M|9GRQxZn$0OIV-UxV',
  },
]

interface TemplateMessage {
  isMe: boolean
  body?: string
  hasImage?: boolean
}

const CONVERSATION_TEMPLATES: TemplateMessage[][] = [
  [
    { isMe: true, body: 'Not yet, I was in a rush finishing the design.' },
    { isMe: true, hasImage: true },
    { isMe: false, body: 'Wow, that design looks amazing!' },
    { isMe: true, body: 'Thanks a lot! Really appreciate the feedback.' },
  ],
  [
    {
      isMe: true,
      body: 'We use contract tests and automated schema diffs in CI.',
    },
    {
      isMe: false,
      body: 'That makes a lot of sense! Check out this architecture overview:',
    },
    { isMe: false, hasImage: true },
    { isMe: true, body: 'Clean setup, looks great!' },
  ],
  [
    { isMe: true, body: 'Glad it helped! Are you using Zod or TypeBox?' },
    {
      isMe: false,
      body: 'Zod mostly, the TypeScript inference is unbeatable.',
    },
    { isMe: true, hasImage: true },
    { isMe: false, body: 'Agreed, works like a charm.' },
  ],
  [
    { isMe: true, body: 'Yes, we are deploying the benchmark results today.' },
    {
      isMe: false,
      body: 'Awesome, send over the latency charts whenever ready!',
    },
    { isMe: true, hasImage: true },
    { isMe: false, body: 'Impressive throughput numbers!' },
  ],
]

// synthesizes realistic sender-receiver dialogue from the base API comment
export function buildEnhancedConversation(
  postId: number,
  baseComments: import('@/api/modules/posts/types').Comment[],
): import('@/api/modules/posts/types').Comment[] {
  if (!baseComments || baseComments.length === 0) return []

  if (baseComments.length > 1 || baseComments[0].imageUrl) {
    return baseComments
  }

  const c0 = baseComments[0]
  const baseTime = c0.createdAt
    ? new Date(c0.createdAt).getTime()
    : Date.now() - 3600000
  const template =
    CONVERSATION_TEMPLATES[postId % CONVERSATION_TEMPLATES.length]

  const firstMessage = {
    ...c0,
    isMe: false,
  }

  const followUps = template.map((step, idx) => {
    const media = step.hasImage
      ? MEDIA_ITEMS[(postId + idx) % MEDIA_ITEMS.length]
      : undefined
    const messageTime = new Date(baseTime + (idx + 1) * 90000).toISOString()

    return {
      id: c0.id * 1000 + idx + 1,
      postId,
      userId: step.isMe ? 1 : c0.userId,
      body: step.body ?? '',
      imageUrl: media?.uri,
      blurhash: media?.blurhash,
      isMe: step.isMe,
      createdAt: messageTime,
    }
  })

  return [firstMessage, ...followUps]
}

// zero-cost local preview matching room template without bulk network calls
export function getInitialLastMessage(postId: number): {
  message: string
  time: string
} {
  const template =
    CONVERSATION_TEMPLATES[postId % CONVERSATION_TEMPLATES.length]
  const lastStep = template[template.length - 1]
  const minute = String(10 + (postId % 45)).padStart(2, '0')
  return {
    message: lastStep.body || (lastStep.hasImage ? '📷 Photo' : 'Hey!'),
    time: `08:${minute}`,
  }
}
