/** อ่านจับใจความ — short passages with comprehension questions, 3 levels. */
export const READING_LEVELS = [
  {
    id: 'easy',
    th: 'ง่าย',
    en: 'Easy',
    ageTh: '3–5 ขวบ',
    ageEn: 'Ages 3–5',
    tone: 'mint',
    descTh: 'ประโยคสั้น เรื่องใกล้ตัว',
    descEn: 'Short sentences about familiar things',
  },
  {
    id: 'medium',
    th: 'ปานกลาง',
    en: 'Medium',
    ageTh: '6–8 ขวบ',
    ageEn: 'Ages 6–8',
    tone: 'butter',
    descTh: 'เริ่มมีลำดับเหตุการณ์และการนับ',
    descEn: 'Sequencing and counting come in',
  },
  {
    id: 'hard',
    th: 'ท้าทาย',
    en: 'Challenge',
    ageTh: '9–12 ขวบ',
    ageEn: 'Ages 9–12',
    tone: 'peach',
    descTh: 'เหตุและผล และใจความสำคัญ',
    descEn: 'Cause and effect, and the main idea',
  },
]

export const READINGS = [
  {
    id: 'cat-milk',
    level: 'easy',
    emoji: '🐱',
    th: 'แมวกับนม',
    textTh: 'แมวสีส้มชื่อมะลิ มะลิหิวนมมาก แม่เทนมใส่ชามให้ มะลิเลียนมจนหมดชาม แล้วก็นอนหลับใต้โต๊ะ',
    textEn:
      'An orange cat named Mali was very hungry for milk. Mum poured some into a bowl for her. Mali licked it all up, then went to sleep under the table.',
    qsTh: [
      { q: 'แมวชื่ออะไร', choices: ['มะลิ', 'มะนาว', 'มะม่วง'], a: 0 },
      { q: 'มะลิกินอะไร', choices: ['ข้าว', 'นม', 'ปลา'], a: 1 },
      { q: 'กินเสร็จแล้วมะลิทำอะไร', choices: ['วิ่งเล่น', 'ร้องเพลง', 'นอนหลับ'], a: 2 },
    ],
    qsEn: [
      { q: 'What is the cat called?', choices: ['Mali', 'Manao', 'Mamuang'], a: 0 },
      { q: 'What did Mali have?', choices: ['Rice', 'Milk', 'Fish'], a: 1 },
      { q: 'What did Mali do afterwards?', choices: ['Ran around', 'Sang', 'Went to sleep'], a: 2 },
    ],
  },
  {
    id: 'rain-umbrella',
    level: 'easy',
    emoji: '☔',
    th: 'ฝนตก',
    textTh:
      'วันนี้ฝนตก ต้นหยิบร่มสีฟ้าออกจากบ้าน เขาเดินไปโรงเรียนกับแม่ ตอนถึงโรงเรียน รองเท้าของต้นเปียกนิดหน่อย',
    textEn:
      'It rained today. Ton took his blue umbrella and left the house. He walked to school with his mum. When they arrived, Ton’s shoes were a little wet.',
    qsTh: [
      { q: 'ร่มของต้นสีอะไร', choices: ['สีแดง', 'สีฟ้า', 'สีเขียว'], a: 1 },
      { q: 'ต้นไปโรงเรียนกับใคร', choices: ['พ่อ', 'เพื่อน', 'แม่'], a: 2 },
      { q: 'อะไรของต้นที่เปียก', choices: ['รองเท้า', 'กระเป๋า', 'หมวก'], a: 0 },
    ],
    qsEn: [
      { q: 'What colour is Ton’s umbrella?', choices: ['Red', 'Blue', 'Green'], a: 1 },
      { q: 'Who did Ton walk with?', choices: ['Dad', 'A friend', 'Mum'], a: 2 },
      { q: 'What got wet?', choices: ['His shoes', 'His bag', 'His hat'], a: 0 },
    ],
  },
  {
    id: 'seed',
    level: 'easy',
    emoji: '🌱',
    th: 'เมล็ดของหนู',
    textTh: 'ปุ๊กปลูกเมล็ดถั่วในกระถาง เธอรดน้ำทุกเช้า วันที่ห้า มีต้นอ่อนสีเขียวโผล่ขึ้นมา ปุ๊กดีใจมาก',
    textEn:
      'Pook planted a bean seed in a pot. She watered it every morning. On the fifth day a small green shoot appeared. Pook was delighted.',
    qsTh: [
      { q: 'ปุ๊กปลูกอะไร', choices: ['เมล็ดถั่ว', 'ดอกไม้', 'ต้นไม้ใหญ่'], a: 0 },
      { q: 'ปุ๊กรดน้ำตอนไหน', choices: ['ทุกเย็น', 'ทุกเช้า', 'วันเว้นวัน'], a: 1 },
      { q: 'ต้นอ่อนโผล่ขึ้นมาวันที่เท่าไหร่', choices: ['วันที่สาม', 'วันที่สี่', 'วันที่ห้า'], a: 2 },
    ],
    qsEn: [
      { q: 'What did Pook plant?', choices: ['A bean seed', 'A flower', 'A big tree'], a: 0 },
      { q: 'When did Pook water it?', choices: ['Every evening', 'Every morning', 'Every other day'], a: 1 },
      { q: 'Which day did the shoot appear?', choices: ['Day three', 'Day four', 'Day five'], a: 2 },
    ],
  },
  {
    id: 'market',
    level: 'medium',
    emoji: '🛒',
    th: 'ไปตลาดกับยาย',
    textTh:
      'เช้าวันเสาร์ นิ่มไปตลาดกับยาย ยายซื้อไข่ 6 ฟอง กล้วย 4 ลูก และปลา 1 ตัว ระหว่างเดินกลับ นิ่มถือถุงกล้วย ส่วนยายถือถุงที่เหลือ พอถึงบ้าน แม่ทอดไข่ให้กิน 2 ฟอง',
    textEn:
      'On Saturday morning Nim went to the market with her grandmother. Gran bought 6 eggs, 4 bananas and 1 fish. On the way back Nim carried the bag of bananas while Gran carried the rest. At home, Mum fried 2 of the eggs for them.',
    qsTh: [
      { q: 'ยายซื้อไข่กี่ฟอง', choices: ['4 ฟอง', '6 ฟอง', '8 ฟอง'], a: 1 },
      { q: 'หลังทอดไข่แล้ว เหลือไข่กี่ฟอง', choices: ['2 ฟอง', '3 ฟอง', '4 ฟอง'], a: 2 },
      { q: 'นิ่มถือถุงอะไร', choices: ['ถุงกล้วย', 'ถุงปลา', 'ถุงไข่'], a: 0 },
      { q: 'เรื่องนี้เกิดขึ้นวันอะไร', choices: ['วันศุกร์', 'วันเสาร์', 'วันอาทิตย์'], a: 1 },
    ],
    qsEn: [
      { q: 'How many eggs did Gran buy?', choices: ['4', '6', '8'], a: 1 },
      { q: 'After frying, how many eggs are left?', choices: ['2', '3', '4'], a: 2 },
      { q: 'Which bag did Nim carry?', choices: ['The bananas', 'The fish', 'The eggs'], a: 0 },
      { q: 'Which day was it?', choices: ['Friday', 'Saturday', 'Sunday'], a: 1 },
    ],
  },
  {
    id: 'bike',
    level: 'medium',
    emoji: '🚲',
    th: 'จักรยานคันแรก',
    textTh:
      'กันได้จักรยานคันใหม่ในวันเกิด วันแรกเขาล้มสามครั้ง วันที่สองล้มสองครั้ง วันที่สามล้มครั้งเดียว พอวันที่สี่ กันขี่รอบสนามได้โดยไม่ล้มเลย พ่อปรบมือให้ดัง ๆ',
    textEn:
      'Gun got a new bicycle for his birthday. On the first day he fell three times. On the second day he fell twice. On the third day he fell once. By the fourth day, Gun rode a whole lap of the field without falling at all, and his dad clapped loudly.',
    qsTh: [
      { q: 'กันได้จักรยานตอนไหน', choices: ['วันปีใหม่', 'วันเกิด', 'วันเด็ก'], a: 1 },
      { q: 'รวมทั้งหมด กันล้มกี่ครั้ง', choices: ['5 ครั้ง', '6 ครั้ง', '7 ครั้ง'], a: 1 },
      { q: 'วันที่กันขี่ได้คือวันที่เท่าไหร่', choices: ['วันที่สาม', 'วันที่สี่', 'วันที่ห้า'], a: 1 },
      {
        q: 'เรื่องนี้สอนอะไร',
        choices: ['ล้มแล้วต้องเลิก', 'ฝึกไปเรื่อย ๆ แล้วจะทำได้', 'จักรยานอันตราย'],
        a: 1,
      },
    ],
    qsEn: [
      { q: 'When did Gun get the bicycle?', choices: ['New Year', 'His birthday', 'Children’s Day'], a: 1 },
      { q: 'How many times did he fall in total?', choices: ['5', '6', '7'], a: 1 },
      { q: 'Which day did he ride without falling?', choices: ['Day three', 'Day four', 'Day five'], a: 1 },
      {
        q: 'What does the story teach?',
        choices: [
          'Give up after falling',
          'Keep practising and you will get there',
          'Bicycles are dangerous',
        ],
        a: 1,
      },
    ],
  },
  {
    id: 'lunchbox',
    level: 'medium',
    emoji: '🍱',
    th: 'กล่องข้าวสลับกัน',
    textTh:
      'ตอนพักเที่ยง แพรเปิดกล่องข้าวแล้วพบว่าข้างในเป็นข้าวผัด แต่แม่บอกว่าวันนี้ทำไข่เจียวให้ แพรมองรอบ ๆ แล้วเห็นบอยกำลังงงกับไข่เจียวในกล่องของเขา ทั้งคู่หัวเราะแล้วแลกกล่องกันคืน',
    textEn:
      'At lunchtime Prae opened her lunchbox and found fried rice inside — but Mum had said she was making an omelette. Prae looked around and saw Boy staring, puzzled, at an omelette in his box. They both laughed and swapped the boxes back.',
    qsTh: [
      { q: 'ในกล่องของแพรมีอะไร', choices: ['ไข่เจียว', 'ข้าวผัด', 'ก๋วยเตี๋ยว'], a: 1 },
      { q: 'ทำไมกล่องถึงสลับกัน', choices: ['แพรหยิบผิด', 'แม่ทำผิด', 'บอยขโมย'], a: 0 },
      { q: 'ตอนจบทั้งคู่ทำอะไร', choices: ['ทะเลาะกัน', 'บอกครู', 'แลกกล่องคืน'], a: 2 },
    ],
    qsEn: [
      { q: 'What was in Prae’s box?', choices: ['An omelette', 'Fried rice', 'Noodles'], a: 1 },
      {
        q: 'Why were the boxes swapped?',
        choices: ['Prae picked up the wrong one', 'Mum made a mistake', 'Boy stole it'],
        a: 0,
      },
      {
        q: 'What did they do in the end?',
        choices: ['Argued', 'Told the teacher', 'Swapped the boxes back'],
        a: 2,
      },
    ],
  },
  {
    id: 'library',
    level: 'hard',
    emoji: '📚',
    th: 'ห้องสมุดที่เงียบเกินไป',
    textTh:
      'ห้องสมุดโรงเรียนเคยเงียบจนไม่มีใครอยากเข้า ครูจึงจัดมุมใหม่ให้มีเบาะนั่งและตะกร้าหนังสือภาพวางไว้ระดับสายตาเด็ก เดือนแรกมีนักเรียนเข้ามาเพิ่มขึ้นสองเท่า ครูสังเกตว่าเด็กที่ยืมหนังสือบ่อยขึ้นไม่ใช่เด็กที่อ่านเก่งอยู่แล้ว แต่เป็นเด็กที่เดิมไม่เคยยืมเลย',
    textEn:
      'The school library used to be so silent that nobody wanted to go in. So the teacher rearranged one corner with cushions and put baskets of picture books at children’s eye level. In the first month, twice as many pupils came in. The teacher noticed that the children borrowing more often were not the strong readers — they were the ones who had never borrowed a book at all.',
    qsTh: [
      { q: 'ปัญหาเดิมของห้องสมุดคืออะไร', choices: ['หนังสือน้อย', 'ไม่มีใครอยากเข้า', 'ครูไม่พอ'], a: 1 },
      {
        q: 'ครูแก้ปัญหาด้วยวิธีใด',
        choices: ['ซื้อหนังสือใหม่ทั้งหมด', 'บังคับให้เข้าห้องสมุด', 'จัดมุมนั่งและวางหนังสือให้เอื้อมถึง'],
        a: 2,
      },
      {
        q: 'ใจความสำคัญของเรื่องนี้คืออะไร',
        choices: [
          'การจัดพื้นที่ให้เข้าถึงง่ายเปลี่ยนพฤติกรรมได้',
          'เด็กเก่งอ่านหนังสือมากที่สุด',
          'ห้องสมุดควรเงียบเสมอ',
        ],
        a: 0,
      },
      {
        q: 'ผลที่น่าสนใจที่สุดคืออะไร',
        choices: ['เด็กอ่านเก่งยืมมากขึ้น', 'เด็กที่ไม่เคยยืมเริ่มยืม', 'ครูทำงานน้อยลง'],
        a: 1,
      },
    ],
    qsEn: [
      {
        q: 'What was wrong with the library before?',
        choices: ['Too few books', 'Nobody wanted to go in', 'Not enough teachers'],
        a: 1,
      },
      {
        q: 'How did the teacher fix it?',
        choices: [
          'Bought all new books',
          'Made attendance compulsory',
          'Added a seating corner and put books within reach',
        ],
        a: 2,
      },
      {
        q: 'What is the main idea?',
        choices: [
          'Making a space easy to reach changes behaviour',
          'Strong readers read the most',
          'Libraries should always be silent',
        ],
        a: 0,
      },
      {
        q: 'What was the most interesting result?',
        choices: [
          'Strong readers borrowed more',
          'Children who had never borrowed started to',
          'The teacher had less work',
        ],
        a: 1,
      },
    ],
  },
  {
    id: 'plastic',
    level: 'hard',
    emoji: '♻️',
    th: 'ถังขยะสองใบ',
    textTh:
      'โรงเรียนวางถังขยะสองใบไว้คู่กัน ใบหนึ่งสำหรับขวดพลาสติก อีกใบสำหรับขยะทั่วไป ตอนแรกเด็ก ๆ ยังทิ้งผิดถังบ่อย ครูจึงติดรูปขวดใหญ่ ๆ ไว้บนฝาถัง หลังจากนั้นสองสัปดาห์ ปริมาณขวดที่ทิ้งผิดถังลดลงเกือบหมด ทั้งที่ไม่มีใครยืนเฝ้าเลย',
    textEn:
      'The school put two bins side by side — one for plastic bottles, one for general waste. At first the children often used the wrong bin, so the teacher stuck a large picture of a bottle on the lid. Two weeks later, bottles in the wrong bin had almost disappeared, even though nobody was standing there watching.',
    qsTh: [
      { q: 'ตอนแรกเกิดปัญหาอะไร', choices: ['ถังไม่พอ', 'เด็กทิ้งผิดถัง', 'ไม่มีถังขยะ'], a: 1 },
      { q: 'ครูทำอะไรเพื่อแก้ปัญหา', choices: ['ติดรูปขวดบนฝาถัง', 'ตั้งคนเฝ้า', 'ปรับเงิน'], a: 0 },
      {
        q: 'สาเหตุที่ผลลัพธ์ดีขึ้นน่าจะเป็นเพราะอะไร',
        choices: ['เด็กกลัวโดนดุ', 'สัญลักษณ์ทำให้ตัดสินใจง่ายขึ้น', 'ขยะน้อยลง'],
        a: 1,
      },
      {
        q: 'ข้อสรุปที่ตรงกับเรื่องมากที่สุดคือข้อใด',
        choices: ['ต้องมีคนคอยควบคุมเสมอ', 'การออกแบบที่ดีช่วยให้คนทำถูกได้เอง', 'เด็กไม่สนใจสิ่งแวดล้อม'],
        a: 1,
      },
    ],
    qsEn: [
      {
        q: 'What was the problem at first?',
        choices: ['Not enough bins', 'Children used the wrong bin', 'There were no bins'],
        a: 1,
      },
      {
        q: 'What did the teacher do?',
        choices: ['Stuck a picture of a bottle on the lid', 'Posted a guard', 'Issued fines'],
        a: 0,
      },
      {
        q: 'Why did things most likely improve?',
        choices: [
          'The children were afraid of being told off',
          'The symbol made the choice easy',
          'There was less rubbish',
        ],
        a: 1,
      },
      {
        q: 'Which conclusion best fits?',
        choices: [
          'Someone must always supervise',
          'Good design helps people get it right on their own',
          'Children do not care about the environment',
        ],
        a: 1,
      },
    ],
  },
  {
    id: 'garden',
    level: 'hard',
    emoji: '🌾',
    th: 'แปลงผักหลังห้องเรียน',
    textTh:
      'ห้อง ป.5 ปลูกผักหลังห้องเรียน สัปดาห์แรกทุกคนแย่งกันรดน้ำจนดินแฉะและรากเน่า ครูจึงให้ทำตารางเวรและวัดความชื้นของดินก่อนรดทุกครั้ง เดือนถัดมาผักโตดีขึ้นชัดเจน นักเรียนคนหนึ่งเขียนในสมุดว่า "ดูแลมากเกินไป ก็ทำให้ตายได้เหมือนกัน"',
    textEn:
      'Year 5 planted vegetables behind their classroom. In the first week everyone competed to water them, until the soil was waterlogged and the roots rotted. So the teacher set a rota and had them check how damp the soil was before watering. The next month the plants were clearly healthier. One pupil wrote in her notebook: “Too much care can kill something too.”',
    qsTh: [
      { q: 'ทำไมรากผักถึงเน่าในตอนแรก', choices: ['ไม่มีคนรดน้ำ', 'รดน้ำมากเกินไป', 'แดดแรงเกินไป'], a: 1 },
      {
        q: 'ครูแก้ปัญหาอย่างไร',
        choices: ['เปลี่ยนพันธุ์ผัก', 'ให้ทำตารางเวรและวัดความชื้น', 'ย้ายแปลงผัก'],
        a: 1,
      },
      {
        q: 'ประโยคของนักเรียนสื่อถึงอะไร',
        choices: ['ความพอดีสำคัญกว่าความมากที่สุด', 'ไม่ควรปลูกผัก', 'ครูเข้มงวดเกินไป'],
        a: 0,
      },
    ],
    qsEn: [
      {
        q: 'Why did the roots rot at first?',
        choices: ['Nobody watered them', 'They were watered too much', 'The sun was too strong'],
        a: 1,
      },
      {
        q: 'How did the teacher fix it?',
        choices: ['Changed the vegetables', 'Set a rota and checked soil dampness', 'Moved the plot'],
        a: 1,
      },
      {
        q: 'What does the pupil’s sentence mean?',
        choices: [
          'The right amount matters more than the most',
          'They should not grow vegetables',
          'The teacher was too strict',
        ],
        a: 0,
      },
    ],
  },
]

export const readingsByLevel = (level) => READINGS.filter((r) => r.level === level)
export const readingById = (id) => READINGS.find((r) => r.id === id)
