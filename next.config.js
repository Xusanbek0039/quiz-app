// next.config.js
const nextConfig = {
    output: 'export', // Statik eksport uchun kerak
    images: {
      unoptimized: true, // GitHub Pagesda ishlamaydigan next/image larni oddiy img ga o'tkazadi
    },
  }
  
  module.exports = nextConfig