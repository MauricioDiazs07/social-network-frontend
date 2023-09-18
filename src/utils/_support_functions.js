import { months, states, municipalities } from "./constants";

const translateBirthday = (date) => {
    let day = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();

    day = day < 10 ? `0${day}` : day;

    return `${day}-${month}-${year}`;
};

const getFormatedBirthday = (day_, month_, year_) => {
  var day = day_ < 10 ? `0${day_}` : day_;
  let month = months[month_ - 1];

  return `${day}/${month}/${year_}`;
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
  const new_posts = [];
  post.forEach(element => {
    const images = [];
    element['multimedia']['data'].forEach(mult => {
      images.push(mult['archive_url']);
    });

    const obj = {
      id: element['id'],
      name: element['name'],
      profileId: element['profileId'],
      subtitle: element['creationDate'],
      profileImage: element['profileImage'],
      text: element['text'],
      image: images,
      role: 'CEO de empresa', // TODO: delete field
      postType: element['shareType'],
      likes: element['likes'],
      comments: element['comments']
    };
    new_posts.push(obj);
    
  });

  return new_posts.reverse();
}

const transformfHistoy = (post) => {
  const new_historys = [];

  post.forEach(element => {
    const obj = {
      id: element['id'],
      name: element['name'],
      description: element['text'],
      imgUrl: element['profileImage'],
      profileId: element['profileId'],
      historys: element['historys'],
      isFollow: false
    };
    
    new_historys.push(obj);
  });
  return new_historys.reverse();
}

const transformpHistoy = (post) => {
  const new_historys = [];
  historys = post['shares']['shares']
  historys.forEach(element => {
    if (element['shareType'] == 'HISTORY'){
      console.log(element);
      const obj = {
        id: element['id'],
        name: '',
        description: '',
        imgUrl: element['multimedia']['data'][0]['archive_url'],
        isFollow: false
      };
      console.log("Historia 2");
      console.log(obj);
      new_historys.push(obj);
    }
  });

  return new_historys.reverse();
}

const transformFeed = (post) => {
  const new_historys = [];
  historys = post['shares']['shares']
  historys.forEach(element => {
    if (element['shareType'] == 'POST'){
      console.log(element);
      const obj = {
        id: element['id'],
        channelName: post['name'],
        uri: 'https://user-images.githubusercontent.com/129170600/231968235-a6a60f18-6b50-459d-8c7c-9716d9df0730.mp4',
        caption: element['text'],
        musicName: 'Song #1',
        likes: '0',
        comments: '0',
        bookmark: '0',
        share: '0',
        categoty: 'Entertainment',
        avatarUri: post['profile_photo'],
        poster: element['multimedia']['data'][0]['archive_url'],
        views: '0',
      };
      new_historys.push(obj);
    }
  });

  return new_historys.reverse();
}

const transformShorts = (post) => {
  const new_historys = [];
  historys = post['shares']['shares']
  historys.forEach(element => {
    if (element['shareType'] == 'HISTORY'){
      console.log(element);
      const obj = {
        id: element['id'],
        name: '',
        description: '',
        imgUrl: element['multimedia']['data'][0]['archive_url'],
        isFollow: false
      };
      console.log("Historia 2");
      console.log(obj);
      new_historys.push(obj);
    }
  });

  return new_historys.reverse();
}

export {
    translateBirthday,
    getFormatedBirthday,
    getStates,
    getMunicipalities,
    getGender,
    isNotEmptyString,
    getAccessLevel,
    transformfPosts,
    transformfHistoy,
    transformpHistoy,
    transformFeed,
    transformShorts
}