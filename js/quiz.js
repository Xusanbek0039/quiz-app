/**
 * Quiz functionality for the ITC Quiz App
 */

// State variables
let currentQuiz = null;
let quizQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let quizResults = null;
let selectedCategory = null;
let questionCount = 0;
let timeInMinutes = 0;

// DOM Elements
const quizSelectionElement = document.getElementById('quiz-selection');
const quizContainerElement = document.getElementById('quiz-container');
const resultsContainerElement = document.getElementById('results-container');
const questionTextElement = document.getElementById('question-text');
const optionsContainerElement = document.getElementById('options-container');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const quizTitleElement = document.getElementById('quiz-title');
const progressBarElement = document.getElementById('quiz-progress-bar');
const finishQuizButton = document.getElementById('finish-quiz');
const backToQuizButton = document.getElementById('back-to-quiz');

// Example test data (normally would be loaded from JSON files)
const testData = {
  python: [
    {
      "id": 1,
      "question": "Python-da 'x' o'zgaruvchini qiymati 10 deb belgilashning to'g'ri usuli qaysi?",
      "options": ["x := 10", "var x = 10", "x = 10", "let x = 10"],
      "answer": 2
    },
    {
      "id": 2,
      "question": "Quyidagilardan qaysi biri Python-da ro'yxat e'lon qilishning to'g'ri usuli?",
      "options": ["list = [1, 2, 3]", "list = (1, 2, 3)", "list = {1, 2, 3}", "list = <1, 2, 3>"],
      "answer": 0
    },
    {
      "id": 3,
      "question": "Quyidagi kod natijasi nima bo'ladi?\nprint(2 ** 3)",
      "options": ["6", "8", "5", "Xato"],
      "answer": 1
    },
    {
      "id": 4,
      "question": "Ro'yxatga element qo'shish uchun qaysi metod ishlatiladi?",
      "options": ["push()", "add()", "append()", "insert()"],
      "answer": 2
    },
    {
      "id": 5,
      "question": "Python-da modul import qilishning to'g'ri usuli qaysi?",
      "options": ["#include modul", "import modul", "using modul", "require modul"],
      "answer": 1
    },
    {
      "id": 6,
      "question": "Quyidagilardan qaysi biri Python standart funktsiyasi EMAS?",
      "options": ["len()", "print()", "type()", "size()"],
      "answer": 3
    },
    {
      "id": 7,
      "question": "Python-da izoh yozishning to'g'ri usuli qaysi?",
      "options": ["// Bu izoh", "/* Bu izoh */", "# Bu izoh", "-- Bu izoh"],
      "answer": 2
    },
    {
      "id": 8,
      "question": "Quyidagi kod natijasi nima bo'ladi?\nx = 10\ny = 20\nprint(x + y)",
      "options": ["30", "1020", "Xato", "None"],
      "answer": 0
    },
    {
      "id": 9,
      "question": "Funktsiya aniqlash uchun qaysi kalit so'zdan foydalaniladi?",
      "options": ["function", "def", "fun", "define"],
      "answer": 1
    },
    {
      "id": 10,
      "question": "Python-da doim kamida bir marta ishlaydigan tsikl qaysi?",
      "options": ["for tsikli", "while tsikli", "do-while tsikli", "Yuqoridagilarning hech biri"],
      "answer": 3
    },
    {
      "id": 11,
      "question": "Quyidagi kod natijasi nima bo'ladi?\nprint('Salom' + ' ' + 'Dunyo')",
      "options": ["SalomDunyo", "Salom Dunyo", "Xato", "None"],
      "answer": 1
    },
    {
      "id": 12,
      "question": "Kortej yaratishning to'g'ri usuli qaysi?",
      "options": ["tuple = [1, 2, 3]", "tuple = (1, 2, 3)", "tuple = {1, 2, 3}", "tuple = <1, 2, 3>"],
      "answer": 1
    },
    {
      "id": 13,
      "question": "Python-da 3 * 2 ** 2 ifodaning natijasi nima?",
      "options": ["12", "36", "9", "Xato"],
      "answer": 0
    },
    {
      "id": 14,
      "question": "Ro'yxatdan elementni o'chirish uchun qaysi metod kerak?",
      "options": ["delete()", "remove()", "pop()", "discard()"],
      "answer": 1
    },
    {
      "id": 15,
      "question": "'mevalar' nomli ro'yxatning birinchi elementiga qanday murojaat qilinadi?",
      "options": ["mevalar[0]", "mevalar[1]", "mevalar.first()", "mevalar.get(0)"],
      "answer": 0
    },
    {
      "id": 16,
      "question": "Python-da lug'at (dictionary) qanday aniqlanadi?",
      "options": ["{'ism': 'Ali'}", "['ism', 'Ali']", "('ism', 'Ali')", "<'ism', 'Ali'>"],
      "answer": 0
    },
    {
      "id": 17,
      "question": "Lug'atdan kalitni o'chirish uchun qaysi operator yoki metod ishlatiladi?",
      "options": ["del", "remove()", "pop()", "hammasi"],
      "answer": 3
    },
    {
      "id": 18,
      "question": "Quyidagilardan qaysi biri Python-da to'g'ri identifikator emas?",
      "options": ["my_var", "_var", "2var", "var_2"],
      "answer": 2
    },
    {
      "id": 19,
      "question": "Quyidagi kod natijasi nima bo'ladi?\nprint(type(5.5))",
      "options": ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'bool'>"],
      "answer": 1
    },
    {
      "id": 20,
      "question": "Shartli operatorlardan qaysi biri 'teng emas' ni tekshiradi?",
      "options": ["==", "!=", "<>", "="],
      "answer": 1
    },
    {
      "id": 21,
      "question": "Python-da satr (string) tipini aniqlash uchun qaysi funksiya ishlatiladi?",
      "options": ["type()", "str()", "int()", "float()"],
      "answer": 0
    },
    {
      "id": 22,
      "question": "For tsiklida diapazon yaratish uchun qaysi funksiya kerak?",
      "options": ["range()", "loop()", "start()", "step()"],
      "answer": 0
    },
    {
      "id": 23,
      "question": "Python-da try-except bloki nima uchun kerak?",
      "options": ["Dastur tezligini oshirish", "Xatolarni boshqarish", "Fayllarni ochish", "Ma'lumotlarni saqlash"],
      "answer": 1
    },
    {
      "id": 24,
      "question": "Quyidagi kod natijasi nima bo'ladi?\nprint('Hello'[1])",
      "options": ["H", "e", "l", "Error"],
      "answer": 1
    },
    {
      "id": 25,
      "question": "Satrni teskari aylantirishning eng oddiy usuli qaysi?",
      "options": ["s[::-1]", "reverse(s)", "reversed(s)", "s.reverse()"],
      "answer": 0
    },
    {
      "id": 26,
      "question": "Faylni o'qish uchun qaysi rejim kerak?",
      "options": ["'w'", "'a'", "'r'", "'rb'"],
      "answer": 2
    },
    {
      "id": 27,
      "question": "Python-da klass e'lon qilish uchun qaysi kalit so'zdan foydalaniladi?",
      "options": ["class", "def", "struct", "object"],
      "answer": 0
    },
    {
      "id": 28,
      "question": "OOPda meros olish (inheritance) nima?",
      "options": ["Yangi obyekt yaratish", "Boshqa klassdan xususiyatlarni o'tkazish", "Metodni qayta aniqlash", "Obyektni o'chirish"],
      "answer": 1
    },
    {
      "id": 29,
      "question": "Quyidagi kod natijasi nima bo'ladi?\nprint(len([1, 2, 3]))",
      "options": ["1", "2", "3", "Error"],
      "answer": 2
    },
    {
      "id": 30,
      "question": "Python-da lambda nima vazifani bajaradi?",
      "options": ["Nomli funksiya", "Nomsiz funksiya", "Tsikl", "Shartli operator"],
      "answer": 1
    },
    {
      "id": 31,
      "question": "List comprehension misoli qaysi?",
      "options": ["[x for x in range(5)]", "for x in range(5): print(x)", "map(lambda x: x, range(5))", "filter(lambda x: x > 0, range(5))"],
      "answer": 0
    },
    {
      "id": 32,
      "question": "Set (to'plam) bilan list orasidagi farq nima?",
      "options": ["Elementlar tartiblangan", "Elementlar takrorlanishi mumkin", "Takrorlanishga ruxsat berilmagan", "Hammasi"],
      "answer": 2
    },
    {
      "id": 33,
      "question": "Quyidagi kod natijasi nima bo'ladi?\nprint(True and False)",
      "options": ["True", "False", "Error", "None"],
      "answer": 1
    },
    {
      "id": 34,
      "question": "Python-da faylga yozish uchun qaysi rejim kerak?",
      "options": ["'r'", "'a'", "'w'", "'w' yoki 'a'"],
      "answer": 3
    },
    {
      "id": 35,
      "question": "Modul ichidan bitta funksiyani import qilish uchun qaysi sintaksis to'g'ri?",
      "options": ["import modul.funksiya", "from modul import funksiya", "use modul.funksiya", "require modul.funksiya"],
      "answer": 1
    },
    {
      "id": 36,
      "question": "Quyidagi kod natijasi nima bo'ladi?\nprint(10 / 3)",
      "options": ["3", "3.333...", "3.0", "Error"],
      "answer": 1
    },
    {
      "id": 37,
      "question": "Python-da ikkilik sanoq tizimidan o'nlikka o'tish uchun qaysi funksiya ishlatiladi?",
      "options": ["bin()", "oct()", "int()", "hex()"],
      "answer": 2
    },
    {
      "id": 38,
      "question": "JSON faylni o'qish uchun qaysi modul kerak?",
      "options": ["os", "sys", "json", "math"],
      "answer": 2
    },
    {
      "id": 39,
      "question": "Quyidagi kod natijasi nima bo'ladi?\nprint(sorted([3, 1, 2]))",
      "options": ["[1, 2, 3]", "[3, 2, 1]", "[3, 1, 2]", "Error"],
      "answer": 0
    },
    {
      "id": 40,
      "question": "Python-da foydalanuvchidan kiritma olish uchun qaysi funksiya ishlatiladi?",
      "options": ["input()", "read()", "get()", "scan()"],
      "answer": 0
    },
    {
      "id": 41,
      "question": "Quyidagi kod natijasi nima bo'ladi?\nprint(5 % 2)",
      "options": ["0", "1", "2", "5"],
      "answer": 1
    },
    {
      "id": 42,
      "question": "Quyidagilardan qaysi biri mutable (o'zgartiriluvchan) tur?",
      "options": ["tuple", "string", "list", "integer"],
      "answer": 2
    },
    {
      "id": 43,
      "question": "Python-da obyektning turi nima bilan aniqlanadi?",
      "options": ["type()", "dir()", "help()", "id()"],
      "answer": 0
    },
    {
      "id": 44,
      "question": "Quyidagi kod natijasi nima bo'ladi?\nprint('abc' * 2)",
      "options": ["abc", "abcabc", "aabbcc", "Error"],
      "answer": 1
    },
    {
      "id": 45,
      "question": "Pip nima vazifani bajaradi?",
      "options": ["Python dasturlash tili", "Python interpretatori", "Python paketlari boshqaruvchisi", "Test vositasi"],
      "answer": 2
    },
    {
      "id": 46,
      "question": "Python-da global o'zgaruvchini lokal funksiyada o'zgartirish uchun qaysi kalit so'z kerak?",
      "options": ["local", "nonlocal", "global", "static"],
      "answer": 2
    },
    {
      "id": 47,
      "question": "Quyidagi kod natijasi nima bo'ladi?\nprint(2 == 2.0)",
      "options": ["True", "False", "Error", "None"],
      "answer": 0
    },
    {
      "id": 48,
      "question": "Python-da generator yaratish uchun qaysi kalit so'z kerak?",
      "options": ["yield", "return", "generate", "make"],
      "answer": 0
    },
    {
      "id": 49,
      "question": "Quyidagi kod natijasi nima bo'ladi?\nprint(None == False)",
      "options": ["True", "False", "Error", "None"],
      "answer": 1
    },
    {
      "id": 50,
      "question": "Python-da __init__ metodi nima vazifani bajaradi?",
      "options": ["Ob'yektni o'chirish", "Ob'yekt yaratilganda avtomatik chaqiriladi", "Metodni qayta aniqlash", "Klassni aniqlash"],
      "answer": 1
    },
    {
        "id": 51,
        "question": "'None' nima ifodalaydi?",
        "options": ["Bo'sh qiymat", "False qiymati", "Xato", "0 soni"],
        "answer": 0
    },
    {
        "id": 52,
        "question": "Quyidagilardan qaysi biri 'mutable' emas?",
        "options": ["list", "dict", "set", "tuple"],
        "answer": 3
    },
    {
        "id": 53,
        "question": "Python-da fayl yopish uchun qaysi metod kerak?",
        "options": ["close()", "exit()", "end()", "finish()"],
        "answer": 0
    },
    {
        "id": 54,
        "question": "Quyidagi kod natijasi qanday?\nx = [1, 2]; y = x; y.append(3); print(x)",
        "options": ["[1, 2]", "[1, 2, 3]", "Xato", "[ ]"],
        "answer": 1
    },
    {
        "id": 55,
        "question": "sorted() funktsiyasi qaytadi:",
        "options": ["Yangi saralangan ro'yxat", "Asl ro'yxatni o'zgartiradi", "Set", "Tuple"],
        "answer": 0
    },
    {
        "id": 56,
        "question": "Kvadrat ildiz hisoblash uchun qaysi moduldan foydalaniladi?",
        "options": ["math", "random", "os", "sys"],
        "answer": 0
    },
    {
        "id": 57,
        "question": "Quyidagi kod natijasi qanday?\nprint('hello'.upper())",
        "options": ["HELLO", "Hello", "hello", "Error"],
        "answer": 0
    },
    {
        "id": 58,
        "question": "List comprehension bilan toq sonlar ketma-ketligini hosil qiling:",
        "options": ["[x for x in range(10) if x % 2 == 1]", "[x*2 for x in range(10)]", "[x for x in range(10)]", "[x+1 for x in range(10)]"],
        "answer": 0
    },
    {
        "id": 59,
        "question": "Funksiya ichida lokal o'zgaruvchi e'lon qilish uchun qaysi so'z ishlatiladi?",
        "options": ["global", "nonlocal", "local", "var"],
        "answer": 1
    },
    {
        "id": 60,
        "question": "Quyidagi kod natijasi qanday?\nprint(3 in {1: 'a', 2: 'b'})",
        "options": ["True", "False", "Xato", "None"],
        "answer": 1
    },
    {
        "id": 61,
        "question": "JSON formatidan Python obyektiga o'tish uchun qaysi metod kerak?",
        "options": ["json.loads()", "json.dumps()", "json.load()", "json.dump()"],
        "answer": 0
    },
    {
        "id": 62,
        "question": "Satrda belgini almashtirish uchun qaysi metod ishlatiladi?",
        "options": ["replace()", "change()", "modify()", "update()"],
        "answer": 0
    },
    {
        "id": 63,
        "question": "Quyidagi kod natijasi qanday?\nprint(bool([]))",
        "options": ["True", "False", "None", "Xato"],
        "answer": 1
    },
    {
        "id": 64,
        "question": "Piknik operatori (walrus) qachon kirtilgan?",
        "options": ["Python 3.6", "Python 3.8", "Python 3.10", "Python 3.12"],
        "answer": 1
    },
    {
        "id": 65,
        "question": "OOPda inkapsulyatsiya nima?",
        "options": ["Metodlarni yashirish", "Klass xususiyatlarini himoya qilish", "Klasslarni meros qilib olish", "Hammasi"],
        "answer": 1
    },
    {
        "id": 66,
        "question": "Quyidagi kod natijasi qanday?\nprint([1, 2] + [3])",
        "options": ["[1, 2, 3]", "[1, 2, [3]]", "Xato", "6"],
        "answer": 0
    },
    {
        "id": 67,
        "question": "Python-da 'with' operatori nima uchun kerak?",
        "options": ["Fayllarni avtomatik yopish", "Tsikl yaratish", "Shart tekshirish", "Funksiya chaqirish"],
        "answer": 0
    },
    {
        "id": 68,
        "question": "Quyidagi kod natijasi qanday?\nprint(set([1, 2, 2, 3]))",
        "options": ["{1, 2, 3}", "{1, 2}", "{1, 2, 2, 3}", "Xato"],
        "answer": 0
    },
    {
        "id": 69,
        "question": "Funksiya parametri sifatida *args nima qiladi?",
        "options": ["Cheksiz kalitli argumentlar", "Cheksiz pozitsion argumentlar", "Bitta qiymat", "Ro'yxat"],
        "answer": 1
    },
    {
        "id": 70,
        "question": "Quyidagi kod natijasi qanday?\nprint('abc'.isalpha())",
        "options": ["True", "False", "None", "Xato"],
        "answer": 0
    },
    {
      "id": 71,
      "question": "Quyidagi kod natijasi qanday?\nprint((1, 2) + (3))",
      "options": ["(1, 2, 3)", "(1, 2, (3))", "TypeError", "Xato"],
      "answer": 2
    },
      {
          "id": 71,
          "question": "Quyidagi kod natijasi qanday?\nprint('123abc'.isalpha())",
          "options": ["True", "False", "None", "Xato"],
          "answer": 1
      },
      {
          "id": 72,
          "question": "Quyidagi kod natijasi qanday?\nprint(bool('False'))",
          "options": ["True", "False", "None", "Xato"],
          "answer": 0
      },
      {
          "id": 73,
          "question": "Quyidagi kod natijasi qanday?\nprint(len(set('hello')))",
          "options": ["4", "5", "3", "6"],
          "answer": 0
      },
      {
          "id": 74,
          "question": "Quyidagi kod natijasi qanday?\nprint('hello world'.title())",
          "options": ["Hello World", "Hello world", "hello World", "HELLO WORLD"],
          "answer": 0
      },
      {
          "id": 75,
          "question": "Quyidagi kod natijasi qanday?\nprint(''.join(reversed('abc')))",
          "options": ["cba", "abc", "bac", "bca"],
          "answer": 0
      },
      {
          "id": 76,
          "question": "Quyidagi kod natijasi qanday?\nprint([i for i in range(3)])",
          "options": ["[0, 1, 2]", "[1, 2, 3]", "[0, 1, 2, 3]", "[1, 2]"],
          "answer": 0
      },
      {
          "id": 77,
          "question": "Quyidagi kod natijasi qanday?\nprint((lambda x: x ** 2)(3))",
          "options": ["6", "9", "3", "12"],
          "answer": 1
      },
      {
          "id": 78,
          "question": "Quyidagi kod natijasi qanday?\nprint(10 // 3)",
          "options": ["3", "3.33", "4", "0"],
          "answer": 0
      },
      {
          "id": 79,
          "question": "Quyidagi kod natijasi qanday?\nprint(10 % 3)",
          "options": ["1", "3", "0", "10"],
          "answer": 0
      },
      {
          "id": 80,
          "question": "Quyidagi kod natijasi qanday?\nprint(type([]) is list)",
          "options": ["True", "False", "None", "Xato"],
          "answer": 0
      },
      {
          "id": 81,
          "question": "Quyidagi kod natijasi qanday?\nprint([] == False)",
          "options": ["True", "False", "None", "Error"],
          "answer": 1
      },
      {
          "id": 82,
          "question": "Quyidagi kod natijasi qanday?\nprint({1,2,3} & {2,3,4})",
          "options": ["{2, 3}", "{1, 2}", "{3, 4}", "{1, 4}"],
          "answer": 0
      },
      {
          "id": 83,
          "question": "Quyidagi kod natijasi qanday?\nprint('A' < 'a')",
          "options": ["True", "False", "Error", "None"],
          "answer": 0
      },
      {
          "id": 84,
          "question": "Quyidagi kod natijasi qanday?\nprint(None == False)",
          "options": ["True", "False", "None", "Error"],
          "answer": 1
      },
      {
          "id": 85,
          "question": "Quyidagi kod natijasi qanday?\nprint(0 == False)",
          "options": ["True", "False", "None", "Error"],
          "answer": 0
      },
      {
          "id": 86,
          "question": "Quyidagi kod natijasi qanday?\nprint([] is [])",
          "options": ["True", "False", "Error", "None"],
          "answer": 1
      },
      {
          "id": 87,
          "question": "Quyidagi kod natijasi qanday?\nprint(' '.isspace())",
          "options": ["True", "False", "None", "Error"],
          "answer": 0
      },
      {
          "id": 88,
          "question": "Quyidagi kod natijasi qanday?\nprint(''.isspace())",
          "options": ["True", "False", "None", "Error"],
          "answer": 1
      },
      {
          "id": 89,
          "question": "Quyidagi kod natijasi qanday?\nprint(1 < 2 < 3)",
          "options": ["True", "False", "None", "Xato"],
          "answer": 0
      },
      {
          "id": 90,
          "question": "Quyidagi kod natijasi qanday?\nprint(3 > 2 > 1)",
          "options": ["True", "False", "None", "Xato"],
          "answer": 0
      },
      {
          "id": 91,
          "question": "Quyidagi kod natijasi qanday?\nprint('10' > '2')",
          "options": ["True", "False", "None", "Xato"],
          "answer": 0
      },
      {
          "id": 92,
          "question": "Quyidagi kod natijasi qanday?\nprint('' == 0)",
          "options": ["True", "False", "None", "Error"],
          "answer": 1
      },
      {
          "id": 93,
          "question": "Quyidagi kod natijasi qanday?\nprint(0.1 + 0.2 == 0.3)",
          "options": ["True", "False", "None", "Xato"],
          "answer": 1
      },
      {
          "id": 94,
          "question": "Quyidagi kod natijasi qanday?\nprint('Python'[::-1])",
          "options": ["nohtyP", "Python", "P", "Error"],
          "answer": 0
      },
      {
          "id": 95,
          "question": "Quyidagi kod natijasi qanday?\nprint({} == False)",
          "options": ["True", "False", "Error", "None"],
          "answer": 1
      },
      {
          "id": 96,
          "question": "Quyidagi kod natijasi qanday?\nprint(len(' ') == 1)",
          "options": ["True", "False", "0", "Error"],
          "answer": 0
      },
      {
          "id": 97,
          "question": "Quyidagi kod natijasi qanday?\nprint(True + True + False)",
          "options": ["2", "1", "0", "Error"],
          "answer": 0
      },
      {
          "id": 98,
          "question": "Quyidagi kod natijasi qanday?\nprint('Hello' > 'hello')",
          "options": ["False", "True", "None", "Error"],
          "answer": 0
      },
      {
          "id": 99,
          "question": "Quyidagi kod natijasi qanday?\nprint((0, 1) < (0, 2))",
          "options": ["True", "False", "None", "Error"],
          "answer": 0
      },
      {
          "id": 100,
          "question": "Quyidagi kod natijasi qanday?\nprint(all([True, False, True]))",
          "options": ["False", "True", "None", "Error"],
          "answer": 0
      },
      {
          "id": 101,
          "question": "Quyidagi kod natijasi qanday?\nprint(any([]))",
          "options": ["False", "True", "Error", "None"],
          "answer": 0
      },
      {
          "id": 102,
          "question": "Quyidagi kod natijasi qanday?\nprint(len([[]]))",
          "options": ["1", "0", "Error", "2"],
          "answer": 0
      },
      {
          "id": 103,
          "question": "Quyidagi kod natijasi qanday?\nprint(sum([True, True, False]))",
          "options": ["2", "1", "3", "0"],
          "answer": 0
      },
      {
          "id": 104,
          "question": "Quyidagi kod natijasi qanday?\nprint('5' * 2)",
          "options": ["55", "10", "Error", "25"],
          "answer": 0
      },
      {
          "id": 105,
          "question": "Quyidagi kod natijasi qanday?\nprint([1, 2] + [3, 4])",
          "options": ["[1, 2, 3, 4]", "[1, 2, [3, 4]]", "Error", "[4, 3, 2, 1]"],
          "answer": 0
      },
      {
          "id": 106,
          "question": "Quyidagi kod natijasi qanday?\nprint({1: 'a', 2: 'b'}[1])",
          "options": ["a", "1", "b", "Error"],
          "answer": 0
      },
      {
          "id": 107,
          "question": "Quyidagi kod natijasi qanday?\nprint(3 * 'ab')",
          "options": ["ababab", "ab3", "Error", "None"],
          "answer": 0
      },
      {
          "id": 108,
          "question": "Quyidagi kod natijasi qanday?\nprint(list('abc'))",
          "options": ["['a', 'b', 'c']", "['abc']", "abc", "Error"],
          "answer": 0
      },
      {
          "id": 109,
          "question": "Quyidagi kod natijasi qanday?\nprint(True is 1)",
          "options": ["False", "True", "Error", "None"],
          "answer": 1
      },
      {
          "id": 110,
          "question": "Quyidagi kod natijasi qanday?\nprint(None is None)",
          "options": ["True", "False", "Error", "None"],
          "answer": 0
      }
    
  
  ],
















  
  html: [
    {
      "id": 1,
      "question": "HTML hujjatini belgilash uchun qaysi tegdan foydalaniladi?",
      "options": ["<html>", "<body>", "<doc>", "<root>"],
      "answer": 0
    },
    {
      "id": 2,
      "question": "HTML elementga inline uslub (style) berish uchun qaysi atributdan foydalaniladi?",
      "options": ["class", "style", "css", "format"],
      "answer": 1
    },
    {
      "id": 3,
      "question": "Paragraf yaratish uchun qaysi HTML elementidan foydalaniladi?",
      "options": ["<paragraph>", "<p>", "<para>", "<text>"],
      "answer": 1
    },
    {
      "id": 4,
      "question": "HTML nima ma'noni anglatadi?",
      "options": ["Gipermatn Belgi Tilidir", "Giperbog'lanmalar va Matn Belgi Tilidir", "Uy vositasi Belgi Tilidir", "Gipermatn Mashina Tilidir"],
      "answer": 0
    },
    {
      "id": 5,
      "question": "Giperhavola yaratish uchun qaysi HTML tegdan foydalaniladi?",
      "options": ["<link>", "<a>", "<href>", "<url>"],
      "answer": 1
    },
    {
      "id": 6,
      "question": "Hujjat sarlavhasini aniqlash uchun qaysi HTML elementidan foydalaniladi?",
      "options": ["<header>", "<title>", "<h1>", "<head>"],
      "answer": 1
    },
    {
      "id": 7,
      "question": "Rasm joylash uchun qaysi HTML elementidan foydalaniladi?",
      "options": ["<image>", "<img>", "<picture>", "<src>"],
      "answer": 1
    },
    {
      "id": 8,
      "question": "Ro'yxat elementini belgilash uchun qaysi teg kerak?",
      "options": ["<li>", "<item>", "<list>", "<ul>"],
      "answer": 0
    },
    {
      "id": 9,
      "question": "Rasmlar uchun alternativ matnni kiritish uchun qaysi atribut ishlatiladi?",
      "options": ["title", "src", "alt", "description"],
      "answer": 2
    },
    {
      "id": 10,
      "question": "Jadval yaratish uchun qaysi element kerak?",
      "options": ["<table>", "<tab>", "<tr>", "<grid>"],
      "answer": 0
    },
    {
      "id": 11,
      "question": "Belgilash katakchasini (checkbox) yaratish uchun to'g'ri HTML qanday?",
      "options": ["<input type=\"check\">", "<check>", "<input type=\"checkbox\">", "<checkbox>"],
      "answer": 2
    },
    {
      "id": 12,
      "question": "Navigatsiya havolalarini belgilash uchun qaysi elementdan foydalaniladi?",
      "options": ["<nav>", "<navigation>", "<links>", "<navbar>"],
      "answer": 0
    },
    {
      "id": 13,
      "question": "HTML tegni yopish uchun qaysi belgidan foydalaniladi?",
      "options": ["$", "^", "/", "*"],
      "answer": 2
    },
    {
      "id": 14,
      "question": "Yer osti menyudan (drop-down list) foydalanish uchun qaysi HTML kod to'g'ri?",
      "options": ["<select>", "<input type=\"dropdown\">", "<input type=\"list\">", "<list>"],
      "answer": 0
    },
    {
      "id": 15,
      "question": "Matn kirish maydonini yaratish uchun to'g'ri HTML?",
      "options": ["<textfield>", "<input type=\"text\">", "<input type=\"textfield\">", "<textinput>"],
      "answer": 1
    },
    {
      "id": 16,
      "question": "Hujjatning pastki qismi (footer) uchun qaysi elementdan foydalaniladi?",
      "options": ["<footer>", "<bottom>", "<section>", "<banner>"],
      "answer": 0
    },
    {
      "id": 17,
      "question": "<br> tegi nima vazifani bajaradi?",
      "options": ["Matnni qalin qilib chiqaradi", "Yangi satrga o'tkazadi", "Chegarani yaratadi", "Verkkal ro'yxat hosil qiladi"],
      "answer": 1
    },
    {
      "id": 18,
      "question": "Raqamlangan ro'yxat yaratish uchun qaysi element kerak?",
      "options": ["<ul>", "<dl>", "<ol>", "<list>"],
      "answer": 2
    },
    {
      "id": 19,
      "question": "Havola qilingan hujjat URL manzilini ko'rsatish uchun qaysi atributdan foydalaniladi?",
      "options": ["url", "href", "src", "link"],
      "answer": 1
    },
    {
      "id": 20,
      "question": "HTML elementga noyob identifikator berish uchun qaysi atributdan foydalaniladi?",
      "options": ["class", "name", "id", "key"],
      "answer": 2
    },
    {
      "id": 21,
      "question": "Formada ma'lumotlarni jo'natish uchun qaysi atribut kerak?",
      "options": ["method", "action", "submit", "both"],
      "answer": 3
    },
    {
      "id": 22,
      "question": "Tegni faqat o'qish uchun qilish uchun qaysi atributdan foydalaniladi?",
      "options": ["readonly", "disabled", "locked", "fixed"],
      "answer": 0
    },
    {
      "id": 23,
      "question": "Elementni brauzerda avtomatik ravishda tanlash uchun qaysi atribut kerak?",
      "options": ["autofocus", "auto", "focus", "highlight"],
      "answer": 0
    },
    {
      "id": 24,
      "question": "Rasmga so'ngra yuklanayotgan animatsiyani berish uchun qaysi atribut?",
      "options": ["loading", "preload", "buffer", "delay"],
      "answer": 0
    },
    {
      "id": 25,
      "question": "Barcha sahifa uchun umumiy stil varag'i (CSS) ulash uchun qaysi tegdan foydalaniladi?",
      "options": ["<script>", "<style>", "<link>", "<stylesheet>"],
      "answer": 2
    },
    {
      "id": 26,
      "question": "Sahifaga audio qo'shish uchun qaysi elementdan foydalaniladi?",
      "options": ["<video>", "<audio>", "<music>", "<sound>"],
      "answer": 1
    },
    {
      "id": 27,
      "question": "HTML5 da yangi qo'shilgan teglardan biri qaysi?",
      "options": ["<div>", "<span>", "<article>", "<b>"],
      "answer": 2
    },
    {
      "id": 28,
      "question": "Sahifaning yuqori qismi (header) uchun qaysi element mos keladi?",
      "options": ["<header>", "<top>", "<main>", "<nav>"],
      "answer": 0
    },
    {
      "id": 29,
      "question": "Ma'lumotlar bazasiga bog'lanish uchun qaysi atribut kerak?",
      "options": ["data-src", "data-id", "data-db", "bunday atribut yo'q"],
      "answer": 3
    },
    {
      "id": 30,
      "question": "Kontentni qidiruv tizimlari uchun optimallashtirishda qaysi teg muhim?",
      "options": ["<meta>", "<title>", "<seo>", "<keywords>"],
      "answer": 0
    },
    {
      "id": 31,
      "question": "Elementga bosilganda hodisa chaqirish uchun qaysi atribut ishlatiladi?",
      "options": ["onhover", "onclick", "onpress", "onselect"],
      "answer": 1
    },
    {
      "id": 32,
      "question": "Sahifaga video joylash uchun qaysi elementdan foydalaniladi?",
      "options": ["<video>", "<movie>", "<media>", "<clip>"],
      "answer": 0
    },
    {
      "id": 33,
      "question": "Bo'sh qiymatli input maydonini tekshirish uchun qaysi atribut kerak?",
      "options": ["required", "empty", "null", "check"],
      "answer": 0
    },
    {
      "id": 34,
      "question": "Input maydoni uchun minimal uzunlikni belgilash uchun qaysi atribut?",
      "options": ["minlength", "min", "minimum", "minchars"],
      "answer": 0
    },
    {
      "id": 35,
      "question": "Forma ma'lumotlari serverga yuborilganda qaysi metod xavfsiz hisoblanadi?",
      "options": ["GET", "POST", "SEND", "FETCH"],
      "answer": 1
    },
    {
      "id": 36,
      "question": "Qaysi teg orqali matn ustiga giperhavola qo'shish mumkin emas?",
      "options": ["<a>", "<p>", "<span>", "<div>"],
      "answer": 1
    },
    {
      "id": 37,
      "question": "SVG nima uchun ishlatiladi?",
      "options": ["Vektor grafika", "Video", "Audio", "Rastr rasmlar"],
      "answer": 0
    },
    {
      "id": 38,
      "question": "Canvas elementi qayerda ishlatiladi?",
      "options": ["Ovoz yozish", "Video", "Grafika chizish", "Shrift tanlash"],
      "answer": 2
    },
    {
      "id": 39,
      "question": "HTML5 da qo'shilgan form elementlaridan biri?",
      "options": ["<input type='date'>", "<input type='text'>", "<input type='password'>", "<input type='number'>"],
      "answer": 0
    },
    {
      "id": 40,
      "question": "Input maydoniga maksimal son qiymatini berish uchun qaysi atribut kerak?",
      "options": ["maxvalue", "max", "maximum", "maxnum"],
      "answer": 1
    },
    {
      "id": 41,
      "question": "Faylni yuklash imkonini beruvchi input turini tanlang.",
      "options": ["<input type='text'>", "<input type='file'>", "<input type='download'>", "<input type='upload'>"],
      "answer": 1
    },
    {
      "id": 42,
      "question": "Radio tugmalarni guruhlash uchun ularning qaysi atributi bir xil bo'lishi kerak?",
      "options": ["type", "name", "id", "value"],
      "answer": 1
    },
    {
      "id": 43,
      "question": "Dinamik sahifalarni yaratish uchun HTML bilan qaysi til birga ishlatiladi?",
      "options": ["Java", "C++", "JavaScript", "SQL"],
      "answer": 2
    },
    {
      "id": 44,
      "question": "HTML-da qanday komentar yozish mumkin?",
      "options": ["// bu komment", "/* bu komment */", "<!-- bu komment -->", "'bu komment"],
      "answer": 2
    },
    {
      "id": 45,
      "question": "Tablitsadagi satrni belgilash uchun qaysi tegdan foydalaniladi?",
      "options": ["<td>", "<tr>", "<th>", "<table>"],
      "answer": 1
    },
    {
      "id": 46,
      "question": "Tablitsadagi ustunni belgilash uchun qaysi tegdan foydalaniladi?",
      "options": ["<td>", "<tr>", "<th>", "<col>"],
      "answer": 0
    },
    {
      "id": 47,
      "question": "Forma natijasini qayerga yuborish kerakligini ko'rsatish uchun qaysi atributdan foydalaniladi?",
      "options": ["method", "target", "action", "form"],
      "answer": 2
    },
    {
      "id": 48,
      "question": "Elementga CSS stilini bevosita berish uchun qaysi atributdan foydalaniladi?",
      "options": ["class", "id", "style", "css"],
      "answer": 2
    },
    {
      "id": 49,
      "question": "HTML5 da yangi qo'shilgan ma'lumot saqlash vositalari?",
      "options": ["localStorage", "sessionStorage", "cookies", "hammasi"],
      "answer": 3
    },
    {
      "id": 50,
      "question": "Responsive dizayn uchun qaysi meta teg zarur?",
      "options": ["<meta name='viewport'>", "<meta charset='UTF-8'>", "<meta http-equiv='X-UA-Compatible'>", "<meta name='author'>"],
      "answer": 0
    }
  ],













  js: [
    {
      "id": 1,
      "question": "JavaScriptda o'zgaruvchini e'lon qilishning to'g'ri usuli qaysi?",
      "options": ["variable x = 10;", "var x = 10;", "x = 10;", "int x = 10;"],
      "answer": 1
    },
    {
      "id": 2,
      "question": "Satrni kichik harflarga aylantirish uchun qaysi metoddan foydalaniladi?",
      "options": ["toLowerCase()", "toLower()", "changeCase(lower)", "lowerCase()"],
      "answer": 0
    },
    {
      "id": 3,
      "question": "JavaScriptda funktsiya yaratishning to'g'ri usuli qaysi?",
      "options": ["function:myFunction()", "function myFunction()", "function = myFunction()", "myFunction() = function"],
      "answer": 1
    },
    {
      "id": 4,
      "question": "Funktsiyani chaqirishning to'g'ri usuli qaysi?",
      "options": ["call myFunction()", "myFunction()", "call function myFunction()", "Call.myFunction()"],
      "answer": 1
    },
    {
      "id": 5,
      "question": "JavaScriptda izoh yozishning to'g'ri usuli qaysi?",
      "options": ["# Bu izoh", "// Bu izoh", "/* Bu izoh */", "<!-- Bu izoh -->"],
      "answer": 1
    },
    {
      "id": 6,
      "question": "Massiv yaratishning to'g'ri usuli qaysi?",
      "options": ["var ranglar = 'qizil', 'yashil', 'ko'k'", "var ranglar = (1:'qizil', 2:'yashil', 3:'ko'k')", "var ranglar = ['qizil', 'yashil', 'ko'k']", "var ranglar = 1 = ('qizil'), 2 = ('yashil'), 3 = ('ko'k')"],
      "answer": 2
    },
    {
      "id": 7,
      "question": "'mevalar' nomli massivning birinchi elementiga murojaat qilishning to'g'ri usuli qaysi?",
      "options": ["mevalar[0]", "mevalar[1]", "mevalar.first()", "mevalar.get(0)"],
      "answer": 0
    },
    {
      "id": 8,
      "question": "JavaScriptda shartli operatorlar qaysilar?",
      "options": ["==, !=, ===", ">, <, =", "+, -", "hammasi"],
      "answer": 3
    },
    {
      "id": 9,
      "question": "JavaScriptda obyekt yaratishning to'g'ri usuli qaysi?",
      "options": ["var obj = {}", "var obj = []", "var obj = ()", "var obj = new Object[]"],
      "answer": 0
    },
    {
      "id": 10,
      "question": "JavaScriptda DOM elementini olishning to'g'ri usuli qaysi?",
      "options": ["document.getElementById('id')", "getElementById('id')", "dom.select('#id')", "$('#id')"],
      "answer": 0
    },
    {
      "id": 11,
      "question": "JavaScriptda setInterval nima vazifani bajaradi?",
      "options": ["Bir martta funksiya chaqirish", "Berilgan vaqt oralig'ida takrorlab chaqirish", "Funksiyani kechiktirish", "Funksiyani to'xtatish"],
      "answer": 1
    },
    {
      "id": 12,
      "question": "setTimeout funksiyasi qanday ishlaydi?",
      "options": ["Cheksiz takrorlanadi", "Berilgan vaqt o'tgach bir marta chaqiriladi", "Xatoga tushsa chaqiriladi", "Foydalanuvchi kiritmaguncha kutadi"],
      "answer": 1
    },
    {
      "id": 13,
      "question": "JavaScriptda JSON ma'lumotni JS obyektiga aylantirish uchun qaysi funksiya ishlatiladi?",
      "options": ["JSON.parse()", "JSON.stringify()", "parseJSON()", "stringifyJSON()"],
      "answer": 0
    },
    {
      "id": 14,
      "question": "JavaScriptda JS obyektini JSONga aylantirish uchun qaysi funksiya ishlatiladi?",
      "options": ["JSON.parse()", "JSON.stringify()", "parseJSON()", "stringifyJSON()"],
      "answer": 1
    },
    {
      "id": 15,
      "question": "JavaScriptda arrayni teskari qilish uchun qaysi metod ishlatiladi?",
      "options": ["reverse()", "sort()", "pop()", "shift()"],
      "answer": 0
    },
    {
      "id": 16,
      "question": "JavaScriptda eventListener qanday qo'shiladi?",
      "options": ["element.addEventListener('event', func)", "element.onEvent = func", "element.attachEvent('event', func)", "hammasi"],
      "answer": 3
    },
    {
      "id": 17,
      "question": "JavaScriptda typeof nima vazifani bajaradi?",
      "options": ["O'zgaruvchini o'chirish", "O'zgaruvchining turini aniqlash", "O'zgaruvchini o'zgartirish", "O'zgaruvchini qo'shish"],
      "answer": 1
    },
    {
      "id": 18,
      "question": "NaN nimani anglatadi?",
      "options": ["Noto'g'ri raqam", "Mavjud bo'lmagan obyekt", "Null qiymat", "Butun son"],
      "answer": 0
    },
    {
      "id": 19,
      "question": "JavaScriptda == va === orasidagi farq nima?",
      "options": ["=== turini ham tekshiradi", "== faqat qiymatni tekshiradi", "bir xil", "hammasi"],
      "answer": 3
    },
    {
      "id": 20,
      "question": "JavaScriptda stringni raqamga aylantirishning to'g'ri usuli qaysi?",
      "options": ["Number(str)", "parseInt(str)", "+str", "hammasi"],
      "answer": 3
    },
    {
      "id": 21,
      "question": "Array.isArray() qanday ishlaydi?",
      "options": ["true qaytaradi agar massiv bo'lsa", "false qaytaradi agar massiv bo'lmasa", "ikki javob ham to'g'ri", "faqat raqamlar uchun"],
      "answer": 2
    },
    {
      "id": 22,
      "question": "JavaScriptda hoisting nima?",
      "options": ["Funksiya oxiriga ko'tarish", "O'zgaruvchilarni tepaga ko'tarish", "Kodni optimallashtirish", "hammasi"],
      "answer": 3
    },
    {
      "id": 23,
      "question": "Callback funksiya nima?",
      "options": ["Boshqa funksiya ichida chaqiriladigan funksiya", "Nomli funksiya", "Nomsiz funksiya", "Hammasi"],
      "answer": 0
    },
    {
      "id": 24,
      "question": "Promise nima vazifani bajaradi?",
      "options": ["Asinxron hodisalarni boshqarish", "Sinxron hodisalarni boshqarish", "Fayllarni ochish", "Ob'yektlarni yaratish"],
      "answer": 0
    },
    {
      "id": 25,
      "question": "JavaScriptda async/await nima uchun kerak?",
      "options": ["Promise soddalashtirish", "Funksiyani tezlashtirish", "Obyektni optimallashtirish", "Kodni qisqartirish"],
      "answer": 0
    },
    {
      "id": 26,
      "question": "JavaScriptda let va var orasidagi asosiy farq nima?",
      "options": ["Blokbirlik doira", "Tur farqi", "Tezlik farqi", "Hech qanday farq yo'q"],
      "answer": 0
    },
    {
      "id": 27,
      "question": "JavaScriptda const nima uchun ishlatiladi?",
      "options": ["O'zgarmas o'zgaruvchi", "O'zgaruvchan o'zgaruvchi", "Funksiya", "Metod"],
      "answer": 0
    },
    {
      "id": 28,
      "question": "JavaScriptda this kalit so'zi nima ifodalaydi?",
      "options": ["Joriy obyekt", "Global obyekt", "Window", "hammasi"],
      "answer": 3
    },
    {
      "id": 29,
      "question": "JavaScriptda prototype nima?",
      "options": ["Obyektga metod qo'shish", "Funksiya", "Massiv", "Stil"],
      "answer": 0
    },
    {
      "id": 30,
      "question": "DOM qanday to'plam?",
      "options": ["XML", "HTML", "Ob'yekt modeli", "CSS"],
      "answer": 2
    },
    {
      "id": 31,
      "question": "JavaScriptda AJAX nimani anglatadi?",
      "options": ["XML bilan so'rov", "Server bilan asinxron aloqa", "Ma'lumotlarni saqlash", "Rasmlarni yuklash"],
      "answer": 1
    },
    {
      "id": 32,
      "question": "fetch() metodi qanday ishlaydi?",
      "options": ["GET so'rovlari uchun", "API bilan ishlash", "Promiselar bilan", "hammasi"],
      "answer": 3
    },
    {
      "id": 33,
      "question": "JavaScriptda modul nima?",
      "options": ["Alohida fayl", "Klass", "Funksiya", "Metod"],
      "answer": 0
    },
    {
      "id": 34,
      "question": "JavaScriptda modul import qilish uchun qaysi sintaksis to'g'ri?",
      "options": ["import {func} from 'module'", "require(module)", "#include module", "using module"],
      "answer": 0
    },
    {
      "id": 35,
      "question": "JavaScriptda JSON faylni o'qishning to'g'ri usuli qaysi?",
      "options": ["fetch().then().json()", "readFile()", "getJSON()", "loadJSON()"],
      "answer": 0
    },
    {
      "id": 36,
      "question": "JavaScriptda try/catch bloki nima uchun kerak?",
      "options": ["Xatolarni boshqarish", "Fayllarni ochish", "Ma'lumotlarni saqlash", "Stilni o'zgartirish"],
      "answer": 0
    },
    {
      "id": 37,
      "question": "JavaScriptda isNaN() funksiyasi nima vazifani bajaradi?",
      "options": ["Qiymat NaN ekanligini tekshiradi", "Qiymat son ekanligini tekshiradi", "Qiymat matn ekanligini tekshiradi", "Xato qaytaradi"],
      "answer": 0
    },
    {
      "id": 38,
      "question": "JavaScriptda Math.random() qanday qiymat qaytaradi?",
      "options": ["0 dan 1 gacha", "0 dan 10 gacha", "1 dan 100 gacha", "-1 dan 1 gacha"],
      "answer": 0
    },
    {
      "id": 39,
      "question": "JavaScriptda Date() obyekti nima vazifani bajaradi?",
      "options": ["Vaqt", "Sana", "Sana va vaqt", "To'plam"],
      "answer": 2
    },
    {
      "id": 40,
      "question": "JavaScriptda localStorage nima vazifani bajaradi?",
      "options": ["Ma'lumotlarni browserda saqlash", "Ma'lumotlarni serverda saqlash", "Ma'lumotlarni o'chirish", "Ma'lumotlarni o'qish"],
      "answer": 0
    },
    {
      "id": 41,
      "question": "JavaScriptda sessionStorage nima vazifani bajaradi?",
      "options": ["Ma'lumotlarni sahifa yopilguncha saqlash", "Ma'lumotlarni doimiy saqlash", "Ma'lumotlarni o'chirish", "Ma'lumotlarni o'qish"],
      "answer": 0
    },
    {
      "id": 42,
      "question": "JavaScriptda JSON.parse() qanday ishlaydi?",
      "options": ["JSONni JS obyektga aylantiradi", "JS obyektni JSONga aylantiradi", "Ma'lumotlarni o'chiradi", "Ma'lumotlarni saqlaydi"],
      "answer": 0
    },
    {
      "id": 43,
      "question": "JavaScriptda JSON.stringify() qanday ishlaydi?",
      "options": ["JS obyektni JSONga aylantiradi", "JSONni JS obyektga aylantiradi", "Ma'lumotlarni o'chiradi", "Ma'lumotlarni saqlaydi"],
      "answer": 0
    },
    {
      "id": 44,
      "question": "JavaScriptda map() metodi nima vazifani bajaradi?",
      "options": ["Har bir elementni o'zgartirish", "Elementlarni filtrlash", "Elementlarni qo'shish", "Elementlarni o'chirish"],
      "answer": 0
    },
    {
      "id": 45,
      "question": "JavaScriptda filter() metodi nima vazifani bajaradi?",
      "options": ["Elementlarni filtrlash", "Elementlarni o'zgartirish", "Elementlarni qo'shish", "Elementlarni o'chirish"],
      "answer": 0
    },
    {
      "id": 46,
      "question": "JavaScriptda reduce() metodi nima vazifani bajaradi?",
      "options": ["Barcha elementlarni yig'indisi", "Elementlarni tartiblash", "Elementlarni filtrlash", "Elementlarni o'chirish"],
      "answer": 0
    },
    {
      "id": 47,
      "question": "JavaScriptda spread operator (...) nima vazifani bajaradi?",
      "options": ["Massiv yoki obyektni kengaytirish", "Massivni qisqartirish", "Massivni o'chirish", "Massivni tartiblash"],
      "answer": 0
    },
    {
      "id": 48,
      "question": "JavaScriptda destructuring nima vazifani bajaradi?",
      "options": ["Massiv yoki obyektdan qiymatlarni ajratish", "Massivni yaratish", "Massivni o'chirish", "Massivni tartiblash"],
      "answer": 0
    },
    {
      "id": 49,
      "question": "JavaScriptda closure nima?",
      "options": ["Ichki funksiya tashqi o'zgaruvchilarga kirishi", "Tashqi funksiya", "Obyekt", "Massiv"],
      "answer": 0
    },
    {
      "id": 50,
      "question": "JavaScriptda IIFE nima?",
      "options": ["Darhol chaqiriladigan funksiya", "Nomli funksiya", "Nomsiz funksiya", "Metod"],
      "answer": 0
    }
  ]
};

