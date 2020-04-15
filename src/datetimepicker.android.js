/**
 * @format
 * @flow strict-local
 */
import {
  MODE_DATE,
  MODE_TIME,
  DISPLAY_DEFAULT,
  DATE_SET_ACTION,
  TIME_SET_ACTION,
  DISMISS_ACTION,
  NEUTRAL_BUTTON_ACTION,
} from './constants';
import pickers from './picker';
import invariant from 'invariant';
import React, {Fragment} from 'react';

import type {AndroidEvent, AndroidNativeProps} from './types';

export default function RNDateTimePicker({
  mode,
  value,
  display,
  onChange,
  is24Hour,
  minimumDate,
  maximumDate,
  neutralButtonLabel,
  isVisible,
}: AndroidNativeProps) {
  
  invariant(value, 'A date or time should be specified as `value`.');
  let picker;

  const manageModeStatus = (modeType) => {
    if(isVisible){
      picker = pickers[modeType].open({
        value,
        display,
        is24Hour,
        neutralButtonLabel,
        isVisible,
      });
    } else {
      picker = pickers[MODE_TIME].close({
        value,
        display,
        is24Hour,
        neutralButtonLabel,
        isVisible,
      });
      picker = pickers[MODE_DATE].close({
        value,
        display,
        is24Hour,
        neutralButtonLabel,
        isVisible,
      });
    }
  }

  switch (mode) {
    case MODE_TIME:
      manageModeStatus(MODE_TIME);
      break;
    case MODE_DATE:
    default:
      manageModeStatus(MODE_DATE);
      break;
  }

  picker.then(
    function resolve({action, day, month, year, minute, hour, isVisible}) {
      const date = new Date(value);
      const event: AndroidEvent = {
        type: 'set',
        nativeEvent: {},
      };

      switch (action) {
        case DATE_SET_ACTION:
          event.nativeEvent.timestamp = date.setFullYear(year, month, day);
          onChange(event, date);
          break;

        case TIME_SET_ACTION:
          event.nativeEvent.timestamp = date.setHours(hour, minute);
          onChange(event, date);
          break;

        case NEUTRAL_BUTTON_ACTION:
          event.type = 'neutralButtonPressed';
          onChange(event);
          break;

        case DISMISS_ACTION:
        default:
          event.type = 'dismissed';
          onChange(event);
          break;
      }
    },
    function reject(error) {
      // ignore or throw `activity == null` error
      throw error;
    },
  );

  return <Fragment />;
}

RNDateTimePicker.defaultProps = {
  display: DISPLAY_DEFAULT,
  mode: MODE_DATE,
};
