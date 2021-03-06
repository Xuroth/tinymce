import { Chain, Log, Pipeline, UiFinder } from '@ephox/agar';
import { Editor } from '@ephox/mcagar';
import { Body } from '@ephox/sugar';
import ImagePlugin from 'tinymce/plugins/image/Plugin';
import SilverTheme from 'tinymce/themes/silver/Theme';

import {
  cAssertCleanHtml,
  cExecCommand,
  cFakeEvent,
  cFillActiveDialog,
  cOpFromChains,
  cSubmitDialog,
  cWaitForDialog,
  generalTabSelectors,
  silverSettings,
} from '../../module/Helpers';
import { UnitTest } from '@ephox/bedrock-client';

UnitTest.asynctest('Image recognizes relative src url and prepends relative image_prepend_url setting.', (success, failure) => {
  SilverTheme();
  ImagePlugin();
  const prependUrl = 'testing/images/';
  Pipeline.async({}, [
    Log.chainsAsStep('TBA', 'Image: image recognizes relative src url and prepends relative image_prepend_url setting.', [
      Editor.cFromSettings({
        ...silverSettings,
        image_prepend_url: prependUrl
      }),
      cExecCommand('mceImage', true),
      cWaitForDialog(),
      cFillActiveDialog({
        src: {
          value: 'src'
        },
        alt: 'alt'
      }),
      cOpFromChains([
        Chain.inject(Body.body()),
        UiFinder.cFindIn(generalTabSelectors.src),
        cFakeEvent('change')
      ]),
      cSubmitDialog(),
      cAssertCleanHtml('Checking output', '<p><img src="' + prependUrl + 'src" alt="alt" /></p>'),
      Editor.cRemove
    ])
  ], () => success(), failure);
});
