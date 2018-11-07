import React from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  ListView,
  TouchableHighlight,
  View,
  StyleSheet,
} from 'react-native';

import Constants from './constants';
import { Photo } from './media';

import InfiniteScrollView from 'react-native-infinite-scroll-view';

// 1 margin and 1 border width
const ITEM_MARGIN = 2;

export default class GridContainer extends React.Component {

  static propTypes = {
    style: View.propTypes.style,
    square: PropTypes.bool,
    dataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    displaySelectionButtons: PropTypes.bool,
    onPhotoTap: PropTypes.func,
    itemPerRow: PropTypes.number,

    /*
     * refresh the list to apply selection change
     */
    onMediaSelection: PropTypes.func,

    /**
     * offsets the width of the grid
     */
    offset: PropTypes.number,
    onLoadMoreAsync: PropTypes.func
  };

  static defaultProps = {
    displaySelectionButtons: false,
    onPhotoTap: () => {},
    itemPerRow: 3,
    onLoadMoreAsync: () => {}
  };

  constructor(props, context) {
    super(props, context);

    this._renderRow = this._renderRow.bind(this);
  }

  _loadMoreContentAsync = async () => {
    this.props.onLoadMoreAsync();
  }

  _renderRow(media: Object, sectionID: number, rowID: number) {
    const {
      displaySelectionButtons,
      onPhotoTap,
      onMediaSelection,
      itemPerRow,
      square,
      offset,
    } = this.props;
    const screenWidth = Dimensions.get('window').width - offset;
    const photoWidth = (screenWidth / itemPerRow) - (ITEM_MARGIN * 2);

    return (
      <TouchableHighlight onPress={() => onPhotoTap(parseInt(rowID, 10))}>
        <View style={styles.row}>
          <Photo
            width={photoWidth}
            height={square ? photoWidth : 100}
            resizeMode={'cover'}
            thumbnail
            progressImage={require('../Assets/hourglass.png')}
            displaySelectionButtons={displaySelectionButtons}
            uri={media.thumb || media.photo}
            selected={media.selected}
            onSelection={(isSelected) => {
              onMediaSelection(rowID, isSelected);
            }}
          />
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const { dataSource } = this.props;
    return (
      <View style={styles.container}>
        <ListView
          renderScrollComponent={props => <InfiniteScrollView {...props} />}
          contentContainerStyle={styles.list}
          dataSource={dataSource}
          initialListSize={21}
          pageSize={3}
          scrollRenderAheadDistance={500}
          renderRow={this._renderRow}
          removeClippedSubviews={false}
          canLoadMore={true}
          onEndReachedThreshold={20}
          onLoadMoreAsync={this._loadMoreContentAsync}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Constants.TOOLBAR_HEIGHT,
  },
  list: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  row: {
    justifyContent: 'center',
    margin: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 1,
  },
});