// Initialize quiz selection
function initQuizSelection() {
  const quizCards = document.querySelectorAll('.quiz-card');
  
  quizCards.forEach(card => {
    card.addEventListener('click', () => {
      selectedCategory = card.dataset.category;
      questionCount = parseInt(card.dataset.questions);
      timeInMinutes = parseInt(card.dataset.time);
      
      startQuiz(selectedCategory, questionCount, timeInMinutes);
    });
  });
}

// Load questions from JSON/test data
async function loadQuestions(category, count) {
  // In a real app, this would fetch from an API or JSON file
  // For this example, we'll use our test data
  const allQuestions = testData[category] || [];
  
  // Shuffle questions and select the requested count
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Start the quiz
async function startQuiz(category, count, time) {
  try {
    // Load questions
    quizQuestions = await loadQuestions(category, count);
    
    // Reset quiz state
    currentQuestionIndex = 0;
    userAnswers = Array(quizQuestions.length).fill(null);
    
    // Update UI elements
    quizTitleElement.textContent = getCategoryTitle(category);
    totalQuestionsElement.textContent = quizQuestions.length;
    
    // Show quiz container, hide selection and results
    quizSelectionElement.classList.add('hidden');
    quizContainerElement.classList.remove('hidden');
    resultsContainerElement.classList.add('hidden');
    
    // Set up finish quiz button
    finishQuizButton.addEventListener('click', () => finishQuiz());
    
    // Start the timer
    window.timerModule.start(time);
    
    // Show first question
    displayQuestion(0);
    
    // Save quiz start in history
    saveQuizStart(category, count, time);
    
  } catch (error) {
    console.error('Error starting quiz:', error);
    alert('Failed to start quiz. Please try again.');
  }
}

// Get category title for display
function getCategoryTitle(category) {
  const titles = {
    'python': 'Python',
    'python-basic': 'Python Basic',
    'html': 'HTML',
    'js': 'JavaScript'
  };
  return titles[category] || category;
}

// Display current question
function displayQuestion(index) {
  if (index < 0 || index >= quizQuestions.length) return;
  
  const question = quizQuestions[index];
  
  // Update question text
  questionTextElement.textContent = question.question;
  
  // Clear previous options
  optionsContainerElement.innerHTML = '';
  
  // Add options
  question.options.forEach((option, optionIndex) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'option option-appear';
    optionElement.dataset.index = optionIndex;
    optionElement.textContent = option;
    
    // If user already answered this question, show the selected option
    if (userAnswers[index] !== null && userAnswers[index] === optionIndex) {
      optionElement.classList.add('selected');
    }
    
    // Add click event
    optionElement.addEventListener('click', () => selectOption(optionIndex));
    
    optionsContainerElement.appendChild(optionElement);
  });
  
  // Update question counter
  currentQuestionElement.textContent = index + 1;
  
  // Update progress bar
  const progress = ((index + 1) / quizQuestions.length) * 100;
  progressBarElement.style.width = `${progress}%`;
}

