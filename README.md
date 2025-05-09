# IT Ijodkorlari - Test Platformasi

Bu loyiha IT sohasidagi bilimlarni test qilish uchun yaratilgan veb-platforma hisoblanadi.

## Xususiyatlari

- Turli IT mavzularida bilimlarni sinash
- Test natijalarini saqlash va tahlil qilish
- Interaktiv test formatida savollarni yechish
- Yorug' va qorong'i rejimlar
- Avtomatik natija tahlili

## Ishga tushirish

1. Loyihani o'rnatib oling
2. `npm install` buyrug'i orqali kerakli paketlarni o'rnating
3. `npm run dev` buyrug'i orqali loyihani ishga tushiring

## Testlar qo'shish

Yangi test qo'shish uchun, `testlar` papkasiga JSON formatidagi test faylini qo'shing:

```json
{
  "id": "test-id",
  "title": "Test nomi",
  "description": "Test haqida qisqacha ma'lumot",
  "time": 5,
  "questions": [
    {
      "id": "q1",
      "text": "Savol matni",
      "answers": [
        { "id": "a1", "text": "Javob 1", "isCorrect": false },
        { "id": "a2", "text": "Javob 2", "isCorrect": true },
        { "id": "a3", "text": "Javob 3", "isCorrect": false },
        { "id": "a4", "text": "Javob 4", "isCorrect": false }
      ]
    }
  ]
}
```