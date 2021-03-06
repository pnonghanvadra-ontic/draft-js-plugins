import React, { ComponentType, MouseEvent, ReactElement } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import EditorUtils from '@draft-js-plugins/utils';
import AddLinkForm, { AddLinkFormPubParams } from './AddLinkForm';
import { AnchorPluginTheme } from '../theme';
import { AnchorPluginStore } from '..';

export interface LinkButtonTheme {
  button: string;
  active: string;
  buttonWrapper: string;
}

export interface LinkButtonPubParams {
  theme: LinkButtonTheme;
  onOverrideContent(component: ComponentType<AddLinkFormPubParams>): void;
}

interface LinkButtonParams extends LinkButtonPubParams {
  ownTheme: AnchorPluginTheme;
  store: AnchorPluginStore;
  placeholder?: string;
  onRemoveLinkAtSelection(): void;
  validateUrl?(url: string): boolean;
}

const LinkButton = (props: LinkButtonParams): ReactElement => {
  const onMouseDown = (event: MouseEvent): void => {
    event.preventDefault();
  };

  const onAddLinkClick = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    const { ownTheme, placeholder, onOverrideContent, validateUrl } = props;

    const content = (contentProps: AddLinkFormPubParams): ReactElement => (
      <AddLinkForm
        {...contentProps}
        placeholder={placeholder}
        theme={ownTheme}
        validateUrl={validateUrl}
      />
    );

    onOverrideContent(content);
  };

  const { theme, onRemoveLinkAtSelection } = props;
  const store = props.store.getEditorState?.();
  const hasLinkSelected = store ? EditorUtils.hasEntity(store, 'LINK') : false;
  const className = hasLinkSelected
    ? clsx(theme.button, theme.active)
    : theme.button;

  return (
    <div className={theme.buttonWrapper} onMouseDown={onMouseDown}>
      <button
        className={className}
        onClick={hasLinkSelected ? onRemoveLinkAtSelection : onAddLinkClick}
        type="button"
      >
        <svg
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
        </svg>
      </button>
    </div>
  );
};

LinkButton.propTypes = {
  placeholder: PropTypes.string,
  store: PropTypes.object.isRequired,
  ownTheme: PropTypes.object.isRequired,
  onRemoveLinkAtSelection: PropTypes.func.isRequired,
  validateUrl: PropTypes.func,
};

export default LinkButton;
