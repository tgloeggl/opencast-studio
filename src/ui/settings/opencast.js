//; -*- mode: rjsx;-*-
/** @jsx jsx */
import { jsx } from 'theme-ui';

import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircleNotch, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import useForm from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import { Box, Button } from '@theme-ui/components';

import { useState } from 'react';

import {
  Opencast,
  useOpencast,
  STATE_LOGGED_IN,
  STATE_NETWORK_ERROR,
  STATE_RESPONSE_NOT_OK,
  STATE_INVALID_RESPONSE,
  STATE_INCORRECT_LOGIN,
  STATE_CONNECTED,
  STATE_UNCONFIGURED,
} from '../../opencast';
import Notification from '../notification';
import { Input, SettingsSection} from './elements';
import { useStudioState } from '../../studio-state';



function OpencastSettings({ settingsManager }) {
  const location = useLocation();
  const { t } = useTranslation();
  const opencast = useOpencast();
  const [error, setError] = useState();
  const { errors, handleSubmit, register } = useForm({
    defaultValues: settingsManager.formValues().opencast
  });
  const [status, setStatus] = useState('initial');

  const { recordings } = useStudioState();
  const hasRecording = recordings.length > 0;

  async function onSubmit(data) {
    setStatus('testing');
    const oc = await Opencast.init({
      ...settingsManager.settings().opencast,
      ...data,
    });

    switch (oc.getState()) {
      case STATE_LOGGED_IN:
        opencast.setGlobalInstance(oc);
        settingsManager.saveSettings({ opencast: data });
        setStatus('saved');
        setError(null);
        break;

      case STATE_NETWORK_ERROR:
        setStatus('error');
        setError(t('upload-settings-error-server-unreachable'));
        break;
      case STATE_RESPONSE_NOT_OK:
        setStatus('error');
        setError(t('upload-settings-error-response-not-ok'));
        break;
      case STATE_INVALID_RESPONSE:
        setStatus('error');
        setError(t('upload-settings-error-invalid-response'));
        break;
      case STATE_INCORRECT_LOGIN:
        setStatus('error');
        if (opencast.isLoginProvided()) {
          setError(t('upload-settings-invalid-provided-login'));
        } else {
          setError(t('upload-settings-invalid-login-data'));
        }
        break;

      case STATE_CONNECTED:    // <- login data is provided in some way -> state impossible
      case STATE_UNCONFIGURED: // <- server URL is required -> state impossible
      default:
        console.error("bug: invalid state reached...");
        setStatus('error');
        setError('internal error :(');
    }
  }

  const showServerUrl = settingsManager.isConfigurable('opencast.serverUrl');
  const showUsername = settingsManager.isUsernameConfigurable();
  const showPassword = settingsManager.isPasswordConfigurable();

  // If all settings are already specified by the context, we do not show
  // anything at all.
  if (!showServerUrl && !showUsername && !showPassword) {
    return null;
  }

  const icons = {
    testing: faCircleNotch,
    error: faExclamationCircle,
    saved: faCheckCircle,
  };
  const icon = icons[status];

  return '';
}

export default OpencastSettings;
