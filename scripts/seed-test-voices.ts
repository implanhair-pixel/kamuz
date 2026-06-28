// Quick script to insert test voice recordings directly via Prisma.
import { db } from '../src/lib/db';

async function main() {
  // Clean slate
  await db.voiceRating.deleteMany();
  await db.voiceRecording.deleteMany({ where: { id: { in: ['test1','test2','test3'] } } });

  const created = await Promise.all([
    db.voiceRecording.create({
      data: {
        id: 'test1',
        title: 'Sorani greeting — سڵاو',
        description: 'How to greet in Sorani Kurdish',
        dialect: 'sorani',
        fileName: 'test1.webm',
        filePath: '/uploads/voices/test1.webm',
        duration: 5.0,
        ipHash: 'test-ip-1',
        nickname: 'Aram',
        vocabId: 'v_hello',
        likes: 3,
        dislikes: 1,
      },
    }),
    db.voiceRecording.create({
      data: {
        id: 'test2',
        title: 'Kalhori phrase — سڵاو هاوڕێ',
        description: 'A friendly Kalhori phrase',
        dialect: 'kalhori',
        fileName: 'test2.webm',
        filePath: '/uploads/voices/test2.webm',
        duration: 7.0,
        ipHash: 'test-ip-2',
        nickname: 'Rojin',
        vocabId: 'v_friend',
        likes: 5,
        dislikes: 0,
      },
    }),
    db.voiceRecording.create({
      data: {
        id: 'test3',
        title: 'Kurmanji welcome — Rû bi xêr',
        description: 'Kurmanji pronunciation demo',
        dialect: 'kurmanji',
        fileName: 'test3.webm',
        filePath: '/uploads/voices/test3.webm',
        duration: 4.0,
        ipHash: 'test-ip-3',
        nickname: 'Dilan',
        vocabId: 'v_goodbye',
        likes: 1,
        dislikes: 0,
      },
    }),
  ]);
  console.log('Inserted:', created.map(v => `${v.id} (${v.dialect}, likes=${v.likes}, dislikes=${v.dislikes})`).join(', '));
  await db.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
