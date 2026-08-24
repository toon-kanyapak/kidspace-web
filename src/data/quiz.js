/**
 * แบบทดสอบพ่อแม่ — 32 ข้อ วัดสองแกนตามแนวคิดของ Baumrind และ Maccoby & Martin
 * - warmth  (การตอบสนอง/ความอบอุ่น)
 * - demand  (การกำกับ/ความคาดหวัง)
 * ผลลัพธ์คือหนึ่งใน 4 ควอดรันต์ — เพื่อความเข้าใจตัวเอง ไม่ใช่การวินิจฉัย
 */

export const QUIZ_CHOICES = [
  { th: 'ไม่ใช่เลย', en: 'Not at all', score: 0 },
  { th: 'นาน ๆ ครั้ง', en: 'Rarely', score: 1 },
  { th: 'บ่อย ๆ', en: 'Often', score: 2 },
  { th: 'ใช่เลย', en: 'Very much', score: 3 },
]

const w = (th, en, rev = false) => ({ axis: 'warmth', th, en, rev })
const d = (th, en, rev = false) => ({ axis: 'demand', th, en, rev })

export const QUIZ_QUESTIONS = [
  w('ฉันกอดหรือสัมผัสลูกด้วยความรักเกือบทุกวัน', 'I hug my child or show physical affection most days'),
  d(
    'ที่บ้านมีกติกาชัดเจนว่าอะไรทำได้ อะไรทำไม่ได้',
    'There are clear rules at home about what is and is not allowed',
  ),
  w(
    'เวลาลูกเสียใจ ฉันหยุดสิ่งที่ทำอยู่เพื่อฟังเขาก่อน',
    'When my child is upset, I stop what I am doing and listen first',
  ),
  d(
    'ฉันคาดหวังให้ลูกทำสิ่งที่ตกลงกันไว้ให้เสร็จ',
    'I expect my child to finish what we agreed they would do',
  ),
  w('ฉันบอกลูกบ่อย ๆ ว่าฉันภูมิใจในตัวเขา', 'I often tell my child I am proud of them'),
  d(
    'ถ้าลูกทำผิดกติกา จะมีผลตามมาที่คุยกันไว้ล่วงหน้า',
    'If a rule is broken, there is a consequence we talked about beforehand',
  ),
  w(
    'ฉันรู้ว่าอะไรทำให้ลูกกลัวหรือกังวลอยู่ตอนนี้',
    'I know what my child is anxious or frightened about right now',
  ),
  d(
    'ฉันมีเวลานอน เวลากิน และเวลาหน้าจอที่ค่อนข้างคงที่',
    'Bedtime, mealtimes and screen time are fairly consistent',
  ),
  w(
    'เวลาลูกโกรธ ฉันช่วยเรียกชื่อความรู้สึกให้เขาได้',
    'When my child is angry, I help them name what they are feeling',
  ),
  d(
    'ฉันติดตามว่าลูกทำการบ้านหรืองานที่ได้รับมอบหมายหรือยัง',
    'I keep track of whether homework or chores are actually done',
  ),
  w(
    'ฉันเล่นหรือทำกิจกรรมที่ลูกเลือกเองอย่างน้อยสัปดาห์ละหลายครั้ง',
    'I play or do an activity of my child’s choosing several times a week',
  ),
  d(
    'ฉันไม่ยอมเปลี่ยนกติกาสำคัญแม้ลูกจะร้องไห้หรือต่อรอง',
    'I hold the important rules even when there are tears or negotiation',
  ),
  w('ลูกกล้าเล่าเรื่องที่ตัวเองทำผิดให้ฉันฟัง', 'My child will tell me about things they got wrong'),
  d('ฉันสอนให้ลูกรับผิดชอบผลของสิ่งที่ตัวเองทำ', 'I teach my child to own the results of what they do'),
  w('ฉันขอโทษลูกเมื่อฉันเป็นฝ่ายทำผิด', 'I apologise to my child when I am the one in the wrong'),
  d(
    'ฉันมีความคาดหวังเรื่องมารยาทที่ชัดเจนและพูดถึงมันสม่ำเสมอ',
    'I have clear expectations about manners and I mention them regularly',
  ),
  w(
    'ฉันมักยุ่งจนไม่ทันสังเกตว่าวันนี้ลูกเป็นยังไง',
    'I am often too busy to notice how my child’s day actually went',
    true,
  ),
  d(
    'ฉันมักปล่อยผ่านเวลาลูกไม่ทำตามที่ตกลงไว้ เพราะไม่อยากมีปัญหา',
    'I tend to let it slide when they don’t do what we agreed, to avoid a fight',
    true,
  ),
  w(
    'เวลาลูกร้องไห้ ฉันรู้สึกรำคาญมากกว่าอยากเข้าไปดูแล',
    'When my child cries I feel more irritated than moved to help',
    true,
  ),
  d(
    'ที่บ้านแทบไม่มีกติกาตายตัว แล้วแต่สถานการณ์ไปเรื่อย ๆ',
    'There are hardly any fixed rules at home — it depends on the day',
    true,
  ),
  w('ฉันชวนลูกคุยเรื่องวันของเขาเป็นประจำ', 'I regularly ask my child about their day'),
  d(
    'ฉันอธิบายเหตุผลของกติกาให้ลูกฟัง ไม่ใช่แค่สั่ง',
    'I explain the reason behind a rule rather than just giving an order',
  ),
  w(
    'ฉันสังเกตเห็นความพยายามของลูก ไม่ใช่แค่ผลลัพธ์',
    'I notice the effort my child puts in, not only the result',
  ),
  d('ฉันมอบหมายงานบ้านที่เหมาะกับวัยให้ลูกทำ', 'I give my child age-appropriate jobs around the house'),
  w(
    'ฉันรู้ชื่อเพื่อนสนิทของลูกอย่างน้อยสองคน',
    'I know the names of at least two of my child’s close friends',
  ),
  d('ฉันตั้งขอบเขตเรื่องหน้าจอและทำตามนั้นได้จริง', 'I set limits on screens and actually stick to them'),
  w(
    'ฉันปล่อยให้ลูกจัดการอารมณ์ของตัวเองไปเอง เพราะไม่รู้จะช่วยยังไง',
    'I leave my child to sort out their own feelings because I don’t know how to help',
    true,
  ),
  d(
    'ฉันยอมให้ลูกได้สิ่งที่ต้องการเพื่อให้เรื่องจบเร็ว ๆ',
    'I give in to what they want just to end the situation quickly',
    true,
  ),
  w(
    'ฉันฟังความเห็นของลูกก่อนตัดสินใจเรื่องที่เกี่ยวกับเขา',
    'I ask my child’s view before deciding things that affect them',
  ),
  d(
    'ฉันเตือนล่วงหน้าก่อนถึงเวลาต้องเปลี่ยนกิจกรรม',
    'I give a warning before it is time to switch activities',
  ),
  w(
    'ฉันแสดงให้ลูกเห็นว่าฉันรักเขาแม้ในวันที่เขาทำตัวไม่น่ารัก',
    'I show my child I love them even on days they are hard work',
  ),
  d(
    'ฉันคาดหวังให้ลูกพยายามกับสิ่งที่ยาก แทนที่จะยอมให้เลิกทันที',
    'I expect my child to keep trying at hard things rather than stopping straight away',
  ),
]

