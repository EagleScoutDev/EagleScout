import React, {useCallback, useRef, useState} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {BottomSheetNavigator} from './BottomSheetNavigator';
import {View} from 'react-native';

export const BettingInfoBottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(true);

  const handleBottomSheetClose = useCallback(() => {
    bottomSheetRef.current?.close();
    setBottomSheetOpen(false);
  }, []);

  return (
    <>
      {bottomSheetOpen && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        />
      )}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        enableDynamicSizing={false}
        snapPoints={['55%']}
        enablePanDownToClose={true}
        animateOnMount={true}>
        <BottomSheetNavigator handleBottomSheetClose={handleBottomSheetClose} />
      </BottomSheet>
    </>
  );
};