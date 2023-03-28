/**
 * @typedef {object} JsonApiResponse
 * @property {Record<string, any>|Record<string, any>[]} data
 * @property {Record<string, any>[]} included
 * @property {Record<string, any>} meta
 */

/**
 * @typedef {object} MapPropertyOptions
 * @property {any} [defaultValue]
 * @property {string} path
 * @property {function[]} [sanitizers]
 */

/**
 * Map a single property.
 * @param {MapPropertyOptions} options
 */
export function mapProperty({ defaultValue = undefined, path, sanitizers = [] }) {
    const keys = path.split('.');

    return {
        denormalize: ({ jsonApiResource }) => {
            let value = jsonApiResource;

            /**
             * Example:
             * keys = ['meta', 'createDate']
             * value = jsonApiResource = { meta: { createDate: '589631375' } }
             *
             * First loop: key = meta, value = { createDate: '589631375' }
             * Second loop: key = createDate, value = '589631375'
             */
            for (const key of keys) {
                value = value ? value[key] : undefined;
            }

            return value ?? defaultValue;
        },
        normalize: ({ isPatchMode, jsonApiResource, property, resource }) => {
            let propertyValue = resource[property];
            if (isPatchMode && propertyValue === undefined) return;

            let value = jsonApiResource;

            /**
             * Example:
             * keys = ['meta', 'createDate']
             * propertyValue = '589631375'
             * value = jsonApiResource = {}
             *
             * First loop: key = meta, value = { meta: {} }
             * Second loop: key = createDate, value = { meta: { createDate: '589631375' } }
             */
            for (const key of keys) {
                const index = keys.indexOf(key);
                const isLastKey = index === keys.length - 1;

                // If we are in the last iteration of the loop, we set the final property value.
                if (isLastKey) {
                    for (const sanitizer of sanitizers) {
                        propertyValue = sanitizer(propertyValue);
                    }
                    value[key] = propertyValue ?? defaultValue;
                    // eslint-disable-next-line no-continue
                    continue;
                }

                // If an object for the current key already exist we use it otherwise we create a
                // new object.
                value[key] = value[key] || {};
                // Set up the value for the next iteration of the loop.
                value = value[key];
            }
        },
    };
}

/**
 * @typedef {object} MapRelationshipOptions
 * @property {function} denormalizer
 * @property {string} name
 */

/**
 * Map a single relationship.
 * @param {MapRelationshipOptions} options
 */
export function mapRelationship({ denormalizer, name }) {
    return {
        denormalize: ({ included, jsonApiResource }) => {
            const data = jsonApiResource?.relationships?.[name]?.data;
            // There are 2 different forms of data either [{}] or {}.
            const relationships = Array.isArray(data) ? data : [data];
            const denormalizedRelationships = relationships.map((relationship) => {
                const relationshipJsonApiResource = relationship
                    && included.find(includedResource => includedResource.id === relationship.id
                        && includedResource.type === relationship.type);
                return denormalizer({ included, jsonApiResource: relationshipJsonApiResource });
            });
            return Array.isArray(data) ? denormalizedRelationships : denormalizedRelationships[0];
        },
        normalize: ({ property, jsonApiResource, resource }) => {
            // When preparing a PATCH request we don't want to remove
            // relationships for properties not included in the resource.
            if (!resource[property]) return;

            // eslint-disable-next-line no-param-reassign
            jsonApiResource.relationships = jsonApiResource.relationships || {};
            // eslint-disable-next-line no-param-reassign
            jsonApiResource.relationships[property] = {
                // If there is no `id` we remove the relationship by setting the
                // `data` to `null`.
                data: resource[property].id ? {
                    type: resource[property].type,
                    id: resource[property].id,
                } : null,
            };
        },
    };
}

/**
 * Map an array of relationships.
 * @param {MapRelationshipOptions} options
 */
export function mapRelationships({ denormalizer, name }) {
    return {
        denormalize: ({ included, jsonApiResource }) => {
            const relationships = jsonApiResource?.relationships?.[name]?.data;
            // If relationships are not included in the response, we mark the field as `undefined`.
            // Previously we returned an empty array but this is problematic when it comes to
            // caching (responses without relationships override previous responses with
            // relationships) and makes it impossible to determine if a resource really has no
            // relationships or they just weren't included in the reponse.
            if (!Array.isArray(relationships)) return undefined;

            // To get denormalized data when no matched relation between 'included' and 'relationship',
            // it returns only the concerned data (e.g || relationship).
            return relationships.map((relationship) => {
                const relationshipJsonApiResource = (relationship
                    && included.find(includedJsonApiResource => includedJsonApiResource.id === relationship.id
                        && includedJsonApiResource.type === relationship.type)) || relationship;

                return denormalizer({ included, jsonApiResource: relationshipJsonApiResource });
            });
        },
        normalize: () => undefined,
    };
}

/**
 * @typedef {object} MakeDenormalizerOptions
 * @property {Record<string, any>} map
 */

/**
 * Create a denormalizer for flattening and denormalizing a JSON:API formated
 * resource by merging attributes, meta, and relationships.
 * @param {MakeDenormalizerOptions} options
 */
export function makeDenormalizer({ map }) {
    return ({ included, jsonApiResource }) => {
        const resource = {};

        for (const [property, mapper] of Object.entries(map)) {
            resource[property] = mapper.denormalize({ included, jsonApiResource });
        }
        return resource;
    };
}

/**
 * @typedef {object} MakeNormalizerOptions
 * @property {Record<string, any>} map
 */

/**
 * Create a normalizer for converting a flattened and denormalized resource into
 * a JSON:API compatible resource.
 * @param {MakeNormalizerOptions} options
 */
export function makeNormalizer({ map }) {
    return ({ isPatchMode = false, resource }) => {
        const jsonApiResource = {};

        for (const [property, mapper] of Object.entries(map)) {
            mapper.normalize({ isPatchMode, jsonApiResource, property, resource });
        }

        return jsonApiResource;
    };
}

/**
 * @typedef {object} DenormalizeResponseOptions
 * @property {function} denormalizer
 * @property {JsonApiResponse} response
 */

/**
 * Denormalize a JSON:API response.
 * @param {DenormalizeResponseOptions} options
 */
export function denormalizeResponse({
    denormalizer,
    response: { data, included, meta },
}) {
    return {
        data: Array.isArray(data)
            ? data.map(jsonApiResource => denormalizer({ included, jsonApiResource }))
            : denormalizer({ included, jsonApiResource: data }),
        meta: {
            ...meta,
        },
    };
}
