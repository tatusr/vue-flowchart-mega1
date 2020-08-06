export const randomInt = (fr, to) => {
  return Math.round(fr + Math.random() * to);
};


export const generateRGBColors = (count) => {
  return Array.apply(null, new Array(count)).map((none, i) => {
    return {
      r: randomInt(0, 255),
      g: randomInt(0, 255),
      b: randomInt(0, 255),
    };
  });
};


export const hashCode  = (s) => {
  var hash = 255;
  if (s.length === 0) {
      return hash;
  }
  //console.log(s)
  for (var i = 0; i < s.length; i++) {
      var char = s.charCodeAt(i);
      hash = (hash + char) & 255;
      //console.log(char, hash)

  }
  return hash;
  };
  
  export const generateCategorieColor = (categorie) => {

    if (categorie !== undefined) {
      let color = {
        r: hashCode(categorie),
        g: hashCode(categorie + categorie),
        b: hashCode(categorie + categorie + categorie),
      };
      //console.log(categorie, hashCode(categorie))
      //console.dir(color)
      return color;
    } else {
      return {
        r: randomInt(0, 255),
        g: randomInt(0, 255),
        b: randomInt(0, 255),
      };
    }
};


export default {
  randomInt,
  generateRGBColors,
  generateCategorieColor,
};
