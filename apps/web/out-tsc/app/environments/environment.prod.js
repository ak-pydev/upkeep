export const environment = {
    production: true,
    // Billing is still required before Cloud Run can be enabled for this project.
    apiBaseUrl: 'https://upkeep-api-REPLACE.a.run.app',
    useEmulators: false,
    firebase: {
        apiKey: 'AIzaSyBN88G4STfsK82UbOli0yji1dmdQVPi5Qo',
        authDomain: 'upkeep-dev-493800.firebaseapp.com',
        projectId: 'upkeep-dev-493800',
        appId: '1:908428850871:web:b2b27e90e82a81983a7f32',
    },
};
