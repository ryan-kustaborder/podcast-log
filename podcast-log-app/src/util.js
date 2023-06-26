const PodcastColorPairs = {
  "Five to Four": "rgb(255, 99, 132)",
  "Grim and Mild Presents": "rgb(54, 162, 235)",
  "Lore": "rgb(255, 205, 86)",
  "SciShow Tangents": "rgb(75, 192, 192)",
  "Scam Goddess": "rgb(153, 102, 255)",
  "Noble Blood": "rgb(255, 159, 64)",
  "Myths and Legends": "rgb(255, 0, 0)",
  "No Such Thing as a Fish": "rgb(0, 255, 0)",
  "If Books Could Kill": "rgb(0, 0, 255)",
  "My Brother My Brother and Me": "rgb(255, 255, 0)",
  "The Bald and the Beautiful": "rgb(0, 255, 255)",
  "Revolutions": "rgb(255, 0, 255)",
  "Scoundrel": "rgb(128, 0, 0)",
  "Cortex": "rgb(0, 128, 0)",
  "Maintenance Phase": "rgb(0, 0, 128)",
  "Dear Hank & John": "rgb(128, 128, 0)",
  "Classic Tales": "rgb(0, 128, 128)",
  "American Shadows": "rgb(128, 0, 128)",
  "99 Percent Invisible": "rgb(192, 192, 192)",
  "Articles of Interest": "rgb(128, 128, 128)",
  "Twenty Thousand Hertz": "rgb(255, 255, 255)",
  "The Dream": "rgb(0, 0, 0)",
  "My Dad Wrote a Porno": "rgb(165, 42, 42)",
  "Decoder": "rgb(0, 128, 128)",
  "Fictional": "rgb(128, 0, 128)",
  "Craig & Friends": "rgb(0, 0, 255)",
  "Unobscured": "rgb(128, 0, 0)",
  "Hidden Djinn": "rgb(255, 255, 0)",
  "Unreal": "rgb(0, 255, 0)",
  "You’re Wrong About": "rgb(255, 0, 255)",
};

export function GetColors(podcasts) {
  let colors = [];

  for (let p of podcasts) {
    colors.push(PodcastColorPairs[p]);
  }

  return colors;
}

export function SortNumericalDict(dict) {
  var items = Object.keys(dict).map((key) => {
    return [key, dict[key]];
  });

  let obj = {};

  items
    .sort((first, second) => {
      return second[1] - first[1];
    })
    .map((e) => {
      return e[0];
    })
    .forEach((k, i) => {
      obj[k] = items[i][1];
    });
  return obj;
}

export function SortDataByDate(dict) {
  
}
