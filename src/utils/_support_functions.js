import { months, states, municipalities } from "./constants";

const translateBirthday = (date) => {
    let day = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();

    day = day < 10 ? `0${day}` : day;

    return `${day}-${month}-${year}`;
};

const getStates = () => {
    return getList(states);
};

const getMunicipalities = (state_) => {
    if (state_ == '') {
      return [];
    }

    return getList(municipalities[state_]);;
}

getList = (list_) => {
  if (list_ == undefined) {
    return [];
  }
  const keyList = Object.keys(list_).sort();
  const filtered_list = [];

  for (let i=0; i<keyList.length; i++) {
      var object_ = {};
      var key_ = keyList[i];
      object_['label'] = list_[key_];
      object_['value'] = key_;

      filtered_list.push(object_);
  }

  return filtered_list;
}

const getGender = gender_ => {
  if (gender_ === 'H') {
    return 'male';
  } else if (gender_ === 'M') {
    return 'female';
  }

  return '';
}

const isNotEmptyString = str_ => {
  return str_.length > 0;
}

const getAccessLevel = lvl => {
  console.log("LEVEL:", lvl);
  if (lvl === 1) {
    return 'user';
  } else if (lvl === 2) {
    return 'admin';
  }

  return 'master';
}

const transformfPosts = (post) => {
  console.log("START POST:", post);
  const new_posts = [];
  let name = "Victoria Hernandez";
  let photo = "https://aishlatino.com/wp-content/uploads/2021/11/que-tipo-de-persona-te-gustaria-ser-730x411-SP.jpg";

  post.forEach(element => {
    const images = [];
    element['multimedia'].forEach(mult => {
      images.push(mult['archive_url']);
    });

    const obj = {
      id: element['share']['share_id'],
      name: name,
      subtitle: 'Hace 2 horas',
      profileImage: photo,
      text: element['share']['description'],
      image: images,
      role: 'CEO de empresa',
      postType: 'text',
    };
    new_posts.push(obj);
  });

  return new_posts.reverse();
}

export {
    translateBirthday,
    getStates,
    getMunicipalities,
    getGender,
    isNotEmptyString,
    getAccessLevel,
    transformfPosts,
}