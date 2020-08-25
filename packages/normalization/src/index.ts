interface Entity {
  id: string;
  type: string;
  [key: string]: any;
}
interface NormalizedEntity {
  id: string;
  type: string;
}
interface Entities {
  [key: string]: { [key: string]: Entity };
}
interface Schema {
  type: string;
  relationships: {
    [key: string]: string | {};
  };
}

const entitiesEmptyMap = (schemaMap: Record<string, {}>) => {
  return Object.keys(schemaMap).reduce((result, type) => {
    // @ts-ignore
    result[type] = {};
    return result;
  }, {});
};

const initService = (schemaMap: { [key: string]: Schema }) => {
  const cache: { [key: string]: any } = entitiesEmptyMap(schemaMap);
  const cacheEntities: { [key: string]: any } = entitiesEmptyMap(schemaMap);
  const prevEntities: { [key: string]: any } = entitiesEmptyMap(schemaMap);

  const normalizeRelationships = (
    entityState: { [key: string]: any },
    relationships: { [key: string]: any },
    entities: Entities
  ) => {
    const result = { ...entityState } as Record<string, any>;
    for (const attribute in relationships) {
      const relationshipType = relationships[attribute];
      let normalizedRelationshipValue;
      const relationshipValue = entityState[attribute];
      if (typeof relationshipType === "object") {
        // Nested relationships normalization
        normalizedRelationshipValue = normalizeRelationships(
          entityState[attribute],
          relationshipType,
          entities
        );
      } else if (Array.isArray(relationshipValue)) {
        normalizedRelationshipValue = [];
        for (let i = 0; i < relationshipValue.length; i++) {
          const { result } = normalize(relationshipValue[i], entities);
          normalizedRelationshipValue.push(result.id);
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const { result } = normalize(relationshipValue, entities);
        normalizedRelationshipValue = result.id;
      }
      result[attribute] = normalizedRelationshipValue;
    }
    return result;
  };

  const normalize = (
    entity: Entity,
    entities: { [key: string]: any } = entitiesEmptyMap(schemaMap)
  ) => {
    const type = entity.type;
    const schema = schemaMap[type];

    const normalizedEntity = normalizeRelationships(
      entity,
      schema.relationships,
      entities
    );

    cache[entity.type][entity.id] = entity;
    entities[type][normalizedEntity.id] = normalizedEntity;

    return { result: normalizedEntity, entities };
  };

  const denormalizeState = (
    entityState: { [key: string]: any },
    cachedEntityState: { [key: string]: any },
    prevEntityState: { [key: string]: any },
    relationships: Record<string, any>,
    entities: Entities
  ) => {
    let changed = entityState !== prevEntityState;
    const relationshipEntities = {} as Record<string, any>;
    for (const attribute in relationships) {
      const type = relationships[attribute];
      const relationshipSchema = schemaMap[type];
      const relationshipValue = entityState[attribute];
      let freshValue;
      if (typeof type === "object") {
        // Nested relationships denormalization
        freshValue = denormalizeState(
          entityState[attribute],
          cachedEntityState[attribute],
          prevEntityState?.[attribute],
          type,
          entities
        );
      } else if (Array.isArray(relationshipValue)) {
        let collectionChanged =
          cachedEntityState[attribute].length !== relationshipValue.length;
        let index = 0;
        freshValue = [];
        while (index < relationshipValue.length) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          const item = denormalize(
            relationshipValue[index],
            relationshipSchema.type,
            entities
          );
          if (cachedEntityState[attribute][index] !== item) {
            collectionChanged = true;
          }
          freshValue.push(item);
          index++;
        }

        if (!collectionChanged) {
          freshValue = cachedEntityState[attribute];
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        freshValue = denormalize(
          relationshipValue,
          relationshipSchema.type,
          entities
        );
      }
      if (cachedEntityState[attribute] !== freshValue) {
        changed = true;
      }
      relationshipEntities[attribute] = freshValue;
    }
    return changed
      ? { ...entityState, ...relationshipEntities }
      : cachedEntityState;
  };

  function denormalize(id: string, type: string, entities: Entities) {
    const schema = schemaMap[type];
    const entity = entities?.[type][id];
    if (!entity) {
      return;
    }
    const prevEntity = prevEntities?.[type][id];
    const cachedEntity = cache[type][id] || {};
    if (cacheEntities[type][id] === entities) {
      return cachedEntity;
    }
    const freshEntity = denormalizeState(
      entity,
      cachedEntity,
      prevEntity,
      schema.relationships,
      entities
    );
    if (freshEntity !== cachedEntity) {
      cache[type][id] = freshEntity;
      cacheEntities[type][id] = entities;
      prevEntities[type][id] = entity;
    }
    return freshEntity;
  }
  return { normalize, denormalize };
};

export default initService;
