/**
 * Korean Initial Consonant (Chosung) Extraction for Browser
 * Based on simplified algorithm
 */
(function (exports) {
  const BASE = 0xAC00; // '가'
  const CHOSEONG = [
    "ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ",
    "ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"
  ];
  const BLOCK = 588; // 한 중성+종성 조합 수

  // Mapping Korean initial consonants to English letters for indexing
  const CONSONANT_TO_LETTER = {
    'ㄱ': 'G', 'ㄲ': 'G',  // ㄱ, ㄲ → G
    'ㄴ': 'N',              // ㄴ → N
    'ㄷ': 'D', 'ㄸ': 'D',  // ㄷ, ㄸ → D
    'ㄹ': 'R',              // ㄹ → R
    'ㅁ': 'M',              // ㅁ → M
    'ㅂ': 'B', 'ㅃ': 'B',  // ㅂ, ㅃ → B
    'ㅅ': 'S', 'ㅆ': 'S',  // ㅅ, ㅆ → S
    'ㅇ': 'O',              // ㅇ → O
    'ㅈ': 'J', 'ㅉ': 'J',  // ㅈ, ㅉ → J
    'ㅊ': 'C',              // ㅊ → C
    'ㅋ': 'K',              // ㅋ → K
    'ㅌ': 'T',              // ㅌ → T
    'ㅍ': 'P',              // ㅍ → P
    'ㅎ': 'H'               // ㅎ → H
  };

  exports.getChoseong = function (text) {
    return text.split("").map(char => {
      const code = char.charCodeAt(0) - BASE;
      if (code < 0 || code > 11171) return char; // 非韩文字符原样返回
      return CHOSEONG[Math.floor(code / BLOCK)];
    }).join("");
  };

  exports.getChoseongLetter = function (char) {
    const code = char.charCodeAt(0) - BASE;
    if (code < 0 || code > 11171) return null; // 非韩文字符
    const choseong = CHOSEONG[Math.floor(code / BLOCK)];
    return choseong || null; // 直接返回韩文初声字母，不转换为英文
  };

  // 韩文初声字母按习惯顺序
  exports.KOREAN_ALPHABET = [
    "ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ",
    "ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"
  ];

  // 用于英文映射的函数（保留原功能，用于非韩文索引模式）
  exports.getChoseongEnglishLetter = function (char) {
    const code = char.charCodeAt(0) - BASE;
    if (code < 0 || code > 11171) return null; // 非韩文字符
    const choseong = CHOSEONG[Math.floor(code / BLOCK)];
    return CONSONANT_TO_LETTER[choseong] || null;
  };

})(typeof exports === "undefined" ? (this.HangulInitials = {}) : exports);
