// Library Imports
import {StyleSheet, View} from 'react-native';
import React from 'react';

// Local Imports
import strings from '../../i18n/strings';
import {styles} from '../../themes';
import ZText from '../../components/common/ZText';
import ZHeader from '../../components/common/ZHeader';
import ZSafeAreaView from '../../components/common/ZSafeAreaView';
import ZKeyBoardAvoidWrapper from '../../components/common/ZKeyBoardAvoidWrapper';

/* TODO: TERMINOS Y CONDICIONES EN LA APLICACION */

const TermsAndConditions = ({navigation}) => {
    const unicodeBullet = `\u2022`;

  return (
    <ZSafeAreaView>
      <ZHeader />
      <ZKeyBoardAvoidWrapper>
        <View style={localStyles.mainContainer}>
          <ZText type={'b46'} align={'left'} style={styles.mv40}>
            {strings.TermsAndConditions}
          </ZText>
          
          <ZText type={'b20'}>
            {strings.TermsAndConditionsWelcome}
          </ZText>

          <ZText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </ZText>

          <ZText type={'b20'} style={localStyles.paragraph}>
            Egestas tellus rutrum tellus pellentesque eu tincidunt
          </ZText>

          <ZText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mattis enim ut tellus elementum sagittis vitae et. Ut aliquam purus sit amet luctus venenatis.
          </ZText>

          <ZText style={localStyles.bullet}>
            {unicodeBullet} Egestas tellus rutrum tellus pellentesque eu tincidunt. Volutpat sed cras ornare arcu. Rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar. Egestas quis ipsum suspendisse ultrices gravida. Vulputate dignissim suspendisse in est ante in nibh mauris cursus. Morbi blandit cursus risus at ultrices mi tempus. Urna nunc id cursus metus aliquam eleifend mi in nulla. Nibh mauris cursus mattis molestie a iaculis at. Id venenatis a condimentum vitae sapien pellentesque habitant morbi tristique. Sagittis nisl rhoncus mattis rhoncus urna neque. Viverra accumsan in nisl nisi scelerisque eu ultrices.
          </ZText>

          <ZText style={localStyles.bullet}>
            {unicodeBullet} Fames ac turpis egestas maecenas. Non nisi est sit amet facilisis magna etiam tempor. Condimentum lacinia quis vel eros donec ac odio tempor. Ipsum suspendisse ultrices gravida dictum fusce ut. Iaculis eu non diam phasellus vestibulum lorem sed risus. Interdum consectetur libero id faucibus nisl tincidunt eget nullam non. Nibh mauris cursus mattis molestie a iaculis at erat pellentesque. Fusce id velit ut tortor pretium. Pellentesque habitant morbi tristique senectus et netus et. Ornare aenean euismod elementum nisi quis eleifend quam adipiscing. Lectus sit amet est placerat in egestas erat imperdiet. Mi bibendum neque egestas congue quisque egestas. Quis enim lobortis scelerisque fermentum dui faucibus in ornare. Commodo nulla facilisi nullam vehicula ipsum a. Malesuada nunc vel risus commodo viverra maecenas accumsan lacus vel. In vitae turpis massa sed elementum tempus egestas. Consequat interdum varius sit amet mattis vulputate. Vel orci porta non pulvinar.
          </ZText>

          <ZText style={localStyles.bullet}>
            {unicodeBullet} Scelerisque purus semper eget duis at. Nullam ac tortor vitae purus faucibus. Morbi tincidunt ornare massa eget egestas purus viverra accumsan. Elementum curabitur vitae nunc sed velit dignissim sodales ut eu. Feugiat scelerisque varius morbi enim nunc. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Cursus vitae congue mauris rhoncus aenean vel elit. Elementum integer enim neque volutpat ac tincidunt vitae semper. At ultrices mi tempus imperdiet nulla malesuada. Faucibus et molestie ac feugiat sed. Risus viverra adipiscing at in tellus integer. Morbi enim nunc faucibus a pellentesque. Semper quis lectus nulla at volutpat diam ut venenatis.
          </ZText>

          <ZText style={localStyles.bullet}>
            {unicodeBullet} Adipiscing diam donec adipiscing tristique risus nec feugiat in fermentum. Egestas purus viverra accumsan in nisl nisi. Fringilla est ullamcorper eget nulla facilisi etiam. Amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar. Aliquam nulla facilisi cras fermentum odio eu feugiat. Gravida dictum fusce ut placerat. Sit amet venenatis urna cursus eget nunc. Integer malesuada nunc vel risus commodo viverra maecenas accumsan. Risus quis varius quam quisque id diam. Nisl rhoncus mattis rhoncus urna neque viverra justo. Quam viverra orci sagittis eu volutpat odio facilisis mauris sit. Eu nisl nunc mi ipsum. Adipiscing elit ut aliquam purus. Convallis posuere morbi leo urna molestie at elementum eu. Sed risus pretium quam vulputate dignissim suspendisse.
          </ZText>
        </View>
      </ZKeyBoardAvoidWrapper>
    </ZSafeAreaView>
  );
};

export default TermsAndConditions;

const localStyles = StyleSheet.create({
  mainContainer: {
    ...styles.ph20,
  },
  paragraph: {
    ...styles.mt25,
    ...styles.mb25
  },
  bullet: {
    ...styles.mb10,
    ...styles.pl10,
  }
});