// Handle option selection
function selectOption(optionIndex) {
  // Save user's answer
  userAnswers[currentQuestionIndex] = optionIndex;
  
  // Show selected option
  const optionElements = optionsContainerElement.querySelectorAll('.option');
  optionElements.forEach(el => el.classList.remove('selected'));
  optionElements[optionIndex].classList.add('selected');
  
  // Get correct answer
  const correctAnswer = quizQuestions[currentQuestionIndex].answer;
  
  // Show if answer is correct or incorrect
  optionElements.forEach(el => el.classList.remove('correct', 'incorrect'));
  
  if (optionIndex === correctAnswer) {
    optionElements[optionIndex].classList.add('correct');
  } else {
    optionElements[optionIndex].classList.add('incorrect');
    optionElements[correctAnswer].classList.add('correct');
  }
  
  // Move to next question after a short delay
  setTimeout(() => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      currentQuestionIndex++;
      displayQuestion(currentQuestionIndex);
    } else {
      // Last question, finish quiz
      finishQuiz();
    }
  }, 800);
}

// Finish the quiz
function finishQuiz(reason = 'completed') {
  // Stop the timer
  const timerResult = window.timerModule.stop();
  
  // Calculate results
  calculateResults(timerResult, reason);
  
  // Update results UI
  updateResultsUI();
  
  // Show results container, hide quiz container
  quizContainerElement.classList.add('hidden');
  resultsContainerElement.classList.remove('hidden');
  
  // Setup back to quiz button
  backToQuizButton.addEventListener('click', () => {
    quizSelectionElement.classList.remove('hidden');
    resultsContainerElement.classList.add('hidden');
  });
  
  // Save quiz completion in history
  saveQuizCompletion(quizResults);
}

