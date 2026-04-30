const BRL = {
  ' ':'⠀','a':'⠁','b':'⠃','c':'⠉','d':'⠙','e':'⠑','f':'⠋','g':'⠛',
  'h':'⠓','i':'⠊','j':'⠚','k':'⠅','l':'⠇','m':'⠍','n':'⠝','o':'⠕',
  'p':'⠏','q':'⠟','r':'⠗','s':'⠎','t':'⠞','u':'⠥','v':'⠧','w':'⠺',
  'x':'⠭','y':'⠽','z':'⠵',
  'á':'⠷','é':'⠮','í':'⠌','ó':'⠬','ú':'⠾','ü':'⠳','ñ':'⠻',
  ',':'⠂',';':'⠆',':':'⠒','.':'⠲','!':'⠖','¡':'⠖','?':'⠦','¿':'⠢',
  '"':'⠦',"'":'⠄','-':'⠤','\n':'\n',
};
const CAP_IND = '⠠';
const NUM_IND = '⠼';
const NUM_BRL = {'0':'⠚','1':'⠁','2':'⠃','3':'⠉','4':'⠙','5':'⠑','6':'⠋','7':'⠛','8':'⠓','9':'⠊'};

function toBraille(text) {
  let out = '';
  let inNum = false;
  for (const ch of text) {
    if (/[0-9]/.test(ch)) {
      if (!inNum) { out += NUM_IND; inNum = true; }
      out += NUM_BRL[ch] ?? '';
    } else {
      inNum = false;
      if (/[A-ZÁÉÍÓÚÜÑ]/.test(ch)) {
        out += CAP_IND + (BRL[ch.toLowerCase()] ?? '');
      } else {
        out += BRL[ch.toLowerCase()] ?? BRL[ch] ?? '';
      }
    }
  }
  return out;
}

module.exports = { toBraille };
