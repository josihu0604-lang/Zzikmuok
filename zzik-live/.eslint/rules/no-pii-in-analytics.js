/**
 * ESLint Rule: no-pii-in-analytics
 * 
 * Prevents PII (Personally Identifiable Information) and exact coordinates
 * from being sent in analytics track() calls.
 * 
 * Forbidden fields:
 * - Coordinates: lat, lng, latitude, longitude
 * - PII: email, phone, address, password, ssn
 * - Identifiers: name, full_name, first_name, last_name
 * 
 * This rule enforces privacy policy at build time.
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow PII and exact coordinates in analytics events',
      category: 'Security',
      recommended: true,
    },
    messages: {
      forbiddenProp: 'Analytics property "{{prop}}" is forbidden (PII/coordinates policy violation)',
    },
    schema: [], // No options
  },

  create(context) {
    // List of forbidden property names (case-insensitive)
    const FORBIDDEN_PROPS = new Set([
      // Coordinates
      'lat',
      'lng',
      'latitude',
      'longitude',
      'coords',
      'coordinates',
      'latlng',
      // PII
      'email',
      'phone',
      'telephone',
      'mobile',
      'address',
      'street',
      'city',
      'zip',
      'zipcode',
      'postal',
      'password',
      'ssn',
      'social_security',
      'credit_card',
      'card_number',
      // Names
      'name',
      'full_name',
      'fullname',
      'first_name',
      'firstname',
      'last_name',
      'lastname',
      'username',
    ]);

    function checkObjectExpression(node) {
      if (node.type !== 'ObjectExpression') return;

      for (const prop of node.properties) {
        if (prop.type !== 'Property') continue;

        let keyName = '';
        
        if (prop.key.type === 'Identifier') {
          keyName = prop.key.name;
        } else if (prop.key.type === 'Literal') {
          keyName = String(prop.key.value);
        }

        const lowerKey = keyName.toLowerCase();

        if (FORBIDDEN_PROPS.has(lowerKey)) {
          context.report({
            node: prop.key,
            messageId: 'forbiddenProp',
            data: {
              prop: keyName,
            },
          });
        }

        // Recursively check nested objects
        if (prop.value.type === 'ObjectExpression') {
          checkObjectExpression(prop.value);
        }
      }
    }

    return {
      CallExpression(node) {
        const { callee, arguments: args } = node;

        // Check for track() calls
        let isTrackCall = false;

        if (callee.type === 'Identifier' && callee.name === 'track') {
          isTrackCall = true;
        } else if (
          callee.type === 'MemberExpression' &&
          callee.property.type === 'Identifier' &&
          callee.property.name === 'track'
        ) {
          isTrackCall = true;
        }

        if (!isTrackCall || args.length < 2) return;

        // Second argument is props object
        const propsArg = args[1];

        if (propsArg.type === 'ObjectExpression') {
          checkObjectExpression(propsArg);
        }
      },
    };
  },
};