// Calculate quiz results
function calculateResults(timerResult, reason) {
  const correct = userAnswers.reduce((count, answer, index) => {
    return answer === quizQuestions[index].answer ? count + 1 : count;
  }, 0);
  
  const incorrect = userAnswers.filter(answer => answer !== null).length - correct;
  const unanswered = userAnswers.filter(answer => answer === null).length;
  const percentage = Math.round((correct / quizQuestions.length) * 100);
  
  quizResults = {
    category: selectedCategory,
    totalQuestions: quizQuestions.length,
    correct,
    incorrect,
    unanswered,
    percentage,
    time: {
      elapsed: timerResult.elapsed,
      remaining: timerResult.remaining,
      formatted: timerResult.formatted
    },
    reason,
    date: new Date().toISOString(),
    answers: userAnswers.map((answer, index) => {
      return {
        question: quizQuestions[index].question,
        options: quizQuestions[index].options,
        userAnswer: answer,
        correctAnswer: quizQuestions[index].answer,
        isCorrect: answer === quizQuestions[index].answer
      };
    })
  };
}

// Update results UI
function updateResultsUI() {
  if (!quizResults) return;
  
  // Update summary
  document.getElementById('correct-count').textContent = quizResults.correct;
  document.getElementById('incorrect-count').textContent = quizResults.incorrect;
  document.getElementById('percentage').textContent = `${quizResults.percentage}%`;
  document.getElementById('time-taken').textContent = quizResults.time.formatted;
  
  // Update questions review
  const reviewContainer = document.getElementById('questions-review');
  reviewContainer.innerHTML = '';
  
  quizResults.answers.forEach((answer, index) => {
    const reviewItem = document.createElement('div');
    reviewItem.className = `review-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
    
    const reviewQuestion = document.createElement('div');
    reviewQuestion.className = 'review-question';
    reviewQuestion.textContent = `Q${index + 1}: ${answer.question}`;
    
    const userAnswerDiv = document.createElement('div');
    userAnswerDiv.className = 'review-answer user';
    userAnswerDiv.innerHTML = `<span>Sizning javobingiz:</span> <span>${answer.userAnswer !== null ? answer.options[answer.userAnswer] : 'Javob bermadingiz'}</span>`;
    
    const correctAnswerDiv = document.createElement('div');
    correctAnswerDiv.className = 'review-answer correct';
    correctAnswerDiv.innerHTML = `<span>To'g'ri javob:</span> <span>${answer.options[answer.correctAnswer]}</span>`;
    
    reviewItem.appendChild(reviewQuestion);
    reviewItem.appendChild(userAnswerDiv);
    reviewItem.appendChild(correctAnswerDiv);
    
    reviewContainer.appendChild(reviewItem);
  });
}

// Save quiz start in history
function saveQuizStart(category, count, time) {
  currentQuiz = {
    id: Date.now().toString(),
    category,
    count,
    time,
    startTime: new Date().toISOString(),
    user: getCurrentUser().id
  };
  
  // Save in local storage
  const quizzes = JSON.parse(localStorage.getItem('itc_quiz_history') || '[]');
  quizzes.push(currentQuiz);
  localStorage.setItem('itc_quiz_history', JSON.stringify(quizzes));
}

// Save quiz completion in history
function saveQuizCompletion(results) {
  if (!currentQuiz) return;
  
  // Get quizzes from local storage
  const quizzes = JSON.parse(localStorage.getItem('itc_quiz_history') || '[]');
  
  // Find the current quiz
  const index = quizzes.findIndex(q => q.id === currentQuiz.id);
  if (index !== -1) {
    // Update the quiz with results
    quizzes[index] = {
      ...quizzes[index],
      endTime: new Date().toISOString(),
      correct: results.correct,
      incorrect: results.incorrect,
      percentage: results.percentage,
      timeElapsed: results.time.elapsed,
      completed: true
    };
    
    // Save updated quizzes
    localStorage.setItem('itc_quiz_history', JSON.stringify(quizzes));
  }
}

// Get current user
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('itc_quiz_user') || '{}');
}

// Initialize the quiz module
function initQuiz() {
  // Only initialize if on the quiz page
  if (!quizContainerElement) return;
  
  // Set up quiz selection
  initQuizSelection();
}

// Export quiz module
window.quizModule = {
  init: initQuiz,
  start: startQuiz,
  finishQuiz
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initQuiz);