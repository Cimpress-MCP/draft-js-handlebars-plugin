/**
 * Decorator strategy defines how we are finding elements a decorator should be applied to
 * In this case, we are taking all entities of type PLACEHOLDER
 *
 * @param contentBlock
 * @param callback
 * @param contentState
 */
export default (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return entityKey !== null && contentState.getEntity(entityKey).getType() === 'PLACEHOLDER';
      },
      callback
  );
};
