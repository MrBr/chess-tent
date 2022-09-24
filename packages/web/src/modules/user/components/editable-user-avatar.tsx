import React, { useEffect } from 'react';
import { css } from '@chess-tent/styled-props';
import { components, hoc, hooks, requests, ui, utils } from '@application';
import { updateSubject } from '@chess-tent/models';
import { FileUploaderProps } from '@types';

const { UserAvatar } = components;
const { Icon, Spinner } = ui;
const { withFiles } = hoc;
const { useApi, useActiveUserRecord } = hooks;
const { getFileImageDimensions } = utils;

interface EditableUserAvatarProps extends FileUploaderProps {}

const { className } = css`
  '.edit-badge': {
    position: absolute;
    text-align: center;
    background: #fff;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    bottom: 0;
    right: 0;
    border: 1px solid #ccc;
  }
  position: relative;
  display: inline-block;
`;

const EditableUserAvatar = withFiles<EditableUserAvatarProps>(
  ({ files, openFileDialog }) => {
    const { update, save, value: user } = useActiveUserRecord();
    const {
      fetch: signImage,
      response: signImageResponse,
      loading: signingImage,
      reset: resetSignedImage,
    } = useApi(requests.signImageUrl);
    const {
      fetch: uploadImage,
      response: uploadImageResponse,
      loading: uploadingImage,
      reset: resetUploadedImage,
    } = useApi(requests.uploadImage);

    useEffect(() => {
      if (files.length === 0) {
        return;
      }
      getFileImageDimensions(files[0]).then(({ width, height }) => {
        if (width !== height) {
          alert(
            'Please select square image (width and height must be the same).',
          );
          return;
        }
        signImage({
          contentType: files[0].type,
          key: user.id,
        });
      });
    }, [files, signImage, user.id]);

    useEffect(() => {
      if (signImageResponse?.data && files.length > 0) {
        uploadImage(signImageResponse.data, files[0]);
      }
    }, [signImageResponse, files, uploadImage]);

    useEffect(() => {
      if (uploadImageResponse && signImageResponse) {
        resetSignedImage();
        resetUploadedImage();
        // TODO - find a better way for unique image url
        //  `t` is added to invalidate cache
        const imageUrl = uploadImageResponse + '?t=' + Date.now();
        update(updateSubject(user, { state: { imageUrl } }));
        save();
      }
    }, [
      uploadImageResponse,
      signImageResponse,
      update,
      resetUploadedImage,
      resetSignedImage,
      user,
      save,
    ]);

    return (
      <div className={className} onClick={openFileDialog}>
        {signingImage || uploadingImage ? (
          <Spinner animation="grow" />
        ) : (
          <>
            <div className="edit-badge">
              <Icon type="edit" size="small" />
            </div>
            <UserAvatar user={user} size="large" />
          </>
        )}
      </div>
    );
  },
);
export default EditableUserAvatar;
