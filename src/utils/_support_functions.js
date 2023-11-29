import { months, states, municipalities } from "./constants";
import { subscribeToTopic } from "../api/feed/interaction";

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
  if (lvl === 1) {
    return 'user';
  } else if (lvl === 2) {
    return 'admin';
  }

  return 'master';
}

const transformfPosts = (posts_, isMasterData = true) => {
  const new_posts = [];

  posts_.forEach(element => {
    const images = [];

    element['multimedia']['data'].forEach(mult => {
      images.push(mult['archive_url']);
    });

    let name = !isMasterData ? element['name'] : '';
    let profileImg = !isMasterData ? element['profileImage'] : '';
    let profileId = !isMasterData ? element['profileId'] : '';

    const obj = {
      id: element['id'],
      description: element['text'],
      name: name,
      profileImage: profileImg,
      profileId: profileId,
      subtitle: element['creationDate'],
      text: element['text'],
      image: images,
      multimedia: {
        data: images
      },
      postType: 'POST',
      likes: element['likes'],
      comments: element['comments'],
      views: element['likes'],
      poster: images[0]
    }; 

    new_posts.push(obj);
    
  });

  return new_posts.reverse();
}

const transformfHistoy = (post) => {
  const new_historys = [];

  post.forEach(element => {
    const obj = {
      id: element['historys'][0]['id'],
      name: element['name'],
      description: element['description'],
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
  const new_stories = [];
  let stories = post['history'];
  
  stories.forEach(element => {
    if (element['shareType'] === 'HISTORY') {
      const obj = {
        id: element['id'],
        name: '',
        description: '',
        imgUrl: element['archive_url'],
        isFollow: false
      };
      new_stories.push(obj);
    }
  });

  return new_stories.reverse();
}

const transformProfileHistory = (post) => {
  const new_historys = [];
  historys = post['historys']
  post.forEach(element => {
      const obj = {
        id: element['id'],
        name: element['name'],
        description: '',
        imgUrl: element['historys'][0]['content'],
        isFollow: false
      };
      new_historys.push(obj);
    // }
  });

  return new_historys.reverse();
}

const transformFeed = (post) => {
  const new_posts = [];
  const profiles_list = [];

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
      postType: element['shareType'],
      // role: 'CEO de empresa', // TODO: delete field
      likes: element['likes'],
      comments: element['comments']
    };
    new_posts.push(obj);
    if (!profiles_list.includes(element['profileId'])) {
      profiles_list.push(element['profileId']);
    }    
  });
  profiles_list.forEach(profile => subscribeToTopic());
  
  return new_posts;
}

const transformShorts = (post) => {
  const new_historys = [];
  historys = post['shares']['shares']
  historys.forEach(element => {
    if (element['shareType'] == 'HISTORY'){
      const obj = {
        id: element['id'],
        name: '',
        description: '',
        imgUrl: element['multimedia']['data'][0]['archive_url'],
        isFollow: false
      };
      new_historys.push(obj);
    }
  });

  return new_historys.reverse();
}

const getColor = (colors, delta, limit) => {
  if ((limit-delta) < 20 && (limit-delta) > 0) {
    return colors.yellow;
  }
  if (delta >= limit) {
    return colors.redColor;
  }

  return colors.primary;
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
    transformShorts,
    getColor,
    transformProfileHistory
}