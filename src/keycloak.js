import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'https://www.cats.com.kh/auth',
    realm: 'cats',
    clientId: 'incident-system-frontend',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;