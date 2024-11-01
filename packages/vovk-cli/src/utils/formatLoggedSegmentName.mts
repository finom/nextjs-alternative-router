import upperFirstLodash from 'lodash/upperFirst.js';
import chalkHighlightThing from './chalkHighlightThing.mjs';

export default function formatLoggedSegmentName(
  segmentName: string,
  { withChalk = true, upperFirst = false }: { withChalk?: boolean; upperFirst?: boolean } = {}
) {
  let text = segmentName ? `segment "${segmentName}"` : 'the root segment';
  text = upperFirst ? upperFirstLodash(text) : text;

  return withChalk ? chalkHighlightThing(text) : text;
}