export const QUIZ_RESULTS = {
  authoritative: {
    id: 'authoritative',
    emoji: '🌷',
    tone: 'blush',
    th: 'พ่อแม่ใจดีมีขอบเขต',
    en: 'Authoritative',
    tagTh: 'อบอุ่นสูง · กำกับสูง',
    tagEn: 'High warmth · high structure',
    summaryTh: 'คุณให้ความอบอุ่นและตั้งกติกาไปพร้อมกัน ลูกรู้ว่าจะพึ่งคุณได้ และก็รู้ว่าเส้นอยู่ตรงไหน',
    summaryEn:
      'You give warmth and set limits at the same time. Your child knows they can lean on you, and they also know where the line is.',
    strengthsTh: ['ลูกกล้าเล่าเรื่องยากให้ฟัง', 'กติกาบ้านค่อนข้างอยู่ตัว', 'ลูกได้ฝึกรับผิดชอบผลของตัวเอง'],
    strengthsEn: [
      'Your child will bring you difficult things',
      'House rules are reasonably settled',
      'Your child gets practice owning their own outcomes',
    ],
    tipsTh: [
      'ระวังการอธิบายยาวเกินไปตอนลูกกำลังอารมณ์เสีย — สั้นและอยู่ด้วยมักได้ผลกว่า',
      'เผื่อพื้นที่ให้ลูกได้ตัดสินใจผิดบ้างในเรื่องที่ปลอดภัย',
      'อย่าลืมดูแลพลังของตัวเองด้วย สไตล์นี้ใช้พลังเยอะ',
    ],
    tipsEn: [
      'Watch out for long explanations mid-meltdown — short and present usually works better',
      'Leave room for your child to make safe mistakes',
      'Look after your own energy; this style takes a lot of it',
    ],
  },
  authoritarian: {
    id: 'authoritarian',
    emoji: '🧭',
    tone: 'sky',
    th: 'พ่อแม่สายระเบียบ',
    en: 'Authoritarian',
    tagTh: 'อบอุ่นน้อยกว่า · กำกับสูง',
    tagEn: 'Lower warmth · high structure',
    summaryTh:
      'คุณให้ความสำคัญกับกติกาและความรับผิดชอบมาก บ้านมีโครงสร้างชัด สิ่งที่เติมได้คือช่องทางให้ลูกได้พูดความรู้สึก',
    summaryEn:
      'You put real weight on rules and responsibility, and home has clear structure. What would round it out is more room for your child to say how they feel.',
    strengthsTh: ['ลูกรู้ความคาดหวังชัดเจน', 'กิจวัตรประจำวันสม่ำเสมอ', 'ลูกได้ฝึกวินัยตั้งแต่เล็ก'],
    strengthsEn: [
      'Your child knows exactly what is expected',
      'Daily routines are consistent',
      'Your child learns self-discipline early',
    ],
    tipsTh: [
      'เติมประโยคยอมรับความรู้สึกก่อนสั่ง เช่น "รู้ว่าหนูยังไม่อยากหยุด แล้วเรามาเก็บกัน"',
      'ลองบอกเหตุผลของกติกาสัก 1 ประโยคทุกครั้ง',
      'หา 10 นาทีต่อวันที่ไม่มีการสอนหรือแก้ไขเลย',
    ],
    tipsEn: [
      'Acknowledge the feeling before the instruction: “I know you don’t want to stop — let’s tidy up together”',
      'Try giving one sentence of reasoning with each rule',
      'Find ten minutes a day with no teaching and no correcting',
    ],
  },
  permissive: {
    id: 'permissive',
    emoji: '🎈',
    tone: 'butter',
    th: 'พ่อแม่สายตามใจ',
    en: 'Permissive',
    tagTh: 'อบอุ่นสูง · กำกับน้อยกว่า',
    tagEn: 'High warmth · lower structure',
    summaryTh: 'คุณอบอุ่นและเข้าถึงง่ายมาก ลูกรู้สึกปลอดภัยกับคุณ สิ่งที่เติมได้คือเส้นที่มั่นคงขึ้นอีกนิด',
    summaryEn:
      'You are warm and very easy to approach, and your child feels safe with you. What would round it out is slightly firmer edges.',
    strengthsTh: ['ลูกกล้าเข้าหาและเล่าเรื่องให้ฟัง', 'บรรยากาศบ้านผ่อนคลาย', 'ลูกได้แสดงความเห็นของตัวเอง'],
    strengthsEn: [
      'Your child comes to you and tells you things',
      'The atmosphere at home is relaxed',
      'Your child gets to voice their own opinion',
    ],
    tipsTh: [
      'เลือกกติกาสำคัญแค่ 3 ข้อ แล้วรักษาให้ได้จริงทุกครั้ง',
      'บอกผลล่วงหน้าแทนการต่อรองหน้างาน',
      'ความมั่นคงของกติกาไม่ได้ทำให้ลูกรักน้อยลง — มันช่วยให้ลูกรู้สึกปลอดภัยขึ้น',
    ],
    tipsEn: [
      'Pick just three rules that matter and hold them every single time',
      'State the consequence in advance instead of negotiating in the moment',
      'Consistent limits don’t make your child love you less — they help them feel safer',
    ],
  },
  uninvolved: {
    id: 'uninvolved',
    emoji: '🌙',
    tone: 'lilac',
    th: 'พ่อแม่ที่กำลังเหนื่อย',
    en: 'Uninvolved / stretched thin',
    tagTh: 'อบอุ่นน้อยกว่า · กำกับน้อยกว่า',
    tagEn: 'Lower warmth · lower structure',
    summaryTh:
      'ผลนี้มักสะท้อนช่วงชีวิตที่พลังงานเหลือน้อย มากกว่าจะสะท้อนความรักที่คุณมี เริ่มจากสิ่งเล็ก ๆ ที่ทำได้จริงก่อน',
    summaryEn:
      'This result usually reflects a stretch of life with very little energy left, rather than how much you love your child. Start with something small and genuinely doable.',
    strengthsTh: [
      'ลูกมีพื้นที่อิสระของตัวเอง',
      'คุณไม่กดดันลูกเกินไป',
      'การที่คุณทำแบบทดสอบนี้ก็คือการใส่ใจแล้ว',
    ],
    strengthsEn: [
      'Your child has independent space of their own',
      'You are not putting pressure on them',
      'Taking this quiz at all is a form of paying attention',
    ],
    tipsTh: [
      'เริ่มจาก 10 นาทีต่อวันที่วางมือถือแล้วอยู่กับลูกจริง ๆ',
      'ตั้งกติกาแค่ข้อเดียวก่อน เช่น เวลานอน แล้วทำให้ได้',
      'ถ้าความเหนื่อยล้าอยู่นานเป็นเดือน การขอความช่วยเหลือคือทางเลือกที่ดี',
    ],
    tipsEn: [
      'Start with ten minutes a day, phone in another room, really with your child',
      'Set one rule first — bedtime, say — and make that one stick',
      'If the exhaustion has lasted for months, asking for help is a good option',
    ],
  },
}

export function scoreQuiz(answers) {
  let warmth = 0,
    warmthMax = 0,
    demand = 0,
    demandMax = 0
  QUIZ_QUESTIONS.forEach((q, i) => {
    const raw = answers[i]
    if (raw == null) return
    const v = q.rev ? 3 - raw : raw
    if (q.axis === 'warmth') {
      warmth += v
      warmthMax += 3
    } else {
      demand += v
      demandMax += 3
    }
  })
  const wPct = warmthMax ? Math.round((warmth / warmthMax) * 100) : 0
  const dPct = demandMax ? Math.round((demand / demandMax) * 100) : 0
  const hiW = wPct >= 60,
    hiD = dPct >= 60
  const id =
    hiW && hiD ? 'authoritative' : !hiW && hiD ? 'authoritarian' : hiW && !hiD ? 'permissive' : 'uninvolved'
  return { warmth: wPct, demand: dPct, result: QUIZ_RESULTS[id] }
}
