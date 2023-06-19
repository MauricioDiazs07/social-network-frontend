import {FlatList} from 'react-native';
import React from 'react';
import LiveComponent from '../../../../components/LiveComponent';
import {videoData} from '../../../../api/constant';

export default function SearchVideo() {
  return (
    <FlatList
      data={videoData}
      renderItem={({item, index}) => (
        <LiveComponent
          data={item?.views}
          reelUrl={item?.poster}
          userName={item?.channelName}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      showsVerticalScrollIndicator={false}
    />
  );
}
